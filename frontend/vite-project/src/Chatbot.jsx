import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

function ChatBot({ onClose }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Track if AI is thinking
  
  // Ref to automatically scroll to the bottom of the chat
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, isLoading]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return; // Prevent empty messages or double-sending
  
    const userMessage = { sender: "user", text: message };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });
  
      // If the server returns a 404 or 500, catch it here before parsing JSON
      if (!res.ok) {
        const errorData = await res.text();
        console.error("Server Error:", errorData);
        throw new Error("Failed to connect to the maternal care assistant.");
      }

      const data = await res.json();
  
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: data.reply }
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "I'm having trouble connecting to the server. Please ensure the backend is running." }
      ]);
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
    }
  };

  // Styles for a cleaner look
  const styles = {
    container: {
      padding: "20px",
      width: "100%",
      border: "none",
      borderRadius: "16px",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      borderBottom: "1px solid #e0e0e0",
      paddingBottom: "10px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
      margin: 0,
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "28px",
      cursor: "pointer",
      color: "#666",
      transition: "color 0.3s ease",
    },
    chatWindow: {
      height: "400px",
      overflowY: "scroll",
      border: "1px solid #e0e0e0",
      padding: "15px",
      borderRadius: "12px",
      backgroundColor: "#fafafa",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      scrollbarWidth: "thin",
      scrollbarColor: "#c0c0c0 #f0f0f0",
    },
    bubble: (sender) => ({
      alignSelf: sender === "user" ? "flex-end" : "flex-start",
      backgroundColor: sender === "user" ? "#667eea" : "#fff",
      color: sender === "user" ? "white" : "#333",
      padding: "12px 18px",
      borderRadius: sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
      maxWidth: "75%",
      wordWrap: "break-word",
      fontSize: "15px",
      boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
      border: sender === "bot" ? "1px solid #e0e0e0" : "none",
      position: "relative",
    }),
    inputArea: {
      display: "flex",
      marginTop: "20px",
      gap: "12px",
    },
    input: {
      flex: 1,
      padding: "12px 16px",
      borderRadius: "25px",
      border: "1px solid #ddd",
      outline: "none",
      fontSize: "16px",
      transition: "border-color 0.3s ease",
    },
    button: {
      padding: "12px 24px",
      borderRadius: "25px",
      border: "none",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#fff",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      opacity: isLoading ? 0.6 : 1,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Nestcare+ Assistant</h2>
        <button
          onClick={onClose}
          style={styles.closeButton}
          onMouseEnter={(e) => (e.target.style.color = "#000")}
          onMouseLeave={(e) => (e.target.style.color = "#666")}
        >
          ×
        </button>
      </div>

      <div style={styles.chatWindow}>
        {chat.map((msg, index) => (
          <div key={index} style={styles.bubble(msg.sender)}>
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong>{" "}
            {msg.sender === "bot" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}
        {isLoading && (
          <div style={styles.bubble("bot")}>
            <em>Nestcare+ is typing...</em>
            <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
              <div style={{ width: "6px", height: "6px", backgroundColor: "#667eea", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out both" }}></div>
              <div style={{ width: "6px", height: "6px", backgroundColor: "#667eea", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out 0.2s both" }}></div>
              <div style={{ width: "6px", height: "6px", backgroundColor: "#667eea", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out 0.4s both" }}></div>
            </div>
            <style>{`
              @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
              }
            `}</style>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about pregnancy, postpartum or baby care..."
          disabled={isLoading}
          onFocus={(e) => (e.target.style.borderColor = "#667eea")}
          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
        />
        <button
          style={styles.button}
          onClick={sendMessage}
          disabled={isLoading}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatBot;