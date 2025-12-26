"use client";
import { useState, useEffect } from 'react';

export default function NotFound() {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const quotes = [
    "The timelines are converging in unexpected ways.",
    "This variant seems to have pruned itself.",
    "For all time. Always. But not this page.",
    "Nexus event detected: Page does not exist.",
    "The Sacred Timeline doesn't include this URL."
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Floating branch lines */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <path
            d="M 500 0 Q 400 250, 500 500 T 500 1000"
            stroke="#f97316"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M 500 0 Q 600 250, 500 500 T 500 1000"
            stroke="#ea580c"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />
          <path
            d="M 500 200 Q 300 300, 200 500"
            stroke="#fb923c"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 500 300 Q 700 400, 800 600"
            stroke="#fdba74"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        {/* Main 404 Display */}
        <div className="mb-8">
          <div className={`inline-block transition-all duration-200 ${glitchActive ? 'transform translate-x-1' : ''}`}>
            <h1 className="text-9xl font-bold text-orange-600 mb-2 tracking-wider" style={{ fontFamily: 'monospace' }}>
              404
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
          </div>
        </div>

        {/* Branch Icon */}
        <div className="mb-6 flex justify-center">
          <svg width="80" height="80" viewBox="0 0 100 100" className="text-orange-600">
            <circle cx="50" cy="20" r="8" fill="currentColor" />
            <line x1="50" y1="28" x2="50" y2="50" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="50" r="6" fill="currentColor" />
            <line x1="50" y1="56" x2="30" y2="80" stroke="currentColor" strokeWidth="3" />
            <line x1="50" y1="56" x2="70" y2="80" stroke="currentColor" strokeWidth="3" />
            <circle cx="30" cy="80" r="6" fill="currentColor" />
            <circle cx="70" cy="80" r="6" fill="currentColor" />
          </svg>
        </div>

        {/* Main Message */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Timeline Branched - Page Not Found
        </h2>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          This path has diverged from the Sacred Timeline. The page you're looking for exists in another variant reality.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/"
            className="px-8 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg"
          >
            Return to Home
          </a>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-white text-orange-600 border-2 border-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
          >
            Prune & Go Back
          </button>
        </div>
      </div>
    </div>
  );
}