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
};

export default function ChatPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div style={styles.container}>
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        user={user}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
      />
      <ChatArea
        chat={activeChat}
        user={user}
        onToggleSidebar={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />
    </div>
  );
}