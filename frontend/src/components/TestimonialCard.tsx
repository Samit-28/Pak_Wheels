interface TestimonialCardProps {
  name: string;
  text: string;
  role?: string;
  avatarUrl?: string;
}

const TestimonialCard = ({ name, text, role, avatarUrl }: TestimonialCardProps) => {
  return (
    <div className="relative bg-gradient-to-br from-[#1a1443] via-[#2d1e5f] to-[#3a256b] p-8 rounded-3xl shadow-lg transition-transform duration-300 transform hover:-translate-y-2 hover:scale-105 hover:shadow-2xl max-w-sm mx-auto">
      
      {/* Optional Avatar */}
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={name}
          className="w-16 h-16 rounded-full mx-auto -mt-12 border-2 border-white shadow-sm object-cover"
        />
      )}

      {/* Quote Icon */}
      <svg
        className="w-8 h-8 mx-auto mb-4 text-violet-400 opacity-60"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M7.17 6A5 5 0 002 11v7h5v-7a2 2 0 012-2h1V6H7.17zm10 0A5 5 0 0012 11v7h5v-7a2 2 0 012-2h1V6h-5.83z"/>
      </svg>

      {/* Testimonial Text */}
      <p className="text-white text-base md:text-lg leading-relaxed mb-6 text-center">
        "{text}"
      </p>

      {/* Name & Role */}
      <h4 className="text-white font-semibold text-lg text-center">{name}</h4>
      {role && <p className="text-violet-300 text-sm text-center mt-1">{role}</p>}

      {/* Decorative Divider */}
      <div className="w-16 h-1 bg-violet-500 rounded-full mt-4 mx-auto"></div>
    </div>
  );
};

export default TestimonialCard;
