import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Sidebar from "../Admin/Sidebar.jsx"; // Adjust path if needed

let socket; // singleton socket instance

export default function AgentChat({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Initialize socket once
  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:3000"); // your server URL
    }
  }, []);

  // Handle room join and receiving messages
  useEffect(() => {
    if (!roomId) return;

    socket.emit("joinRoom", roomId);

    const handleMessage = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [roomId]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const msg = { roomId, sender: "agent", text };
    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* your admin sidebar */}

      <div className="flex-1 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2">Chat with Customer</h2>

        <div className="border p-2 flex-1 overflow-y-auto mb-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.sender === "agent" ? "text-right mb-1" : "text-left mb-1"}
            >
              <p
                className={`inline-block px-3 py-1 rounded-lg ${
                  m.sender === "agent" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border px-2 py-1"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-3 ml-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
