import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const socket = io("http://localhost:3000"); // your backend URL

export default function CustomerChat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const messagesEndRef = useRef(null);

  // Generate a unique ID for guest customer
  useEffect(() => {
    const id = uuidv4();
    setCustomerId(id);
  }, []);

  // Join room and listen to messages
  useEffect(() => {
    if (!customerId) return;

    socket.emit("joinRoom", customerId);

    const handleMessage = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [customerId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const msg = { roomId: customerId, sender: "customer", text };
    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white border shadow-lg rounded-lg flex flex-col" data-aos="fade-up">
      <div className="bg-[#E8611A] text-white p-2 font-bold rounded-t-lg">
        Live Chat
      </div>

      <div className="p-2 h-60 overflow-y-auto flex-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.sender === "customer" ? "text-right mb-1" : "text-left mb-1"}
          >
            <p
              className={`inline-block px-3 py-1 rounded-lg ${
                m.sender === "customer" ? "bg-[#E8611A] text-white" : "bg-gray-200"
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-2 py-1 outline-none"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-[#E8611A] text-white px-3">
          Send
        </button>
      </div>
    </div>
  );
}
