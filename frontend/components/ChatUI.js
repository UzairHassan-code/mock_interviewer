// D:\mock_interview\frontend\components\ChatUI.js
import { useState, useRef, useEffect } from "react";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { text: "👋 Hi! Ready for your mock interview?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Dynamically import animejs to avoid SSR issues
    import("animejs").then((mod) => {
      const anime = mod.default || mod.anime || mod; // Handle all export shapes

      if (typeof anime === "function") {
        anime({
          targets: ".message",
          translateY: [20, 0],
          opacity: [0, 1],
          easing: "easeOutExpo",
          duration: 500,
          delay: anime.stagger(100),
        });
      } else {
        console.error("AnimeJS could not be loaded correctly:", mod);
      }
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:8000/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = {
        text: data.reply || "Hmm, I didn't get that.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching from backend:", error);
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Error connecting to interview bot.", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-6">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message max-w-lg px-4 py-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-500 self-end ml-auto"
                : "bg-gray-700 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input field */}
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-1 p-2 rounded-l-lg text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 px-4 py-2 rounded-r-lg hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
