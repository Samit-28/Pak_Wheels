import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CarListingPage from './pages/CarListingPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cars" element={<CarListingPage />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
