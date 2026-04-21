import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CarCardProps {
  car: {
    id: number;
    name: string;
    model: string;
    year: number;
    currentPrice: number;
    status: string;
  };
}

const CAR_EMOJIS: Record<string, string> = {
  toyota: '🚗', bmw: '🏎️', honda: '🚙', ford: '🛻',
  tesla: '⚡', mercedes: '💎', audi: '🔵', default: '🚗',
};

const getEmoji = (name: string) => {
  const key = name.toLowerCase().split(' ')[0];
  return CAR_EMOJIS[key] ?? CAR_EMOJIS.default;
};

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const isActive = car.status === 'ACTIVE';

  return (
    <div className="car-card">
      <div className="car-card-image">
        <span>{getEmoji(car.name)}</span>
        <div className="car-card-badge">
          <span className={`badge ${isActive ? 'badge-active' : 'badge-closed'}`}>
            {isActive ? '● Live' : '✕ Closed'}
          </span>
        </div>
      </div>

      <div className="car-card-body">
        <div className="car-card-title">{car.year} {car.name}</div>
        <div className="car-card-subtitle">{car.model}</div>

        <div className="car-card-price-row">
          <div>
            <div className="car-card-price-label">Current Bid</div>
            <div className="car-card-price">${car.currentPrice.toLocaleString()}</div>
          </div>
          <Link
            to={`/cars/${car.id}`}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Bid <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
