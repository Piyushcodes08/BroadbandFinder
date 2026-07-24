import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Sidebar from "../Admin/Sidebar.jsx";

let socket; // singleton socket instance

export default function AgentChat({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [agentId, setAgentId] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize socket and register as agent once
  useEffect(() => {
    if (!socket) {
      socket = io(import.meta.env.VITE_API_URL);
    }

    // Register agent
    const agentName = localStorage.getItem("agentName") || "Admin Agent";
    socket.emit("join_as_agent", { agentName });

    socket.on("agent_ready", ({ agentId: id }) => {
      setAgentId(id);
    });

    return () => {
      socket.off("agent_ready");
    };
  }, []);

  // Join conversation room and listen for messages
  useEffect(() => {
    if (!conversationId || !socket) return;

    socket.emit("agent_join_conversation", { conversationId });

    const handleMessage = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on("new_message", handleMessage);

    return () => {
      socket.off("new_message", handleMessage);
    };
  }, [conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !conversationId) return;

    socket.emit("send_message", {
      conversationId,
      text: text.trim(),
      senderRole: "agent",
    });
    setText("");
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2">Chat with Customer</h2>

        {!conversationId && (
          <p className="text-gray-500 text-sm mb-2">
            No conversation selected.
          </p>
        )}

        <div className="border p-2 flex-1 overflow-y-auto mb-2">
          {messages.map((m, i) => (
            <div
              key={m._id || i}
              className={
                m.senderRole === "agent"
                  ? "text-right mb-1"
                  : "text-left mb-1"
              }
            >
              <p
                className={`inline-block px-3 py-1 rounded-lg ${
                  m.senderRole === "agent"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
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
            disabled={!conversationId}
          />
          <button
            onClick={sendMessage}
            disabled={!conversationId}
            className="bg-blue-500 text-white px-3 ml-2 rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
