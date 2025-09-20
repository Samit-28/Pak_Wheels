interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard = ({ title, description }: FeatureCardProps) => {
  return (
    <div
      className="relative 
                 bg-white/80 backdrop-blur-sm 
                 p-6 rounded-xl 
                 border border-gray-200 
                 shadow-md text-center 
                 transition-all duration-300 ease-out 
                 hover:scale-105 hover:shadow-2xl hover:border-gray-400"
    >
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
