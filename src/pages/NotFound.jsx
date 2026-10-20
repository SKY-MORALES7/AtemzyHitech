import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';

export const NotFound = () => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-4 py-16 overflow-hidden relative">
      {/* Stefan Devai Retro TV 404 Component */}
      <div className="tv-404-wrapper">
        <div className="tv-main">
          {/* Antenna */}
          <div className="tv-antenna">
            <div className="tv-antenna_shadow" />
            <div className="tv-a1" />
            <div className="tv-a1d" />
            <div className="tv-a2" />
            <div className="tv-a2d" />
          </div>

          {/* TV Body */}
          <div className="tv-box">
            <div className="tv-curve">
              <svg className="tv-curve_svg" viewBox="0 0 189.929 189.929">
                <path d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13 C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z" fill="#000" />
              </svg>
            </div>
            
            {/* Screen Area with Static Noise */}
            <div className="tv-display_div">
              <div className="tv-screen_out">
                <div className="tv-screen_out1">
                  <div className="tv-screen">
                    <span className="tv-notfound_text">NOT FOUND</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ventilation Lines */}
            <div className="tv-lines">
              <div className="tv-line1" />
              <div className="tv-line2" />
              <div className="tv-line3" />
            </div>

            {/* TV Controls & Speakers */}
            <div className="tv-buttons_div">
              <div className="tv-b1"><div /></div>
              <div className="tv-b2" />
              <div className="tv-speakers">
                <div className="tv-g1">
                  <div className="tv-g11" />
                  <div className="tv-g12" />
                  <div className="tv-g13" />
                </div>
                <div className="tv-g" />
                <div className="tv-g" />
              </div>
            </div>
          </div>

          {/* TV Feet */}
          <div className="tv-bottom">
            <div className="tv-base1" />
            <div className="tv-base2" />
            <div className="tv-base3" />
          </div>
        </div>

        {/* Giant 4 0 4 Background Silhouette */}
        <div className="tv-text_404">
          <div className="tv-text_4041">4</div>
          <div className="tv-text_4042">0</div>
          <div className="tv-text_4043">4</div>
        </div>
      </div>

      {/* Corporate Context & Navigation */}
      <div className="mt-8 text-center max-w-md space-y-4 z-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Signal Lost • Page Not Found
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          The requested engineering link or corporate resource has moved or is no longer available on this frequency.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="btn-3d text-sm py-3 px-6"
          >
            <Home className="w-4 h-4 text-blue-600" />
            <span>Return to Homepage</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-3d-secondary text-sm py-3 px-5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
