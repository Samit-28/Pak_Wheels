import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

interface CarCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  location: string;
  condition: string;
}

const CarCard = ({ id, make, model, year, price, imageUrl, location, condition }: CarCardProps) => {
  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <Link to={`/cars/${id}`}>
        <img
          src={imageUrl}
          alt={`${make} ${model}`}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-4 flex flex-col gap-2">
        {/* Split Make and Model */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-700 font-semibold text-lg">{make}</h3>
            <h4 className="text-gray-500 text-sm">{model}</h4>
          </div>
          <span className="text-gray-400 text-sm">{year}</span>
        </div>

        {/* Location & Condition */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-gray-500 text-xs">{location}</span>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${condition === 'New' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{condition}</span>
        </div>

        {/* Price */}
        <p className="text-indigo-600 font-bold text-lg mt-2">PKR {price.toLocaleString()}</p>

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
            <Heart className="w-4 h-4" />
            Wishlist
          </button>
          <Link
            to={`/cars/${id}`}
            className="px-3 py-1 border border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-50 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
