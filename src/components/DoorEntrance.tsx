import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DoorOpen } from 'lucide-react';

interface DoorEntranceProps {
  isOpen: boolean;
  onOpenComplete: () => void;
  onStartOpening: () => void;
}

export const DoorEntrance: React.FC<DoorEntranceProps> = ({
  isOpen,
  onOpenComplete,
  onStartOpening,
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    onStartOpening();
    window.setTimeout(() => {
      onOpenComplete();
    }, 1350);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="door-entrance"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden door-stage pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-label="शुभविवाह आमंत्रण प्रवेशद्वार"
        >
          {/* Golden light flash that blooms as doors part, then dissolves cleanly into the real courtyard beneath */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={
              isOpening
                ? { opacity: [0, 0.78, 0] }
                : { opacity: 0 }
            }
            transition={{ duration: 1.25, times: [0, 0.35, 1], ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                'radial-gradient(circle at 50% 48%, rgba(255, 245, 214, 0.96) 0%, rgba(227, 184, 103, 0.52) 42%, rgba(58, 12, 20, 0) 80%)',
            }}
          />

          {/* Left Carved Palace Door — swings outward and glides smoothly past camera */}
          <motion.div
            initial={{ rotateY: 0, scale: 1, x: 0 }}
            animate={
              isOpening
                ? { rotateY: -112, scale: 1.16, x: '-14%' }
                : { rotateY: 0, scale: 1, x: 0 }
            }
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleOpen}
            className="door-panel-left absolute top-0 left-0 w-1/2 h-full overflow-hidden cursor-pointer border-r border-[#D4A24C]/75 shadow-[14px_0_44px_rgba(0,0,0,0.68)] bg-[#2D0A10]"
          >
            <img
              src="/src/assets/images/royal_palace_doors_1795152702162.jpg"
              alt="कोरीव राजेशाही प्रवेशद्वार डावी बाजू"
              referrerPolicy="no-referrer"
              className="w-[200%] max-w-none h-full object-cover object-center select-none pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#1A0408]/45 via-transparent to-[#1A0408]/25 pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-[3px] bg-gradient-to-b from-[#C5933E]/30 via-[#F2D184]/95 to-[#C5933E]/30 pointer-events-none"
            />
          </motion.div>

          {/* Right Carved Palace Door — swings outward and glides smoothly past camera */}
          <motion.div
            initial={{ rotateY: 0, scale: 1, x: 0 }}
            animate={
              isOpening
                ? { rotateY: 112, scale: 1.16, x: '14%' }
                : { rotateY: 0, scale: 1, x: 0 }
            }
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleOpen}
            className="door-panel-right absolute top-0 right-0 w-1/2 h-full overflow-hidden cursor-pointer border-l border-[#D4A24C]/75 shadow-[-14px_0_44px_rgba(0,0,0,0.68)] bg-[#2D0A10]"
          >
            <img
              src="/src/assets/images/royal_palace_doors_1795152702162.jpg"
              alt="कोरीव राजेशाही प्रवेशद्वार उजवी बाजू"
              referrerPolicy="no-referrer"
              className="w-[200%] max-w-none h-full object-cover object-center -translate-x-1/2 select-none pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-l from-[#1A0408]/45 via-transparent to-[#1A0408]/25 pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#C5933E]/30 via-[#F2D184]/95 to-[#C5933E]/30 pointer-events-none"
            />
          </motion.div>

          {/* Top Paithani Silk Lintel Strip */}
          <motion.div
            aria-hidden="true"
            animate={isOpening ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="paithani-border-strip absolute top-0 left-0 right-0 z-20"
          />

          {/* Minimal unobtrusive center brass latch ring */}
          <motion.button
            type="button"
            onClick={handleOpen}
            disabled={isOpening}
            aria-label="प्रवेशद्वार उघडा"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={isOpening ? { opacity: 0, scale: 0.72 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-2 border-[#F2D184]/85 bg-[#2A080E]/55 backdrop-blur-xs text-[#F2D184] shadow-[0_0_32px_rgba(212,162,76,0.45)] transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2D184] active:scale-95 cursor-pointer"
          >
            <span
              aria-hidden="true"
              className="absolute inset-1.5 rounded-full border border-[#F2D184]/50 animate-ping [animation-duration:2.6s]"
            />
            <DoorOpen className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow" aria-hidden="true" />
          </motion.button>

          {/* Clean bottom tap prompt */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isOpening ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="absolute bottom-7 sm:bottom-10 inset-x-0 z-20 flex flex-col items-center justify-center px-4 text-center pointer-events-none"
          >
            <button
              type="button"
              onClick={handleOpen}
              disabled={isOpening}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-lg border border-[#F2D184]/75 bg-[#23060A]/85 backdrop-blur-md px-6 py-2.5 text-xs sm:text-sm font-medium text-[#FDF7EC] shadow-xl transition-colors duration-200 hover:bg-[#3A0B14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2D184] whitespace-nowrap cursor-pointer"
            >
              <span>प्रवेशद्वार उघडण्यासाठी स्पर्श करा</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
