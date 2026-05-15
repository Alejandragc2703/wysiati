import React from 'react';

const StakingRing = ({ days = 48 }) => {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (0.8 * circumference);

  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center relative group">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
          <circle
            stroke="rgba(255,255,255,0.05)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <defs>
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <circle
            stroke="url(#neonGradient)"
            fill="transparent"
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeWidth={stroke}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white">{days}</span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-cyan-neon font-bold">Días</span>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-400 font-medium uppercase tracking-widest">En Racha</p>
    </div>
  );
};

export default StakingRing;