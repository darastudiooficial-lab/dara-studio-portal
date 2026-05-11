import React, { useState, useEffect } from 'react';

const SplashScreen = ({ portalName, onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isGone, setIsGone] = useState(false);

  useEffect(() => {
    // Total duration ~3.5s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2850); 

    const goneTimer = setTimeout(() => {
      setIsGone(true);
      if (onComplete) onComplete();
    }, 3500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(goneTimer);
    };
  }, [onComplete]);

  if (isGone) return null;

  return (
    <div id="splash" className={isExiting ? 'exiting' : ''}>
      <div id="splash-bg" />
      <div id="splash-content">
        <div id="sp-logo-wrap">
          <div className="sp-logo-d">D</div>
        </div>
        <div id="sp-name-wrap">
          <div className="sp-name">DARA</div>
          <div className="sp-tagline">Excellence in every detail</div>
        </div>
        <div className="sp-line" />
        <div id="sp-portal">
          <div className="sp-portal-label">{portalName}</div>
          <div className="sp-portal-title">DARA Studio</div>
        </div>
        <div className="sp-bar-wrap">
          <div className="sp-bar" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
