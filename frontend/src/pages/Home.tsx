import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CarCard from '../components/CarCard';
import { Search, TrendingUp, Car } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const Home: React.FC = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/cars/public/all');
        setCars(response.data);
      } catch (err) {
        console.error('Failed to fetch cars', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const filtered = cars.filter((car) => {
    const q = search.toLowerCase();
    return (
      !q ||
      car.name?.toLowerCase().includes(q) ||
      car.model?.toLowerCase().includes(q) ||
      String(car.year).includes(q)
    );
  });

  const activeCars = cars.filter((c) => c.status === 'ACTIVE');
  const closedCars = cars.filter((c) => c.status === 'CLOSED');

  const chartData = [...cars]
    .sort((a, b) => b.currentPrice - a.currentPrice)
    .slice(0, 6)
    .map((car) => ({ name: `${car.year} ${car.name}`, price: car.currentPrice }));

  return (
    <main className="page-wrapper">
      {/* Stats strip */}
      {!loading && cars.length > 0 && (
        <div className="stats-strip">
          <div className="stat-box">
            <div className="stat-label"><Car size={13} /> Total Listings</div>
            <div className="stat-value">{cars.length}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">🟢 Live Auctions</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{activeCars.length}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">✕ Closed</div>
            <div className="stat-value" style={{ color: 'var(--text-muted)' }}>{closedCars.length}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">💰 Highest Bid</div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>
              ${Math.max(...cars.map((c) => c.currentPrice)).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {!loading && cars.length >= 2 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--primary)" />
            Top Bids — Price Overview
          </h2>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip
                  formatter={(v: number) => [`$${v.toLocaleString()}`, 'Current Bid']}
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="price" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Listings header + search */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Active Auctions</h1>
          <p className="section-subtitle">Find and bid on your next vehicle</p>
        </div>
        <div className="search-bar">
          <Search size={18} className="search-bar-icon" />
          <input
            type="text"
            placeholder="Search by make, model or year…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Car grid */}
      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Car size={52} />
          <h3>{search ? 'No cars match your search' : 'No cars listed yet'}</h3>
          <p>{search ? 'Try a different keyword.' : 'Be the first to list a car for auction!'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Home;
