import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1767277680127-dc94441d576c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwzfHx3aW5lJTIwZ2xhc3MlMjBkYXJrJTIwbHV4dXJ5JTIwcmVzdGF1cmFudHxlbnwwfHx8fDE3ODA2MDI3OTd8MA&ixlib=rb-4.1.0&q=85"
            alt="Vine Social Tokyo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-light tracking-tighter text-[#F5F2E9] mb-6" data-testid="hero-title">
            VINE SOCIAL TOKYO
          </h1>
          <p className="text-lg sm:text-xl text-[#CBA052] tracking-[0.3em] font-light mb-4" data-testid="hero-subtitle">
            CAFE • WINE • SMALL PLATES
          </p>
          <p className="text-base sm:text-lg text-[#A3A199] font-light mb-12 max-w-2xl mx-auto" data-testid="hero-description">
            Indian flavours with a modern tapas experience
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/menu" className="btn-primary" data-testid="hero-view-menu-btn">
              VIEW MENU
            </Link>
            <Link to="/contact" className="btn-secondary" data-testid="hero-contact-btn">
              CONTACT US
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Announcement Section */}
      {settings?.announcement && (
        <section className="py-6 bg-[#1B3B36] border-b border-white/10" data-testid="announcement-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-[#CBA052] font-light">{settings.announcement}</p>
          </div>
        </section>
      )}

      {/* About Preview Section */}
      <section className="py-24 sm:py-32 bg-[#0F0F0F]" data-testid="about-preview-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="image-hover-zoom rounded-sm overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1766832255363-c9f060ade8b0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHx3aW5lJTIwZ2xhc3MlMjBkYXJrJTIwbHV4dXJ5JTIwcmVzdGF1cmFudHxlbnwwfHx8fDE3ODA2MDI3OTd8MA&ixlib=rb-4.1.0&q=85"
                alt="Restaurant Interior"
                className="w-full h-[500px] object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-[#CBA052] mb-4 font-semibold">ABOUT US</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light tracking-tight text-[#F5F2E9] mb-6">
                Modern Indian Tapas Experience
              </h2>
              <p className="text-base font-light leading-relaxed text-[#A3A199] mb-6">
                Inspired by spice, wine, and social dining, Vine Social Tokyo brings together the vibrant flavors of India with the intimate, shareable experience of Spanish tapas.
              </p>
              <p className="text-base font-light leading-relaxed text-[#A3A199] mb-8">
                Located in the heart of Tokyo, we offer a unique culinary journey where traditional Indian techniques meet contemporary plating and presentation.
              </p>
              <Link to="/about" className="btn-secondary" data-testid="about-learn-more-btn">
                LEARN MORE
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="py-24 sm:py-32 bg-[#1B1C1A]" data-testid="menu-highlights-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-[#CBA052] mb-4 font-semibold">MENU</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light tracking-tight text-[#F5F2E9] mb-6">
              Discover Our Flavours
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Small Plates & Tapas',
                desc: 'Shareable bites bursting with flavor',
                img: 'https://images.pexels.com/photos/14009279/pexels-photo-14009279.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
              },
              {
                title: 'Tandoor Specialties',
                desc: 'Clay oven perfection with authentic spices',
                img: 'https://images.pexels.com/photos/31860145/pexels-photo-31860145.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
              },
              {
                title: 'Wine & Cocktails',
                desc: 'Curated pairings for every dish',
                img: 'https://images.pexels.com/photos/880424/pexels-photo-880424.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="menu-card image-hover-zoom"
                data-testid={`menu-highlight-${idx}`}
              >
                <img src={item.img} alt={item.title} className="w-full h-64 object-cover rounded-sm mb-4" />
                <h3 className="text-xl sm:text-2xl font-heading font-light text-[#CBA052] mb-2">{item.title}</h3>
                <p className="text-base font-light leading-relaxed text-[#A3A199]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/menu" className="btn-primary" data-testid="view-full-menu-btn">
              VIEW FULL MENU
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 bg-[#0F0F0F]" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-light tracking-tight text-[#F5F2E9] mb-6">
            Host Your Next Event With Us
          </h2>
          <p className="text-base font-light leading-relaxed text-[#A3A199] mb-8">
            From intimate gatherings to corporate events, Vine Social Tokyo offers the perfect setting for your special occasion.
          </p>
          <Link to="/parties" className="btn-primary" data-testid="explore-events-btn">
            EXPLORE PARTY PACKAGES
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;