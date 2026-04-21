import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Car, User, Mail, Lock } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/signup', formData);
      navigate('/login', { state: { registered: true } });
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData({ ...formData, [field]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Car size={28} color="var(--primary)" />
          AuctionCar
        </div>

        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Join to start bidding and listing cars</p>

        {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-username">
              <User size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
              Username
            </label>
            <input
              id="reg-username"
              type="text"
              className="form-input"
              value={formData.username}
              onChange={set('username')}
              placeholder="Choose a username"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              <Mail size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              value={formData.email}
              onChange={set('email')}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              <Lock size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              value={formData.password}
              onChange={set('password')}
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: '600' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
