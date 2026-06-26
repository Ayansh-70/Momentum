import { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';

interface AgentChatProps {
  isOpen: boolean;
  onClose: () => void;
  
}

export default function AgentChat({ isOpen, onClose }: AgentChatProps) {
  const [messages, setMessages] = useState<{ role: "user" | "agent"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading) return;
    
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Network response was not ok");
      }
      
      setMessages(prev => [...prev, { role: "agent", content: data.reply }]);
    } catch (e: any) {
      console.error(e);
      setMessages(prev => [...prev, { role: "agent", content: e.message || "The Agent Core is unavailable. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-full max-w-sm z-40 bg-[#0a0a0f] border-l border-white/10 backdrop-blur-md flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* DRAWER HEADER */}
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-primary block mb-1">AGENT CORE</span>
          <h2 className="text-sm font-semibold text-foreground">Chat with your queue</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm transition-colors cursor-pointer text-muted-foreground bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center w-8 h-8 shrink-0"
        >
          ✕
        </button>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col justify-center h-full gap-3 mt-4">
            <button onClick={() => handleSend("What should I work on first?")} className="w-full text-left bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground/60 hover:bg-white/10 hover:text-foreground transition-all">What should I work on first?</button>
            <button onClick={() => handleSend("Am I going to miss any deadlines?")} className="w-full text-left bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground/60 hover:bg-white/10 hover:text-foreground transition-all">Am I going to miss any deadlines?</button>
            <button onClick={() => handleSend("How much work do I have left?")} className="w-full text-left bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground/60 hover:bg-white/10 hover:text-foreground transition-all">How much work do I have left?</button>
            <button onClick={() => handleSend("Which task is most at risk?")} className="w-full text-left bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground/60 hover:bg-white/10 hover:text-foreground transition-all">Which task is most at risk?</button>
            <button onClick={() => handleSend("Give me a full workload summary.")} className="w-full text-left bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground/60 hover:bg-white/10 hover:text-foreground transition-all">Give me a full workload summary.</button>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              {msg.role === "agent" && (
                <span className="text-[10px] uppercase tracking-widest text-primary/60 mb-1 ml-1">AGENT CORE</span>
              )}
              <div className={`max-w-[85%] px-4 py-3 text-sm ${
                msg.role === "user" 
                  ? "bg-primary/20 border border-primary/30 rounded-2xl rounded-tr-sm text-foreground ml-auto" 
                  : "bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm text-foreground/90 mr-auto whitespace-pre-wrap"
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-widest text-primary/60 mb-1 ml-1">AGENT CORE</span>
            <div className="max-w-[85%] px-4 py-3 bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm mr-auto">
              <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA */}
      <div className="px-6 py-4 border-t border-white/10 flex-shrink-0 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Ask the Agent Core..."
          className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          disabled={loading}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || (!input.trim() && !loading)}
          className="bg-primary text-primary-foreground w-11 h-11 rounded-xl flex items-center justify-center hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(252,100,68,0.2)] shrink-0 font-bold"
        >
          {loading ? (
             <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
             "→"
          )}
        </button>
      </div>
    </div>
  );
}
