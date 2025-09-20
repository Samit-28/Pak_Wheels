import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-4 gap-8 px-6 max-w-6xl mx-auto">
            <FeatureCard title="Easy Search" description="Find cars fast and easily" />
            <FeatureCard title="Verified Cars" description="Trusted sellers only" />
            <FeatureCard title="Wishlist" description="Save your favorites" />
            <FeatureCard title="Fast Posting" description="Add your car in minutes" />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-10 px-6 max-w-6xl mx-auto">
            <TestimonialCard
              name="Ali"
              text="Found my dream car easily!"
              role="Car Enthusiast"
            />
            <TestimonialCard
              name="Sara"
              text="Smooth and reliable service."
              role="Verified Buyer"
            />
            <TestimonialCard
              name="Ahmed"
              text="Highly recommend this platform."
              role="Happy Seller"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
