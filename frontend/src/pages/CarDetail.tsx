import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Clock, DollarSign, Tag, Calendar, ArrowLeft, User, XCircle,
} from 'lucide-react';

const CarDetail: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [car, setCar] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [bidLoading, setBidLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [carRes, bidsRes] = await Promise.all([
        api.get(`/cars/public/${id}`),
        api.get(`/bids/car/${id}`),
      ]);
      setCar(carRes.data);
      setBids(bidsRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount || isNaN(Number(bidAmount))) return;
    setMessage({ type: '', text: '' });
    setBidLoading(true);
    try {
      await api.post(`/bids/${id}?amount=${bidAmount}`);
      setMessage({ type: 'success', text: '🎉 Bid placed successfully!' });
      setBidAmount('');
      fetchData();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to place bid. Amount must exceed current price.',
      });
    } finally {
      setBidLoading(false);
    }
  };

  const handleCloseAuction = async () => {
    if (!window.confirm('Are you sure you want to close this auction? This cannot be undone.')) return;
    setCloseLoading(true);
    try {
      await api.patch(`/cars/${id}/close`);
      setMessage({ type: 'success', text: 'Auction has been closed.' });
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to close auction.' });
    } finally {
      setCloseLoading(false);
    }
  };

  if (!car) {
    return (
      <main className="page-wrapper" style={{ textAlign: 'center' }}>
        <div className="spinner" />
      </main>
    );
  }

  const isActive = car.status === 'ACTIVE';
  const isSeller = isAuthenticated && car.seller?.username === user;
  const canBid = isAuthenticated && isActive && !isSeller;
  const minBid = car.currentPrice + 0.01;

  return (
    <main className="page-wrapper">
      {/* Back link */}
      <Link to="/" className="btn btn-ghost" style={{ marginBottom: '1.5rem', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}>
        <ArrowLeft size={16} /> Back to Auctions
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* LEFT — Car details */}
        <div>
          {/* Image */}
          <div style={{
            width: '100%', height: '280px', borderRadius: 'var(--radius)',
            background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '6rem', marginBottom: '1.5rem', position: 'relative',
            border: '1px solid var(--border)',
          }}>
            🚗
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <span className={`badge ${isActive ? 'badge-active' : 'badge-closed'}`}>
                {isActive ? '● Live' : '✕ Closed'}
              </span>
            </div>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.3rem' }}>
            {car.year} {car.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{car.model}</p>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div className="stat-box">
              <div className="stat-label"><Calendar size={12} /> Year</div>
              <div className="stat-value">{car.year}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label"><Tag size={12} /> Status</div>
              <div className="stat-value" style={{ color: isActive ? 'var(--success)' : 'var(--danger)', fontSize: '1rem' }}>
                {isActive ? 'Active' : 'Closed'}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label"><User size={12} /> Seller</div>
              <div className="stat-value" style={{ fontSize: '1rem' }}>
                {car.seller?.username ?? '—'}
                {isSeller && <span style={{ color: 'var(--primary)', fontSize: '0.75rem', marginLeft: '0.4rem' }}>(you)</span>}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label"><Clock size={12} /> Listed</div>
              <div className="stat-value" style={{ fontSize: '0.95rem' }}>
                {car.createdAt ? new Date(car.createdAt).toLocaleDateString() : '—'}
              </div>
            </div>
          </div>

          {/* Description */}
          {car.description && (
            <div className="card">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                Description
              </h3>
              <p style={{ lineHeight: '1.7', color: 'var(--text)', fontSize: '0.95rem' }}>{car.description}</p>
            </div>
          )}
        </div>

        {/* RIGHT — Bid panel */}
        <div>
          {/* Price card */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              Current Highest Bid
            </div>
            <div className="price-hero" style={{ marginBottom: '0.5rem' }}>
              ${car.currentPrice.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Starting price: ${car.startingPrice?.toLocaleString() ?? '—'} &nbsp;·&nbsp; {bids.length} bid{bids.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Feedback message */}
          {message.text && (
            <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '1.25rem' }}>
              {message.text}
            </div>
          )}

          {/* Bid form / seller controls */}
          {isSeller ? (
            <div className="card">
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>You are the seller of this car.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {isActive
                  ? 'You can close the auction at any time. The current highest bidder wins.'
                  : 'This auction has been closed.'}
              </p>
              {isActive && (
                <button
                  onClick={handleCloseAuction}
                  className="btn btn-danger btn-full"
                  disabled={closeLoading}
                >
                  <XCircle size={16} />
                  {closeLoading ? 'Closing…' : 'Close Auction'}
                </button>
              )}
            </div>
          ) : canBid ? (
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Place Your Bid</h3>
              <form onSubmit={handleBid}>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label" htmlFor="bid-amount">
                    <DollarSign size={13} style={{ display: 'inline' }} /> Your Bid (USD)
                  </label>
                  <input
                    id="bid-amount"
                    type="number"
                    className="form-input"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Min: $${minBid.toFixed(2)}`}
                    min={minBid}
                    step="0.01"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={bidLoading}>
                  {bidLoading ? 'Placing bid…' : '🏷️ Place Bid'}
                </button>
              </form>
            </div>
          ) : !isAuthenticated ? (
            <div className="alert alert-warning">
              <Link to="/login" style={{ fontWeight: 700 }}>Sign in</Link> to place a bid on this car.
            </div>
          ) : !isActive ? (
            <div className="alert alert-error">
              This auction is closed. No more bids can be placed.
            </div>
          ) : null}

          {/* Bid history */}
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>
              Bid History
              {bids.length > 0 && (
                <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                  ({bids.length} bid{bids.length !== 1 ? 's' : ''})
                </span>
              )}
            </h3>
            <div className="bid-list">
              {bids.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Bidder</th>
                      <th>Amount</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((bid, i) => (
                      <tr key={i}>
                        <td style={{ color: 'var(--text-muted)', fontWeight: i === 0 ? 700 : 400 }}>
                          {i === 0 ? '🥇' : `#${i + 1}`}
                        </td>
                        <td style={{ fontWeight: 500 }}>{bid.bidder.username}</td>
                        <td style={{ fontWeight: 700, color: i === 0 ? 'var(--success)' : 'var(--text)' }}>
                          ${bid.amount.toLocaleString()}
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {new Date(bid.bidTime).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <p>No bids yet — be the first!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          .car-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
};

export default CarDetail;
