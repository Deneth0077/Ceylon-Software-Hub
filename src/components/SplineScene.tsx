import React, { useEffect, useRef } from 'react';

const SplineScene: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Optional: Add any iframe loading logic here
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.onload = () => {
        console.log('Spline scene loaded');
      };
    }
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <iframe 
        ref={iframeRef}
        src='https://my.spline.design/retrofuturisticcircuitloop-exWiAPyFNLcSE3NcxBEdooHb/' 
        frameBorder='0' 
        width='100%' 
        height='100%'
        className="w-full h-full object-cover"
        loading="lazy"
        title="Futuristic Circuit Loop"
      />
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default SplineScene;