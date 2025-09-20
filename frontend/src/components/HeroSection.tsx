import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#1a1443] via-[#2d1e5f] to-[#3a256b] text-white text-center py-40 px-6 overflow-hidden">
      {/* Background overlay (for subtle texture/glow) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-10"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Find Your <span className="text-violet-400">Dream Car</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-10">
          Search, Compare, and Buy Cars Easily in Pakistan
        </p>
        <Link
          to="/cars"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:from-violet-600 hover:to-indigo-600 transition-all duration-200 border border-violet-600"
        >
          Get Started
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Decorative glow at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-violet-500/30 blur-3xl rounded-full"></div>
    </section>
  );
};

export default HeroSection;