import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useMemo } from 'react';
import { Heart } from 'lucide-react';

const mockCars = [
  { id: '1', name: 'Honda Civic', year: 2022, price: 5500000, imageUrl: '/cars/civic.jpg', description: 'Sleek sedan with great fuel efficiency and modern features.' },
  { id: '2', name: 'Toyota Corolla', year: 2021, price: 4500000, imageUrl: '/cars/corolla.jpg', description: 'Reliable car with smooth handling and comfort.' },
  { id: '3', name: 'Suzuki Swift', year: 2020, price: 3200000, imageUrl: '/cars/swift.jpg', description: 'Compact hatchback perfect for city driving.' },
  { id: '4', name: 'Kia Sportage', year: 2023, price: 9000000, imageUrl: '/cars/sportage.jpg', description: 'Stylish SUV with spacious interior and advanced safety.' },
];

const CarDetailPage = () => {
  const { id } = useParams();

  // Find car by id
  const car = useMemo(() => mockCars.find(c => c.id === id), [id]);

  if (!car) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-xl">Car not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Car Detail Section */}
      <main className="flex-grow max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Car Image */}
          <div className="md:w-1/2 h-80 md:h-auto">
            <img
              src={car.imageUrl}
              alt={car.name}
              className="w-full h-full object-cover rounded-l-2xl md:rounded-l-none md:rounded-t-2xl"
            />
          </div>

          {/* Car Info */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{car.name}</h1>
              <p className="text-gray-500 text-lg">{car.year}</p>
              <p className="text-indigo-600 font-bold text-2xl mt-2">PKR {car.price.toLocaleString()}</p>
              <p className="text-gray-700 mt-4">{car.description}</p>

              {/* Example specs (can expand later) */}
              <div className="mt-6 grid grid-cols-2 gap-4 text-gray-600 text-sm">
                <div><span className="font-semibold">Fuel:</span> Petrol</div>
                <div><span className="font-semibold">Transmission:</span> Automatic</div>
                <div><span className="font-semibold">Seats:</span> 5</div>
                <div><span className="font-semibold">Mileage:</span> 15 km/l</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition">
                <Heart className="w-5 h-5" />
                Add to Wishlist
              </button>
              <button className="px-6 py-3 border border-indigo-500 text-indigo-500 rounded-xl hover:bg-indigo-50 transition">
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarDetailPage;
