import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://vine-social-tokyo.onrender.com';
const API = `${BACKEND_URL}/api`;

const CATEGORIES = ['Small Plates', 'Tandoor', 'Mains', 'Drinks', 'Lunch Sets', 'Party Courses'];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('Small Plates');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems(selectedCategory);
  }, [selectedCategory]);

  const fetchMenuItems = async (category) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/menu?category=${encodeURIComponent(category)}`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24" data-testid="menu-page">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[#CBA052] mb-4 font-semibold">DISCOVER</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-light tracking-tighter text-[#F5F2E9] mb-6" data-testid="menu-title">
            Our Menu
          </h1>
          <p className="text-base font-light leading-relaxed text-[#A3A199] max-w-2xl mx-auto">
            Explore our selection of modern Indian tapas, crafted to share and savor.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16" data-testid="menu-categories">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              data-testid={`menu-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-6 py-3 rounded-sm text-sm tracking-[0.2em] font-light transition-colors ${
                selectedCategory === category
                  ? 'bg-[#CBA052] text-[#0F0F0F]'
                  : 'border border-white/10 text-[#F5F2E9] hover:border-[#CBA052]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-[#A3A199] font-light">Loading menu...</p>
          </div>
        ) : menuItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {menuItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="menu-card"
                data-testid={`menu-item-${idx}`}
              >
                {item.image_url && (
                  <div className="image-hover-zoom rounded-sm overflow-hidden mb-4">
                    <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover" />
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-heading font-light text-[#F5F2E9]">{item.name}</h3>
                  <span className="text-[#CBA052] font-light ml-4">{item.price}</span>
                </div>
                <p className="text-base font-light leading-relaxed text-[#A3A199]">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 border border-white/10 rounded-sm">
            <p className="text-[#A3A199] font-light mb-4">No items available in this category yet.</p>
            <p className="text-sm text-[#A3A199] font-light">Check back soon for updates!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;