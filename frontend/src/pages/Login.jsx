import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--gradient-bg)',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
  },
  bgOrb1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(108,92,231,0.15) 0%, transparent 70%)',
    top: '-200px',
    right: '-100px',
    pointerEvents: 'none',
  },
  bgOrb2: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(160,155,254,0.1) 0%, transparent 70%)',
    bottom: '-150px',
    left: '-100px',
    pointerEvents: 'none',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
    zIndex: 1,
    boxShadow: 'var(--shadow-lg)',
    animation: 'scaleIn 0.5s ease forwards',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  logoIcon: {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--gradient-2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    boxShadow: 'var(--shadow-glow)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 800,
    background: 'var(--gradient-1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 4s ease infinite',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    marginBottom: '36px',
    marginTop: '4px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '8px',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 44px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'var(--transition)',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '18px',
    opacity: 0.5,
    pointerEvents: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'var(--gradient-1)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'var(--transition)',
    fontFamily: 'inherit',
    marginTop: '8px',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 6s ease infinite',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  error: {
    background: 'rgba(255,107,107,0.1)',
    border: '1px solid rgba(255,107,107,0.3)',
    color: 'var(--error)',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 16px',
    fontSize: '13px',
    marginBottom: '20px',
    textAlign: 'center',
    animation: 'fadeIn 0.3s ease forwards',
  },
  footer: {
    textAlign: 'center',
    marginTop: '28px',
    color: 'var(--text-muted)',
    fontSize: '14px',
  },
  link: {
    color: 'var(--accent-light)',
    textDecoration: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/chat');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (isFocused) => ({
    ...styles.input,
    borderColor: isFocused ? 'var(--accent)' : 'var(--border)',
    boxShadow: isFocused ? '0 0 0 3px var(--accent-glow)' : 'none',
  });

  return (
    <div style={styles.container}>
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      <div style={styles.card} className="animate-scale-in login-card-mobile">
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>🤖</div>
          <h1 style={styles.title} className="login-title-mobile">ChatGPT Clone</h1>
        </div>
        <p style={styles.subtitle}>Sign in to continue</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>📧</span>
              <input
                style={inputStyle(false)}
                className="login-input-mobile"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                autoComplete="email"
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                style={inputStyle(false)}
                className="login-input-mobile"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                autoComplete="current-password"
              />
            </div>
          </div>
          <button
            style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one</Link>
        </div>
      </div>
    </div>
  );
}