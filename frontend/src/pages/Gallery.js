import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://vine-social-tokyo.onrender.com';
const API = `${BACKEND_URL}/api`;

// Default images from design guidelines
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1645914589022-3917b99b9a69?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwyfHxnb3VybWV0JTIwc21hbGwlMjBwbGF0ZXMlMjB0YXBhcyUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc4MDYwMjc5N3ww&ixlib=rb-4.1.0&q=85',
  'https://images.pexels.com/photos/14009280/pexels-photo-14009280.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.pexels.com/photos/8775401/pexels-photo-8775401.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.pexels.com/photos/3937670/pexels-photo-3937670.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.unsplash.com/photo-1689672235271-727de51355e6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBmb29kJTIwZmluZSUyMGRpbmluZ3xlbnwwfHx8fDE3ODA2MDI3OTd8MA&ixlib=rb-4.1.0&q=85',
  'https://images.pexels.com/photos/14009279/pexels-photo-14009279.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await axios.get(`${API}/gallery`);
      if (response.data.length > 0) {
        setImages(response.data);
      } else {
        // Use default images if no gallery images exist
        setImages(DEFAULT_IMAGES.map((url, idx) => ({ id: `default-${idx}`, url, caption: '' })));
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setImages(DEFAULT_IMAGES.map((url, idx) => ({ id: `default-${idx}`, url, caption: '' })));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24" data-testid="gallery-page">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[#CBA052] mb-4 font-semibold">VISUAL JOURNEY</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-light tracking-tighter text-[#F5F2E9] mb-6" data-testid="gallery-title">
            Gallery
          </h1>
          <p className="text-base font-light leading-relaxed text-[#A3A199] max-w-2xl mx-auto">
            Experience the ambiance, flavors, and moments that define Vine Social Tokyo.
          </p>
        </motion.div>

        {/* Gallery Grid (Bento Style) */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-[#A3A199] font-light">Loading gallery...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, idx) => {
              // Create bento-style layout with varying sizes
              const isTall = idx % 5 === 0;
              const isWide = idx % 7 === 0 && idx !== 0;

              return (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className={`image-hover-zoom rounded-sm overflow-hidden ${
                    isTall ? 'sm:row-span-2' : ''
                  } ${isWide ? 'sm:col-span-2' : ''}`}
                  data-testid={`gallery-item-${idx}`}
                >
                  <img
                    src={image.url}
                    alt={image.caption || `Gallery image ${idx + 1}`}
                    className={`w-full object-cover ${
                      isTall ? 'h-[600px]' : isWide ? 'h-[400px]' : 'h-[300px]'
                    }`}
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-sm font-light text-[#F5F2E9]">{image.caption}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;