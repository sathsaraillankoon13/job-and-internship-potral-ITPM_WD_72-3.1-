import React, { useEffect, useRef, useState } from 'react';
import { Bot, Briefcase, FileText, RotateCcw, Send, Sparkles, User } from 'lucide-react';
import '../styles/AICareerAssistant.css';
import { sendAssistantMessage as sendAssistantMessageApi } from '../api';

const INITIAL_BOT_MESSAGE =
  "Hi! I'm your AI Career Assistant. Ask me anything about careers, resumes, interviews, or job search support.";

const now = () =>
  new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const normalizeWhitespace = (value = '') => String(value).replace(/\s+/g, ' ').trim();

const toApiHistory = (items = []) =>
  items
    .slice(-12)
    .map((item) => {
      if (item?.type !== 'text') {
        return null;
      }

      const content = normalizeWhitespace(item?.content);
      if (!content) {
        return null;
      }

      return {
        role: item.from === 'user' ? 'user' : 'assistant',
        content,
      };
    })
    .filter(Boolean);

const Bubble = ({ msg }) => {
  const isUser = msg.from === 'user';

  return (
    <div className={`bubble-row ${isUser ? 'bubble-row-user' : 'bubble-row-bot'}`}>
      {!isUser ? (
        <div className="bot-avatar">
          <Bot size={16} strokeWidth={2.5} />
        </div>
      ) : null}

      <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-bot'}`}>
        <pre className="bubble-text">{msg.content}</pre>
        <span className="bubble-time">{msg.time}</span>
      </div>

      {isUser ? (
        <div className="user-avatar">
          <User size={16} strokeWidth={2.5} />
        </div>
      ) : null}
    </div>
  );
};

const AICareerAssistant = () => {
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      time: now(),
      content: INITIAL_BOT_MESSAGE,
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (message) => {
    setMessages((current) => [...current, { ...message, time: now() }]);
  };

  const handleAssistantApiReply = async (text, conversation) => {
    try {
      const response = await sendAssistantMessageApi({
        message: text,
        history: toApiHistory(conversation),
      });

      const reply = normalizeWhitespace(response?.reply || '');
      if (!reply) {
        return false;
      }

      addMessage({ from: 'bot', type: 'text', content: reply });
      return true;
    } catch (error) {
      console.error('Assistant API request failed:', error);
      return false;
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const conversationForApi = [...messages, { from: 'user', type: 'text', content: text }];
    addMessage({ from: 'user', type: 'text', content: text });
    setInput('');
    setIsSending(true);

    const handledByApi = await handleAssistantApiReply(text, conversationForApi);
    if (!handledByApi) {
      addMessage({
        from: 'bot',
        type: 'text',
        content:
          'I could not reach the Gemini API just now. Please check the backend server and try again.',
      });
    }

    setIsSending(false);
  };

  const handleQuickAction = (action) => {
    const config = {
      resume: 'Help me build a professional resume.',
      career: 'Give me career advice based on my target role.',
    };

    const selectedAction = config[action];
    if (!selectedAction || isSending) return;

    setInput(selectedAction);
  };

  const handleReset = () => {
    setMessages([
      {
        from: 'bot',
        type: 'text',
        time: now(),
        content: 'Chat reset. Ask me anything again.',
      },
    ]);
    setInput('');
  };

  return (
    <div className="aca-page">
      <div className="aca-header">
        <div className="aca-header-left">
          <div className="aca-bot-icon">
            <Sparkles size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="aca-title">AI Career Assistant</h1>
            <p className="aca-subtitle">Gemini-powered career support</p>
          </div>
        </div>
        <button className="aca-reset-btn" onClick={handleReset} title="Reset chat">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="aca-quick-actions">
        <button className="qa-btn qa-blue" onClick={() => handleQuickAction('resume')} disabled={isSending}>
          <FileText size={15} /> Resume Help
        </button>
        <button className="qa-btn qa-green" onClick={() => handleQuickAction('career')} disabled={isSending}>
          <Briefcase size={15} /> Career Advice
        </button>
      </div>

      <div className="aca-chat-area">
        {messages.map((message, index) => (
          <Bubble
            key={index}
            msg={message}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="aca-input-bar">
        <div className="aca-input-wrapper">
          <input
            className="aca-input"
            placeholder="Ask me anything about careers, resumes, or interviews..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && !isSending && handleSend()}
            disabled={isSending}
          />
          <button className="aca-send-btn" onClick={handleSend} disabled={!input.trim() || isSending}>
            <Send size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICareerAssistant;
