import { useState } from 'react';
import api from '../services/api';

const styles = {
  sidebar: {
    width: '320px',
    minWidth: '320px',
    height: '100vh',
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'var(--transition-slow)',
  },
  sidebarCollapsed: {
    minWidth: '0',
    width: '0',
    overflow: 'hidden',
    padding: 0,
  },
  header: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--gradient-2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    boxShadow: 'var(--shadow-glow)',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: 800,
    background: 'var(--gradient-1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 4s ease infinite',
  },
  newChatBtn: {
    margin: '16px',
    padding: '12px 16px',
    background: 'var(--gradient-1)',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 6s ease infinite',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'inherit',
    transition: 'var(--transition)',
    boxShadow: 'var(--shadow-sm)',
  },
  chatList: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  chatItem: {
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'var(--transition)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: 'var(--text-secondary)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
  },
  chatItemActive: {
    background: 'var(--bg-hover)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
  },
  chatItemIcon: {
    fontSize: '16px',
    opacity: 0.7,
    flexShrink: 0,
  },
  chatItemTitle: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: 500,
  },
  footer: {
    padding: '16px',
    borderTop: '1px solid var(--border)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-tertiary)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--gradient-1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
  },
  userName: {
    flex: 1,
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '12px',
    padding: '6px 10px',
    fontFamily: 'inherit',
    transition: 'var(--transition)',
    flexShrink: 0,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    gap: '12px',
  },
  emptyIcon: {
    fontSize: '40px',
    opacity: 0.3,
  },
  emptyText: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  dialog: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px',
    width: '400px',
    maxWidth: '90vw',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  dialogTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: '0 0 6px 0',
  },
  dialogSubtitle: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: '0 0 20px 0',
  },
  dialogInput: {
    width: '100%',
    padding: '12px 14px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'var(--transition)',
    boxSizing: 'border-box',
    marginBottom: '20px',
  },
  dialogActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  dialogCancelBtn: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  dialogCreateBtn: {
    padding: '10px 20px',
    background: 'var(--gradient-1)',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 6s ease infinite',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
};

export default function Sidebar({ chats, activeChat, onSelectChat, onNewChat, user, onLogout, collapsed }) {
  const [creating, setCreating] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [chatName, setChatName] = useState('');

  const handleNewChatClick = () => {
    setChatName('');
    setShowNameDialog(true);
  };

  const handleCreateChat = async () => {
    const title = chatName.trim() || 'New Chat';
    setShowNameDialog(false);
    setCreating(true);
    try {
      const data = await api.createChat(title);
      onNewChat(data.chat);
    } catch {
      onNewChat({ _id: 'temp-' + Date.now(), title });
    } finally {
      setCreating(false);
    }
  };

  const handleDialogKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCreateChat();
    } else if (e.key === 'Escape') {
      setShowNameDialog(false);
    }
  };

  return (
    <>
      {/* Chat Name Dialog Overlay */}
      {showNameDialog && (
        <div style={styles.overlay} onClick={() => setShowNameDialog(false)}>
          <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.dialogTitle}>New Chat</h3>
            <p style={styles.dialogSubtitle}>Enter a name for your chat</p>
            <input
              style={styles.dialogInput}
              type="text"
              placeholder="Chat name..."
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              onKeyDown={handleDialogKeyDown}
              autoFocus
            />
            <div style={styles.dialogActions}>
              <button
                style={styles.dialogCancelBtn}
                onClick={() => setShowNameDialog(false)}
              >
                Cancel
              </button>
              <button
                style={styles.dialogCreateBtn}
                onClick={handleCreateChat}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <aside style={{ ...styles.sidebar, ...(collapsed ? styles.sidebarCollapsed : {}) }}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>✨</div>
            <span style={styles.logoText}>Gemini Chat</span>
          </div>
        </div>

        <button
          style={{ ...styles.newChatBtn, opacity: creating ? 0.7 : 1 }}
          onClick={handleNewChatClick}
          disabled={creating}
        >
          <span>＋</span> {creating ? 'Creating...' : 'New Chat'}
        </button>

        <div style={styles.chatList}>
          {chats.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>💬</div>
              <p style={styles.emptyText}>No chats yet. Start a new conversation!</p>
            </div>
          ) : (
            chats.map((chat, i) => (
              <div
                key={chat._id || i}
                style={{
                  ...styles.chatItem,
                  ...(activeChat?._id === chat._id || activeChat === chat._id ? styles.chatItemActive : {}),
                }}
                onClick={() => onSelectChat(chat)}
                className="animate-fade-in"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={(e) => {
                  if (activeChat?._id !== chat._id && activeChat !== chat._id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={styles.chatItemIcon}>💬</span>
                <span style={styles.chatItemTitle}>{chat.title || 'New Chat'}</span>
              </div>
            ))
          )}
        </div>

        {user && (
          <div style={styles.footer}>
            <div style={styles.userInfo}>
              <div style={styles.avatar}>
                {(user.firstname || 'U')[0].toUpperCase()}
              </div>
              <span style={styles.userName}>{user.firstname} {user.secondname || ''}</span>
              <button
                style={styles.logoutBtn}
                onClick={onLogout}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--error)'; e.currentTarget.style.color = 'var(--error)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}