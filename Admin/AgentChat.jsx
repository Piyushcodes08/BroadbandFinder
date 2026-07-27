import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Send, MessageSquare } from "lucide-react";
import AdminLayout, { AdminCard } from "./AdminLayout";

let socket;

export default function AgentChat({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) socket = io(import.meta.env.VITE_API_URL);
    const agentName = localStorage.getItem("agentName") || "Admin Agent";
    socket.emit("join_as_agent", { agentName });
    return () => { socket.off("agent_ready"); };
  }, []);

  useEffect(() => {
    if (!conversationId || !socket) return;
    socket.emit("agent_join_conversation", { conversationId });
    const handle = (msg) => setMessages((p) => [...p, msg]);
    socket.on("new_message", handle);
    return () => socket.off("new_message", handle);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !conversationId) return;
    socket.emit("send_message", { conversationId, text: text.trim(), senderRole: "agent" });
    setText("");
  };

  return (
    <AdminLayout
      title="Agent Chat"
      subtitle={conversationId ? `Conversation: ${conversationId}` : "No conversation selected."}
    >
      <div className="max-w-3xl flex flex-col gap-3" style={{ height: "calc(100vh - 160px)" }}>
        {/* Messages */}
        <AdminCard className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <MessageSquare size={36} style={{ color: "var(--admin-border)" }} />
              <p className="text-sm" style={{ color: "var(--admin-text-secondary)" }}>
                {conversationId ? "No messages yet." : "Select a conversation to start chatting."}
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={m._id || i} className={`flex ${m.senderRole === "agent" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm"
                  style={m.senderRole === "agent"
                    ? { backgroundColor: "var(--admin-accent)", color: "#fff", borderBottomRightRadius: "4px" }
                    : { backgroundColor: "var(--admin-page-bg)", color: "var(--admin-text-primary)", border: "1px solid var(--admin-border)", borderBottomLeftRadius: "4px" }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </AdminCard>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={!conversationId}
            placeholder={conversationId ? "Type a message…" : "No conversation selected"}
            className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition disabled:opacity-50"
            style={{ backgroundColor: "var(--admin-card-bg)", borderColor: "var(--admin-border)", color: "var(--admin-text-primary)" }}
          />
          <button
            onClick={sendMessage}
            disabled={!conversationId || !text.trim()}
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-40"
            style={{ backgroundColor: "var(--admin-accent)" }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
