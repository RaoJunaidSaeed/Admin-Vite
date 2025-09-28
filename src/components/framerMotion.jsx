import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const FramerMotion = ({ children, delay = 0, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
      variants={{
        hidden: variants.hidden,
        show: {
          ...variants.show,
          transition: { ...variants.show.transition, delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default FramerMotion;
