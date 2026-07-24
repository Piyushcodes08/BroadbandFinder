import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Create socket lazily so VITE_API_URL is resolved at runtime
let socket;
function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL);
  }
  return socket;
}

export default function CustomerChat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Start conversation when chat is opened
  useEffect(() => {
    if (!isOpen) return;

    const sock = getSocket();

    // Restore existing conversation from sessionStorage
    const savedId = sessionStorage.getItem("conversationId");
    sock.emit("start_conversation", {
      role: "customer",
      name: "Guest",
      conversationId: savedId || undefined,
    });

    sock.on("conversation_ready", ({ conversationId: id }) => {
      setConversationId(id);
      sessionStorage.setItem("conversationId", id);
    });

    const handleMessage = (msg) => setMessages((prev) => [...prev, msg]);
    sock.on("new_message", handleMessage);

    return () => {
      sock.off("conversation_ready");
      sock.off("new_message", handleMessage);
    };
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !conversationId) return;

    getSocket().emit("send_message", {
      conversationId,
      text: text.trim(),
      senderRole: "customer",
    });
    setText("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-[#E8611A] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#C44E12] transition z-50"
        aria-label="Open live chat"
      >
        💬 Live Chat
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-5 right-5 w-80 bg-white border shadow-lg rounded-lg flex flex-col z-50"
      data-aos="fade-up"
    >
      <div className="bg-[#E8611A] text-white p-2 font-bold rounded-t-lg flex justify-between items-center">
        <span>Live Chat</span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white text-lg leading-none"
          aria-label="Close chat"
        >
          ×
        </button>
      </div>

      <div className="p-2 h-60 overflow-y-auto flex-1">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-4">
            Send a message to start chatting.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={m._id || i}
            className={
              m.senderRole === "customer" ? "text-right mb-1" : "text-left mb-1"
            }
          >
            <p
              className={`inline-block px-3 py-1 rounded-lg text-sm ${
                m.senderRole === "customer"
                  ? "bg-[#E8611A] text-white"
                  : "bg-gray-200 text-gray-800"
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
          className="flex-1 px-2 py-1 outline-none text-sm"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-[#E8611A] text-white px-3 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
