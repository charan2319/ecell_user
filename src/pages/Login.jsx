import { API_BASE } from '../config';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email.includes('@alliance.edu.in')) {
      alert("Please use your @alliance.edu.in email.");
      return;
    }
    
    try {
      const endpoint = isRegister ? 'register' : 'login';
      const res = await axios.post(`${API_BASE}/auth/${endpoint}`, {
        email, password, name
      });
      
      if (res.data.user || res.data.token) {
        login(res.data.user);
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ background: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderRadius: 24, padding: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{isRegister ? 'Join the Mart' : 'Student Login'}</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>{isRegister ? 'Create your profile to start earning Vc\'s' : 'Log in with your college credentials'}</p>
        
        <form onSubmit={handleAuth}>
          {isRegister && (
            <input
              type="text"
              placeholder="Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: 12, border: '1px solid #eee' }}
            />
          )}
          <input
            type="email"
            placeholder="Email (@alliance.edu.in)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: 12, border: '1px solid #eee' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: 12, border: '1px solid #eee' }}
          />
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', background: '#000', color: '#FFC700', borderRadius: 12, fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer' }}>
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '1rem' }}>
            {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
