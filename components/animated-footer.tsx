"use client";

import Image from "next/image";

export function AnimatedFooter() {
  const message = "Make your agents smart enough to bet on right time";
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t-[3px] border-[#2C1810]/30 bg-gradient-to-r from-[#FFD93D] via-[#FFE066] to-[#FFD93D] shadow-[0_-4px_12px_rgba(44,24,16,0.15)] safe-area-inset-bottom">
      <div className="relative overflow-hidden py-3.5">
        {/* Scrolling text animation */}
        <div className="flex items-center whitespace-nowrap">
          {/* First set - for seamless loop */}
          <div className="flex animate-scroll items-center gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={`set1-${i}`} className="flex items-center gap-3 px-6">
                <Image 
                  src="/images/bnb.webp" 
                  alt="BNB" 
                  width={28} 
                  height={28} 
                  className="h-7 w-7 shrink-0 drop-shadow-md sm:h-8 sm:w-8" 
                />
                <span className="text-sm font-black text-[#2C1810] tracking-wide sm:text-base">
                  {message}
                </span>
              </div>
            ))}
          </div>
          {/* Second set - duplicate for seamless loop */}
          <div className="flex animate-scroll items-center gap-6" aria-hidden="true">
            {[...Array(3)].map((_, i) => (
              <div key={`set2-${i}`} className="flex items-center gap-3 px-6">
                <Image 
                  src="/images/bnb.webp" 
                  alt="BNB" 
                  width={28} 
                  height={28} 
                  className="h-7 w-7 shrink-0 drop-shadow-md sm:h-8 sm:w-8" 
                />
                <span className="text-sm font-black text-[#2C1810] tracking-wide sm:text-base">
                  {message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
