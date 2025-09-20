import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { Transition } from '@headlessui/react';
import { AuthContext } from '../context/AuthContextValue';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const isLoggedIn = !!user;

  return (
    <header className="w-full sticky top-0 z-50 bg-gradient-to-br from-[#1a1443] via-[#2d1e5f] to-[#3a256b] border-b border-[#2d1e5f] backdrop-blur-md shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        {/* Left: Logo/Home */}
        <Link to="/" className="flex items-center space-x-3 group" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <svg width="44" height="44" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-200 group-hover:scale-105">
            <circle cx="19" cy="19" r="19" fill="#8b5cf6" />
            <path d="M10 24C12 18 26 18 28 24" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <rect x="13" y="13" width="12" height="7" rx="3.5" fill="white" />
          </svg>
          <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white group-hover:text-violet-300 transition-colors duration-200 drop-shadow-lg">
            Pakwheels
          </span>
        </Link>
        {/* Center: Main Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/cars" className="text-white/90 font-medium hover:text-violet-300 transition-colors duration-200">Browse Cars</Link>
          {isLoggedIn && (
            <Link to="/sell" className="text-white/90 font-medium hover:text-violet-300 transition-colors duration-200">Sell Car</Link>
          )}
          {isLoggedIn && (
            <Link to="/wishlist" className="text-white/90 font-medium hover:text-violet-300 transition-colors duration-200">Wishlist</Link>
          )}
        </div>
        {/* Right: Search, User Menu, Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search Icon */}
          <button className="p-2 rounded-full hover:bg-white/10 transition focus:ring-2 focus:ring-violet-400 focus:outline-none">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-violet-300">
              <circle cx="11" cy="11" r="7" strokeWidth="2" stroke="currentColor" fill="none" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="2" stroke="currentColor" />
            </svg>
          </button>
          {isLoggedIn ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition focus:ring-2 focus:ring-violet-400 focus:outline-none">
                <span>{user?.name || 'User'}</span>
                <svg width="18" height="18" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                  <path d="M6 8l4 4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-40 bg-gradient-to-br from-[#1a1443] via-[#2d1e5f] to-[#3a256b] shadow-xl rounded-xl py-2 z-50 hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 text-white/90 hover:bg-white/10 transition">Profile</Link>
                <Link to="/dashboard" className="block px-4 py-2 text-white/90 hover:bg-white/10 transition">Dashboard</Link>
                <button onClick={auth?.logout} className="block w-full text-left px-4 py-2 text-white/90 hover:bg-white/10 transition">Logout</button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-white/80 font-medium px-4 py-2 rounded-xl hover:text-white hover:bg-white/10 transition-colors duration-200 focus:ring-2 focus:ring-violet-400 focus:outline-none">Log in</Link>
              <Link to="/login?mode=signup" className="relative flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:from-violet-600 hover:to-indigo-600 transition-all duration-200 border border-violet-600 focus:ring-2 focus:ring-violet-400 focus:outline-none">Sign up <span className="ml-1"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10h6m0 0l-3-3m3 3l-3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></Link>
            </>
          )}
        </div>
        {/* Hamburger for mobile */}
        <div className="md:hidden flex items-center">
          <button
            aria-label="Toggle menu"
            className="focus:outline-none relative z-50"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <div className="w-7 h-7 flex flex-col justify-between items-center">
              <span className={`block h-0.5 w-7 bg-violet-400 rounded transform transition duration-300 ease-in-out ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-7 bg-violet-400 rounded transition-all duration-300 ease-in-out ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block h-0.5 w-7 bg-violet-400 rounded transform transition duration-300 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
          <Transition
            show={menuOpen}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div className="absolute top-20 right-4 bg-gradient-to-br from-[#1a1443] via-[#2d1e5f] to-[#3a256b] shadow-xl rounded-xl flex flex-col py-6 px-8 space-y-4 w-52 border border-[#2d1e5f] backdrop-blur-md">
              <Link to="/cars" className="text-white/90 font-medium hover:text-violet-300 transition-colors duration-200">Browse Cars</Link>
              {isLoggedIn && <Link to="/sell" className="text-white/90 font-medium hover:text-violet-300 transition-colors duration-200">Sell Car</Link>}
              {isLoggedIn && <Link to="/wishlist" className="text-white/90 font-medium hover:text-violet-300 transition-colors duration-200">Wishlist</Link>}
              <button className="p-2 rounded-full hover:bg-white/10 transition focus:ring-2 focus:ring-violet-400 focus:outline-none flex items-center justify-start">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-violet-300">
                  <circle cx="11" cy="11" r="7" strokeWidth="2" stroke="currentColor" fill="none" />
                  <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="2" stroke="currentColor" />
                </svg>
                <span className="ml-2 text-white/80">Search</span>
              </button>
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="block px-4 py-2 text-white/90 hover:bg-white/10 transition">Profile</Link>
                  <Link to="/dashboard" className="block px-4 py-2 text-white/90 hover:bg-white/10 transition">Dashboard</Link>
                  <button onClick={auth?.logout} className="block w-full text-left px-4 py-2 text-white/90 hover:bg-white/10 transition">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white/80 font-medium px-4 py-2 rounded-xl hover:text-white hover:bg-white/10 transition-colors duration-200 focus:ring-2 focus:ring-violet-400 focus:outline-none">Log in</Link>
                  <Link to="/login?mode=signup" className="relative flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:from-violet-600 hover:to-indigo-600 transition-all duration-200 border border-violet-600 text-center focus:ring-2 focus:ring-violet-400 focus:outline-none">Sign up <span className="ml-1"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10h6m0 0l-3-3m3 3l-3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></Link>
                </>
              )}
            </div>
          </Transition>
        </div>
      </div>
    </header>
  );
};

export default Header;