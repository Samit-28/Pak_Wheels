import Header from '../components/Header';
import Footer from '../components/Footer';
import CarCard from '../components/CarCard';
import { useState, useMemo, useEffect } from 'react';
import { getCars } from '../services/api';
import type { Car } from '../types/Car';

const CarListingPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  // Dynamically set price range based on car prices
  const minCarPrice = useMemo(() => cars.length ? Math.min(...cars.map(car => car.price)) : 0, [cars]);
  const maxCarPrice = useMemo(() => cars.length ? Math.max(...cars.map(car => car.price)) : 0, [cars]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

  // Update price range when cars are loaded
  useEffect(() => {
    if (cars.length) {
      setPriceRange([minCarPrice, maxCarPrice]);
    }
  }, [minCarPrice, maxCarPrice, cars.length]);

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getCars();
        setCars(data);
      } catch {
        setError('Failed to load cars.');
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = search
        ? car.model.toLowerCase().startsWith(search.toLowerCase())
        : true;
      const matchesBrand = selectedBrand ? car.make.toLowerCase().includes(selectedBrand.toLowerCase()) : true;
      const matchesYear = selectedYear ? car.year.toString() === selectedYear : true;
      const matchesLocation = selectedLocation ? car.location === selectedLocation : true;
      const matchesCondition = selectedCondition ? car.condition === selectedCondition : true;
      const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
      return matchesSearch && matchesBrand && matchesYear && matchesLocation && matchesCondition && matchesPrice;
    });
  }, [cars, search, selectedBrand, selectedYear, selectedLocation, selectedCondition, priceRange]);

  const resetFilters = () => {
    setSearch('');
    setSelectedBrand('');
    setSelectedYear('');
    setSelectedLocation('');
    setSelectedCondition('');
    setPriceRange([minCarPrice, maxCarPrice]);
  };

  // 👇 Moved your filters into a reusable block
  const FilterForm = (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by car model..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full md:w-auto flex-1 border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      {/* Brand Dropdown */}
      <select
        value={selectedBrand}
        onChange={e => setSelectedBrand(e.target.value)}
        className="w-full md:w-auto border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Brands</option>
        {[...new Set(cars.map(car => car.make))].map(brand => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
      </select>

      {/* Year Dropdown */}
      <select
        value={selectedYear}
        onChange={e => setSelectedYear(e.target.value)}
        className="w-full md:w-auto border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Years</option>
        {[...new Set(cars.map(car => car.year))]
          .sort((a, b) => b - a)
          .map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
      </select>

      {/* Location Dropdown */}
      <select
        value={selectedLocation}
        onChange={e => setSelectedLocation(e.target.value)}
        className="w-full md:w-auto border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Locations</option>
        {[...new Set(cars.map(car => car.location))].map(location => (
          <option key={location} value={location}>{location}</option>
        ))}
      </select>

      {/* Condition Dropdown */}
      <select
        value={selectedCondition}
        onChange={e => setSelectedCondition(e.target.value)}
        className="w-full md:w-auto border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Conditions</option>
        {[...new Set(cars.map(car => car.condition))].map(condition => (
          <option key={condition} value={condition}>{condition}</option>
        ))}
      </select>

      {/* Price Range - Text Inputs */}
      <div className="w-full md:w-auto flex flex-col items-start md:items-center">
        <label className="text-xs text-gray-500 mb-1 font-semibold">Price Range (PKR)</label>
        <div className="flex flex-row items-center gap-2 bg-gray-100 rounded-xl px-4 py-3 shadow-inner">
          <input
            type="number"
            min={minCarPrice}
            max={maxCarPrice}
            value={priceRange[0]}
            onChange={e => {
              const newMin = Math.max(minCarPrice, Math.min(Number(e.target.value), priceRange[1]));
              setPriceRange([newMin, priceRange[1]]);
            }}
            className="w-24 md:w-32 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={`Min (${minCarPrice})`}
          />
          <span className="mx-2 text-xs text-gray-400">to</span>
          <input
            type="number"
            min={minCarPrice}
            max={maxCarPrice}
            value={priceRange[1]}
            onChange={e => {
              const newMax = Math.min(maxCarPrice, Math.max(Number(e.target.value), priceRange[0]));
              setPriceRange([priceRange[0], newMax]);
            }}
            className="w-24 md:w-32 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={`Max (${maxCarPrice})`}
          />
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Selected: PKR {priceRange[0].toLocaleString()} - PKR {priceRange[1].toLocaleString()}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
      >
        Reset
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Page Title */}
      <section className="relative bg-gradient-to-br from-[#1a1443] via-[#2d1e5f] to-[#3a256b] text-white py-20 shadow-md mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Browse <span className="text-violet-400">Available Cars</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80">
            Find your ideal car quickly and securely
          </p>
        </div>

        {/* Decorative glow at bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-violet-500/20 blur-3xl rounded-full"></div>
      </section>

      {/* Filters / Search */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          {/* Mobile: Filter Button */}
          <div className="flex justify-between items-center md:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Mobile: Collapsible Filters */}
          {showFilters && (
            <div className="mt-4 md:hidden">{FilterForm}</div>
          )}

          {/* Desktop: Always show Filters */}
          <div className="hidden md:block">{FilterForm}</div>
        </div>
      </section>

      {/* Car Cards Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-4 pb-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading ? (
            <p className="text-gray-500 col-span-full text-center py-10">Loading cars...</p>
          ) : error ? (
            <p className="text-red-500 col-span-full text-center py-10">{error}</p>
          ) : filteredCars.length ? (
            filteredCars.map(car => (
              <CarCard
                key={car.id}
                id={car.id.toString()}
                make={car.make}
                model={car.model}
                year={car.year}
                price={car.price}
                imageUrl={car.imageUrl}
                location={car.location}
                condition={car.condition}
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-10">
              No cars found matching your criteria.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarListingPage;