import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-24" data-testid="about-page">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[#CBA052] mb-4 font-semibold">OUR STORY</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-light tracking-tighter text-[#F5F2E9] mb-6" data-testid="about-title">
            About Vine Social Tokyo
          </h1>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-light text-[#CBA052] mb-4">Who We Are</h2>
            <p className="text-base font-light leading-relaxed text-[#A3A199]">
              Vine Social Tokyo is more than just a restaurant - it's a celebration of culinary fusion where the bold, aromatic spices of India meet the convivial, shareable tradition of Spanish tapas.
            </p>
            <p className="text-base font-light leading-relaxed text-[#A3A199]">
              Founded by a team of passionate chefs and hospitality veterans, we set out to create a space in Tokyo where food lovers could gather, share, and explore flavors in a warm, sophisticated setting.
            </p>
            <p className="text-base font-light leading-relaxed text-[#A3A199]">
              Every dish is crafted with care, using the finest ingredients sourced locally and internationally, prepared with traditional techniques and presented with modern flair.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="image-hover-zoom rounded-sm overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1766832255363-c9f060ade8b0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHx3aW5lJTIwZ2xhc3MlMjBkYXJrJTIwbHV4dXJ5JTIwcmVzdGF1cmFudHxlbnwwfHx8fDE3ODA2MDI3OTd8MA&ixlib=rb-4.1.0&q=85"
              alt="Restaurant Interior"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Concept Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="image-hover-zoom rounded-sm overflow-hidden order-2 lg:order-1"
          >
            <img
              src="https://images.pexels.com/photos/14009279/pexels-photo-14009279.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Food Spread"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 order-1 lg:order-2"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-light text-[#CBA052] mb-4">Our Concept</h2>
            <p className="text-base font-light leading-relaxed text-[#A3A199]">
              The concept behind Vine Social is simple: food tastes better when shared. Inspired by the Spanish tapas culture and India's rich culinary heritage, we've created a menu designed for exploration and conversation.
            </p>
            <p className="text-base font-light leading-relaxed text-[#A3A199]">
              Our small plates allow you to sample a variety of flavors, spices, and textures throughout your meal. Paired with carefully selected wines and handcrafted cocktails, every visit becomes a journey of discovery.
            </p>
            <p className="text-base font-light leading-relaxed text-[#A3A199]">
              The warm, intimate atmosphere of our space reflects the philosophy of social dining - where strangers become friends over a shared love of great food and wine.
            </p>
          </motion.div>
        </div>

        {/* Why Different Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#1B1C1A] border border-white/10 rounded-sm p-12 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-light text-[#CBA052] mb-8">Why We're Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-heading font-light text-[#F5F2E9] mb-3">Fusion Excellence</h3>
              <p className="text-base font-light leading-relaxed text-[#A3A199]">
                We honor traditional Indian recipes while embracing modern tapas-style presentation and dining.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-heading font-light text-[#F5F2E9] mb-3">Curated Wine List</h3>
              <p className="text-base font-light leading-relaxed text-[#A3A199]">
                Our sommelier has hand-selected wines that perfectly complement the complex spices of our cuisine.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-heading font-light text-[#F5F2E9] mb-3">Social Atmosphere</h3>
              <p className="text-base font-light leading-relaxed text-[#A3A199]">
                Designed for sharing, our space encourages connection and conversation over exceptional food.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;