const API_BASE = '/api';

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    throw new Error('Server returned an empty or invalid response. Is the backend running?');
  }
}

const api = {
  async register(fullname, email, password) {
    const [firstname, ...rest] = fullname.trim().split(' ');
    const secondname = rest.join(' ') || '';
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ fullname: { firstname, secondname }, email, password }),
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async createChat(title) {
    const res = await fetch(`${API_BASE}/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title }),
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || 'Failed to create chat');
    return data;
  },

  async getChats() {
    const res = await fetch(`${API_BASE}/chat/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || 'Failed to fetch chats');
    return data;
  },

  async getMessages(chatId) {
    const res = await fetch(`${API_BASE}/chat/${chatId}/messages`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || 'Failed to fetch messages');
    return data;
  },
};

export default api;