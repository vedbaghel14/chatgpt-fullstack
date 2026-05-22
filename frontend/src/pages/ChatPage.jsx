import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.55)',
    zIndex: 99,
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease',
    WebkitTapHighlightColor: 'transparent',
  },
  backdropVisible: {
    opacity: 1,
    pointerEvents: 'auto',
  },
};

export default function ChatPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await api.getChats();
        setChats(data.chats);
      } catch {
        // silently fail — chats will just be empty
      }
    };
    fetchChats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNewChat = (chat) => {
    setChats((prev) => [chat, ...prev]);
    setActiveChat(chat);
    if (isMobile) setSidebarOpen(false);
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    if (isMobile) setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div style={styles.container} className="chat-container">
      {/* Mobile backdrop */}
      {isMobile && (
        <div
          style={{ ...styles.backdrop, ...(sidebarOpen ? styles.backdropVisible : {}) }}
          className={sidebarOpen ? 'sidebar-backdrop visible' : 'sidebar-backdrop'}
          onClick={closeSidebar}
        />
      )}

      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        user={user}
        onLogout={handleLogout}
        collapsed={isMobile ? !sidebarOpen : !sidebarOpen}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
      />
      <ChatArea
        chat={activeChat}
        user={user}
        onToggleSidebar={toggleSidebar}
        sidebarCollapsed={isMobile ? !sidebarOpen : !sidebarOpen}
        isMobile={isMobile}
      />
    </div>
  );
}