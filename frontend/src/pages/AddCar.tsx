import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Car, FileText, DollarSign } from 'lucide-react';

const AddCar: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    year: new Date().getFullYear(),
    startingPrice: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/cars', {
        ...formData,
        startingPrice: Number(formData.startingPrice),
        year: Number(formData.year),
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to list car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-wrapper">
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="section-title">List a Car for Auction</h1>
          <p className="section-subtitle">Fill in the details and set a starting bid to begin your auction</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="car-name">
                  <Car size={13} style={{ display: 'inline', marginRight: '0.3rem' }} />
                  Make (e.g. Toyota)
                </label>
                <input
                  id="car-name"
                  type="text"
                  className="form-input"
                  placeholder="Toyota, BMW, Honda…"
                  value={formData.name}
                  onChange={set('name')}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="car-model">Model</label>
                <input
                  id="car-model"
                  type="text"
                  className="form-input"
                  placeholder="Camry, X5, Civic…"
                  value={formData.model}
                  onChange={set('model')}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="car-year">Year</label>
                <input
                  id="car-year"
                  type="number"
                  className="form-input"
                  value={formData.year}
                  onChange={set('year')}
                  min={1980}
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="car-price">
                  <DollarSign size={13} style={{ display: 'inline', marginRight: '0.3rem' }} />
                  Starting Price (USD)
                </label>
                <input
                  id="car-price"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 5000"
                  value={formData.startingPrice}
                  onChange={set('startingPrice')}
                  min={1}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="car-desc">
                <FileText size={13} style={{ display: 'inline', marginRight: '0.3rem' }} />
                Description
              </label>
              <textarea
                id="car-desc"
                className="form-input"
                rows={4}
                placeholder="Condition, mileage, features, reason for selling…"
                value={formData.description}
                onChange={set('description')}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Submitting…' : '🚗 Submit Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddCar;
