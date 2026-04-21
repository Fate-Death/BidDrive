import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, ExternalLink, Car } from 'lucide-react';

const MyListings: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [closingId, setClosingId] = useState<number | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchMyCars = async () => {
      try {
        const res = await api.get('/cars/my-listings');
        setCars(res.data);
      } catch (err) {
        console.error('Failed to load listings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCars();
  }, [isAuthenticated, navigate]);

  const handleClose = async (carId: number) => {
    if (!window.confirm('Close this auction? Bidding will stop.')) return;
    setClosingId(carId);
    try {
      await api.patch(`/cars/${carId}/close`);
      setCars((prev) => prev.map((c) => c.id === carId ? { ...c, status: 'CLOSED' } : c));
      setMessage({ type: 'success', text: 'Auction closed successfully.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to close auction.' });
    } finally {
      setClosingId(null);
    }
  };

  const active = cars.filter((c) => c.status === 'ACTIVE').length;
  const closed = cars.filter((c) => c.status === 'CLOSED').length;

  return (
    <main className="page-wrapper">
      <div className="section-header">
        <div>
          <h1 className="section-title">My Listings</h1>
          <p className="section-subtitle">Cars you've listed for auction</p>
        </div>
        <Link to="/add-car" className="btn btn-primary">
          <PlusCircle size={16} /> List a New Car
        </Link>
      </div>

      {/* Mini stats */}
      {!loading && cars.length > 0 && (
        <div className="stats-strip" style={{ maxWidth: '500px', marginBottom: '1.5rem' }}>
          <div className="stat-box">
            <div className="stat-label">Total</div>
            <div className="stat-value">{cars.length}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">🟢 Active</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{active}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">✕ Closed</div>
            <div className="stat-value" style={{ color: 'var(--text-muted)' }}>{closed}</div>
          </div>
        </div>
      )}

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '1.5rem' }}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="spinner" />
      ) : cars.length === 0 ? (
        <div className="empty-state">
          <Car size={56} />
          <h3>No listings yet</h3>
          <p style={{ marginBottom: '1.5rem' }}>You haven't listed any cars for auction.</p>
          <Link to="/add-car" className="btn btn-primary">
            <PlusCircle size={16} /> List Your First Car
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Car</th>
                <th>Starting Price</th>
                <th>Current Bid</th>
                <th>Status</th>
                <th>Listed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => {
                const isActive = car.status === 'ACTIVE';
                return (
                  <tr key={car.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{car.year} {car.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{car.model}</div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      ${car.startingPrice?.toLocaleString() ?? '—'}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                      ${car.currentPrice?.toLocaleString() ?? '—'}
                    </td>
                    <td>
                      <span className={`badge ${isActive ? 'badge-active' : 'badge-closed'}`}>
                        {isActive ? '● Live' : '✕ Closed'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {car.createdAt ? new Date(car.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div className="listing-row-actions">
                        <Link to={`/cars/${car.id}`} className="btn btn-outline" style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}>
                          <ExternalLink size={13} /> View
                        </Link>
                        {isActive && (
                          <button
                            onClick={() => handleClose(car.id)}
                            className="btn btn-danger"
                            style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
                            disabled={closingId === car.id}
                          >
                            {closingId === car.id ? '…' : 'Close'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default MyListings;
