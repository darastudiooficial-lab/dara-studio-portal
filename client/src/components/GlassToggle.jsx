import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const GlassToggle = ({ onThemeToggle, onLangToggle, currentLang, isDark }) => {
  return (
    <div className="flex gap-4 p-4 items-center justify-center">
      
      {/* Toggle de Tema (Sol/Lua) */}
      <div 
        onClick={onThemeToggle}
        className="relative w-20 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-full cursor-pointer p-1 transition-all shadow-lg"
      >
        <motion.div 
          animate={{ x: isDark ? 40 : 0 }}
          className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]"
        >
          {isDark ? <Moon size={18} className="text-white" /> : <Sun size={18} className="text-white" />}
        </motion.div>
      </div>

      {/* Toggle de Idioma (PT/EN) - Baseado na image_38ec26.png */}
      <div 
        onClick={onLangToggle}
        className="relative w-24 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-full cursor-pointer p-1 flex items-center shadow-lg"
      >
        <motion.div 
          animate={{ x: currentLang === 'PT' ? 0 : 52 }}
          className="absolute w-10 h-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center font-bold text-xs text-white z-10"
        >
          {currentLang}
        </motion.div>
        
        <div className="flex w-full justify-around text-[10px] font-bold text-slate-500 select-none">
          <span>PT</span>
          <span>EN</span>
        </div>
      </div>

    </div>
  );
};

export default GlassToggle;
