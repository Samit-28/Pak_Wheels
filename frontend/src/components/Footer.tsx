import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-gradient-to-br from-[#1a1443] via-[#2d1e5f] to-[#3a256b] border-t border-[#2d1e5f] p-4 flex justify-between items-center">
      {/* Left: Logo */}
      <Link to="/" className="flex items-center space-x-2" onClick={e => { e.preventDefault(); scrollToTop(); }}>
        <svg width="36" height="36" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="19" cy="19" r="19" fill="#8b5cf6" />
          <path d="M10 24C12 18 26 18 28 24" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <rect x="13" y="13" width="12" height="7" rx="3.5" fill="white" />
        </svg>
        <span className="text-white font-bold text-lg drop-shadow-lg">PakWheels</span>
      </Link>

      {/* Center: Copyright */}
      <p className="text-white/70 text-sm">&copy; 2025 PakWheels. All rights reserved.</p>

      {/* Right: Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition focus:ring-2 focus:ring-violet-400 focus:outline-none"
        aria-label="Scroll to top"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M5 15l7-7 7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
