import React, { useState, useEffect, useRef } from 'react';
import DaraLogo from './DaraLogo';

const SplashScreen = ({ portalName, onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isGone, setIsGone] = useState(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Total duration ~3.5s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2850); 

    const goneTimer = setTimeout(() => {
      setIsGone(true);
      if (onCompleteRef.current) onCompleteRef.current();
    }, 3500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  if (isGone) return null;

  return (
    <div id="splash" className={isExiting ? 'exiting' : ''}>
      <div id="splash-bg" />
      <div id="splash-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <DaraLogo size={120} variant="stacked" />
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
