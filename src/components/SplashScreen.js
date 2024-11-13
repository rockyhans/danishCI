import React, { useState, useEffect } from 'react';
import "./Page1.css";
import imps from "../assets/logo1.png";


const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Set the duration for the splash screen (e.g., 3000ms = 3 seconds)

    return () => clearTimeout(timer);
  }, []);

  if (!showSplash) {
    return null; // Do not render anything if the splash screen should be hidden
  }

  return (
    <div className="splash-screen">
      <img src={imps} alt="Splash" />
      </div>
  );
};

export default SplashScreen;
