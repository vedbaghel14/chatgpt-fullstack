const styles = {
  messageRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    animation: 'fadeIn 0.4s ease forwards',
  },
  messageRowUser: {
    flexDirection: 'row-reverse',
  },
  messageRowAI: {
    flexDirection: 'row',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  avatarUser: {
    background: 'var(--gradient-1)',
    color: '#fff',
  },
  avatarAI: {
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
    position: 'relative',
  },
  bubbleUser: {
    background: 'var(--gradient-1)',
    backgroundSize: '200% 200%',
    color: '#fff',
    borderBottomRightRadius: '4px',
  },
  bubbleAI: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderBottomLeftRadius: '4px',
  },
  content: {
    whiteSpace: 'pre-wrap',
  },
  timestamp: {
    fontSize: '11px',
    opacity: 0.5,
    marginTop: '6px',
  },
};

export default function Message({ msg, isUser, firstname }) {
  return (
    <div style={{ ...styles.messageRow, ...(isUser ? styles.messageRowUser : styles.messageRowAI) }}>
      <div style={{ ...styles.avatar, ...(isUser ? styles.avatarUser : styles.avatarAI) }}>
        {isUser ? (firstname || 'U')[0].toUpperCase() : '✨'}
      </div>
      <div style={{ ...styles.bubble, ...(isUser ? styles.bubbleUser : styles.bubbleAI) }}>
        <div style={styles.content}>{msg.content}</div>
        <div style={styles.timestamp}>
          {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}