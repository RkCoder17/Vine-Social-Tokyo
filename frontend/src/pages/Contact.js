import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API}/contact`, formData);
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24" data-testid="contact-page">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[#CBA052] mb-4 font-semibold">GET IN TOUCH</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-light tracking-tighter text-[#F5F2E9] mb-6" data-testid="contact-title">
            Contact Us
          </h1>
          <p className="text-base font-light leading-relaxed text-[#A3A199] max-w-2xl mx-auto">
            We'd love to hear from you. Reach out for reservations, inquiries, or just to say hello.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-heading font-light text-[#CBA052] mb-8">Visit Us</h2>
            <div className="space-y-6 mb-12">
              <div className="flex items-start space-x-4">
                <MapPin size={24} className="text-[#CBA052] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-light text-[#F5F2E9] mb-1">Address</h3>
                  <p className="text-base font-light text-[#A3A199]">{settings?.address || 'Shibuya, Tokyo, Japan'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone size={24} className="text-[#CBA052] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-light text-[#F5F2E9] mb-1">Phone</h3>
                  <a href={`tel:${settings?.phone}`} className="text-base font-light text-[#A3A199] hover:text-[#CBA052] transition-colors">
                    {settings?.phone || '+81 3-1234-5678'}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail size={24} className="text-[#CBA052] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-light text-[#F5F2E9] mb-1">Email</h3>
                  <a href={`mailto:${settings?.email}`} className="text-base font-light text-[#A3A199] hover:text-[#CBA052] transition-colors">
                    {settings?.email || 'contact@vinesocialtokyo.com'}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Clock size={24} className="text-[#CBA052] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-light text-[#F5F2E9] mb-1">Hours</h3>
                  <p className="text-base font-light text-[#A3A199]">{settings?.opening_hours || 'Mon-Sun: 11:30 AM - 11:00 PM'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MessageSquare size={24} className="text-[#CBA052] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-light text-[#F5F2E9] mb-1">WhatsApp</h3>
                  <a
                    href={`https://wa.me/${settings?.whatsapp?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-light text-[#A3A199] hover:text-[#CBA052] transition-colors"
                    data-testid="whatsapp-link"
                  >
                    Chat with us on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-heading font-light text-[#CBA052] mb-4">Follow Us</h3>
              <p className="text-base font-light text-[#A3A199] mb-4">
                Stay updated with our latest dishes and events on Instagram
              </p>
              <a
                href={`https://instagram.com/${settings?.instagram?.replace('@', '') || 'vinesocialtokyo'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#CBA052] font-light hover:text-[#DBC184] transition-colors"
                data-testid="instagram-link"
              >
                {settings?.instagram || '@vinesocialtokyo'}
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-heading font-light text-[#CBA052] mb-8">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div>
                <label htmlFor="name" className="block text-sm font-light text-[#F5F2E9] mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  data-testid="contact-form-name"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-light text-[#F5F2E9] mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  data-testid="contact-form-phone"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-light text-[#F5F2E9] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  data-testid="contact-form-email"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-light text-[#F5F2E9] mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  data-testid="contact-form-message"
                  className="w-full"
                ></textarea>
              </div>
              {error && <p className="text-[#9E2A2B] text-sm font-light">{error}</p>}
              {submitted && (
                <p className="text-[#CBA052] text-sm font-light" data-testid="contact-form-success">
                  Thank you! We'll get back to you soon.
                </p>
              )}
              <button type="submit" className="btn-primary w-full" data-testid="contact-form-submit">
                SEND MESSAGE
              </button>
            </form>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-sm overflow-hidden border border-white/10"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.5268576938!2d139.69875431525893!3d35.66169438019749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b5a0c6c2d67%3A0x4e5b7f3f23c9e06d!2sShibuya%2C%20Tokyo%2C%20Japan!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Vine Social Tokyo Location"
            data-testid="google-map"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;