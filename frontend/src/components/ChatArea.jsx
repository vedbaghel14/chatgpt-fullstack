import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import api from '../services/api';
import Message from './Message';

const styles = {
  messageRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    animation: 'fadeIn 0.4s ease forwards',
  },
  avatarAI: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
  },
  bubble: {
    maxWidth: '72%',
    padding: '14px 18px',
    borderRadius: 'var(--radius-lg)',
    fontSize: '15px',
    lineHeight: 1.6,
    wordBreak: 'break-word',
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderBottomLeftRadius: '4px',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: 'var(--bg-primary)',
    position: 'relative',
    minWidth: 0,
  },
  topBar: {
    padding: '16px 24px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'var(--bg-secondary)',
    flexShrink: 0,
    minHeight: '64px',
  },
  toggleBtn: {
    background: 'none',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '6px 10px',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    transition: 'var(--transition)',
    flexShrink: 0,
  },
  chatTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  connectionDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  connectionDotConnected: {
    background: 'var(--success)',
    boxShadow: '0 0 8px rgba(0,210,160,0.5)',
  },
  connectionDotDisconnected: {
    background: 'var(--error)',
    boxShadow: '0 0 8px rgba(255,107,107,0.5)',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  welcomeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '40px',
  },
  welcomeIcon: {
    fontSize: '64px',
    opacity: 0.6,
    animation: 'pulse 2s ease-in-out infinite',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: 800,
    background: 'var(--gradient-1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 4s ease infinite',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    maxWidth: '500px',
    lineHeight: 1.6,
  },
  suggestionsRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '16px',
  },
  suggestionChip: {
    padding: '10px 18px',
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-full)',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'var(--transition)',
  },
  inputBar: {
    padding: '16px 24px',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  inputWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-end',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '8px 12px',
    transition: 'var(--transition)',
    gap: '8px',
  },
  textarea: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '15px',
    fontFamily: 'inherit',
    resize: 'none',
    padding: '8px 4px',
    maxHeight: '120px',
    minHeight: '24px',
    lineHeight: 1.5,
  },
  sendBtn: {
    width: '42px',
    height: '42px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--gradient-1)',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 6s ease infinite',
    border: 'none',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'var(--transition)',
    boxShadow: 'var(--shadow-glow)',
  },
  sendBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '14px 18px',
    alignItems: 'center',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--text-muted)',
  },
};

const suggestions = [
  'Explain quantum computing in simple terms',
  'Write a poem about technology',
  'How does machine learning work?',
  'Tell me a fun fact',
];

export default function ChatArea({ chat, user, onToggleSidebar, sidebarCollapsed, isMobile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { connected, sendMessage, onResponse } = useSocket();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!chat?._id) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const data = await api.getMessages(chat._id);
        setMessages(data.messages || []);
      } catch {
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [chat?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const unsub = onResponse((response) => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { content: response, role: 'model', createdAt: new Date().toISOString() }]);
    });
    return unsub;
  }, [onResponse]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !chat?._id) return;

    const userMsg = { content: trimmed, role: 'user', createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    sendMessage(chat._id, trimmed);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const handleSuggestion = (text) => {
    setInput(text);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  // Mobile helper classes
  const topBarClass = isMobile ? 'topbar-mobile' : '';
  const messagesAreaClass = isMobile ? 'messages-area-mobile' : '';
  const inputBarClass = isMobile ? 'inputbar-mobile' : '';
  const welcomeTitleClass = isMobile ? 'welcome-title-mobile' : '';
  const welcomeSubtitleClass = isMobile ? 'welcome-subtitle-mobile' : '';
  const suggestionsRowClass = isMobile ? 'suggestions-row-mobile' : '';
  const suggestionChipClass = isMobile ? 'suggestion-chip-mobile' : '';
  const sendBtnClass = isMobile ? 'send-btn-mobile' : '';

  if (!chat) {
    return (
      <div style={styles.container} className={isMobile ? 'chat-area-mobile' : ''}>
        <div style={styles.topBar} className={topBarClass}>
          <button style={styles.toggleBtn} onClick={onToggleSidebar}>
            {sidebarCollapsed ? '☰' : '✕'}
          </button>
          <span style={styles.chatTitle}>ChatGPT Clone</span>
          <div style={{ ...styles.connectionDot, ...(connected ? styles.connectionDotConnected : styles.connectionDotDisconnected) }} />
        </div>
        <div style={styles.welcomeContainer}>
          <div style={styles.welcomeIcon}>🤖</div>
          <h1 style={styles.welcomeTitle} className={welcomeTitleClass}>Welcome to ChatGPT Clone</h1>
          <p style={styles.welcomeSubtitle} className={welcomeSubtitleClass}>
            Start a new conversation or select an existing chat from the sidebar. Ask me anything — I'm here to help!
          </p>
          <div style={styles.suggestionsRow} className={suggestionsRowClass}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                style={styles.suggestionChip}
                className={suggestionChipClass}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container} className={isMobile ? 'chat-area-mobile' : ''}>
      <div style={styles.topBar} className={topBarClass}>
        <button style={styles.toggleBtn} onClick={onToggleSidebar}>
          {sidebarCollapsed ? '☰' : '✕'}
        </button>
        <span style={styles.chatTitle}>{chat.title || 'Chat'}</span>
        <div
          style={{ ...styles.connectionDot, ...(connected ? styles.connectionDotConnected : styles.connectionDotDisconnected) }}
          title={connected ? 'Connected' : 'Disconnected'}
        />
      </div>

      <div style={styles.messagesArea} className={messagesAreaClass}>
        {messages.length === 0 && (
          <div style={styles.welcomeContainer}>
            <div style={styles.welcomeIcon}>💬</div>
            <h1 style={styles.welcomeTitle} className={welcomeTitleClass}>Start the Conversation</h1>
            <p style={styles.welcomeSubtitle} className={welcomeSubtitleClass}>Send a message below to chat with ChatGPT</p>
            <div style={styles.suggestionsRow} className={suggestionsRowClass}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  style={styles.suggestionChip}
                  className={suggestionChipClass}
                  onClick={() => handleSuggestion(s)}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} isUser={msg.role === 'user'} firstname={user?.firstname} isMobile={isMobile} />
        ))}
        {isTyping && (
          <div style={styles.messageRow} className={isMobile ? 'msg-row-mobile' : ''}>
            <div style={styles.avatarAI} className={isMobile ? 'msg-avatar-mobile' : ''}>🤖</div>
            <div style={styles.bubble} className={isMobile ? 'msg-bubble-mobile' : ''}>
              <div style={styles.typingIndicator}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.typingDot,
                      animation: `typingBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputBar} className={inputBarClass}>
        <div style={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            style={styles.textarea}
            className={isMobile ? 'textarea-mobile' : ''}
            placeholder="Type your message... (Shift+Enter for new line)"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
            onFocus={(e) => {
              e.currentTarget.parentElement.style.borderColor = 'var(--accent)';
              e.currentTarget.parentElement.style.boxShadow = '0 0 0 3px var(--accent-glow)';
            }}
            onBlur={(e) => {
              e.currentTarget.parentElement.style.borderColor = 'var(--border)';
              e.currentTarget.parentElement.style.boxShadow = 'none';
            }}
          />
        </div>
        <button
          style={{ ...styles.sendBtn, ...(!input.trim() || isTyping ? styles.sendBtnDisabled : {}) }}
          className={sendBtnClass}
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
        >
          ➤
        </button>
      </div>
    </div>
  );
}