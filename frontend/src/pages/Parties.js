import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Gift } from 'lucide-react';

const Parties = () => {
  const packages = [
    {
      icon: <Gift size={40} />,
      title: 'Birthday Parties',
      description: 'Celebrate your special day with an intimate gathering featuring personalized menu selections and dedicated service.',
      features: ['Custom menu planning', 'Private seating area', 'Birthday dessert included', 'Flexible timing'],
    },
    {
      icon: <Briefcase size={40} />,
      title: 'Corporate Events',
      description: 'Host professional gatherings, team dinners, or client meetings in our sophisticated setting.',
      features: ['Business-friendly atmosphere', 'AV equipment available', 'Catering packages', 'Invoicing support'],
    },
    {
      icon: <Users size={40} />,
      title: 'Private Gatherings',
      description: 'From anniversaries to reunions, create unforgettable memories with your loved ones.',
      features: ['Customizable space', 'Dedicated staff', 'Tailored menu options', 'Flexible group sizes'],
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24" data-testid="parties-page">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[#CBA052] mb-4 font-semibold">CELEBRATIONS</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-light tracking-tighter text-[#F5F2E9] mb-6" data-testid="parties-title">
            Parties & Events
          </h1>
          <p className="text-base font-light leading-relaxed text-[#A3A199] max-w-2xl mx-auto">
            Make your next celebration unforgettable at Vine Social Tokyo. We specialize in creating memorable experiences for groups of all sizes.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="image-hover-zoom rounded-sm overflow-hidden mb-24"
        >
          <img
            src="https://images.pexels.com/photos/3937670/pexels-photo-3937670.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt="Party Setting"
            className="w-full h-[500px] object-cover"
          />
        </motion.div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {packages.map((pkg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="menu-card text-center"
              data-testid={`party-package-${idx}`}
            >
              <div className="flex justify-center text-[#CBA052] mb-6">{pkg.icon}</div>
              <h3 className="text-xl sm:text-2xl font-heading font-light text-[#CBA052] mb-4">{pkg.title}</h3>
              <p className="text-base font-light leading-relaxed text-[#A3A199] mb-6">{pkg.description}</p>
              <ul className="text-left space-y-2">
                {pkg.features.map((feature, fIdx) => (
                  <li key={fIdx} className="text-sm font-light text-[#A3A199] flex items-start">
                    <span className="text-[#CBA052] mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Catering Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#1B1C1A] border border-white/10 rounded-sm p-12 text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-light text-[#CBA052] mb-6">Catering Services</h2>
          <p className="text-base font-light leading-relaxed text-[#A3A199] max-w-2xl mx-auto mb-8">
            Planning an event at your own venue? Let us bring the Vine Social Tokyo experience to you with our premium catering service. We handle everything from menu design to service staff.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <h4 className="text-lg font-heading font-light text-[#F5F2E9] mb-2">Off-Site Catering</h4>
              <p className="text-sm font-light text-[#A3A199]">Full-service catering for events at your location.</p>
            </div>
            <div>
              <h4 className="text-lg font-heading font-light text-[#F5F2E9] mb-2">Custom Menus</h4>
              <p className="text-sm font-light text-[#A3A199]">Tailored menus to match your preferences and dietary needs.</p>
            </div>
            <div>
              <h4 className="text-lg font-heading font-light text-[#F5F2E9] mb-2">Professional Staff</h4>
              <p className="text-sm font-light text-[#A3A199]">Experienced servers and bartenders for seamless service.</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-light text-[#F5F2E9] mb-6">Ready to Plan Your Event?</h2>
          <p className="text-base font-light leading-relaxed text-[#A3A199] max-w-2xl mx-auto mb-8">
            Contact us today to discuss your custom package. Our events team will work with you to create the perfect experience.
          </p>
          <Link to="/contact" className="btn-primary" data-testid="contact-us-cta-btn">
            CONTACT US FOR CUSTOM PACKAGES
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Parties;