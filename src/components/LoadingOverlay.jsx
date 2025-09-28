import ClipLoader from 'react-spinners/ClipLoader';
import { useLoading } from '../context/LoadingContext';

const LoadingOverlay = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null; // don’t render if not loading

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-green-900">
      <p className="text-white">Loading Data... </p>
      <ClipLoader
        size={70}
        color="#22c55e" // Tailwind's green-500
        // speedMultiplier={1} // optional: make it spin faster
        cssOverride={{
          borderWidth: '6px', // thicker line
        }}
      />
    </div>
  );
};

export default LoadingOverlay;
