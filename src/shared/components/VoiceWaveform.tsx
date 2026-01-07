import React from 'react';

export const VoiceWaveform: React.FC = () => {
    return (
        <div className="relative w-full h-32 flex items-center justify-center overflow-hidden">
            <svg
                viewBox="0 0 400 100"
                className="w-full max-w-md"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2D60FF" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#00D1FF" stopOpacity="1" />
                        <stop offset="100%" stopColor="#2D60FF" stopOpacity="0.2" />
                    </linearGradient>
                </defs>

                {/* Static Waveform matching the image style */}
                <path
                    d="M 0 50 
             Q 20 20, 40 50 
             Q 60 80, 80 50 
             Q 100 10, 120 50 
             Q 140 90, 160 50 
             Q 180 30, 200 50 
             Q 220 70, 240 50 
             Q 260 0, 280 50 
             Q 300 100, 320 50 
             Q 340 40, 360 50 
             Q 380 60, 400 50"
                    stroke="url(#waveGradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Secondary softer wave */}
                <path
                    d="M 0 50 
             Q 25 35, 50 50 
             Q 75 65, 100 50 
             Q 125 25, 150 50 
             Q 175 75, 200 50 
             Q 225 40, 250 50 
             Q 275 60, 300 50 
             Q 325 30, 350 50 
             Q 375 70, 400 50"
                    stroke="url(#waveGradient)"
                    strokeWidth="2"
                    strokeOpacity="0.5"
                    fill="none"
                    strokeLinecap="round"
                />
            </svg>

            {/* Decorative center glow */}
            <div className="absolute inset-x-0 h-px bg-cyan-400 opacity-20 blur-sm"></div>
        </div>
    );
};
