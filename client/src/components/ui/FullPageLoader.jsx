import React from 'react';
import styled from 'styled-components';

const FullPageLoader = ({ message = "Synchronizing Data..." }) => {
  return (
    // 🔹 Added Backdrop Blur and White Overlay
    <div className='fixed inset-0 flex flex-col items-center justify-center z-[9999] bg-white/60 backdrop-blur-md transition-all'>
      <StyledWrapper>
        <div className="loader" />
      </StyledWrapper>

      {/* 🔹 Added Branding/Status Text */}
      <div className="mt-12 text-center animate-pulse">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Adhya Computer
        </p>
        <p className="text-sm font-bold text-slate-700 mt-1">
          {message}
        </p>
      </div>
    </div>
  );
}

const StyledWrapper = styled.div`
  .loader {
    width: 48px;
    height: 48px;
    margin: auto;
    position: relative;
  }

  /* The Shadow */
  .loader:before {
    content: '';
    width: 48px;
    height: 5px;
    background: rgba(0, 0, 0, 0.1); /* 🔹 Softer shadow for professional look */
    position: absolute;
    top: 60px;
    left: 0;
    border-radius: 50%;
    animation: shadow324 0.5s linear infinite;
  }

  /* The Jumping Square */
  .loader:after {
    content: '';
    width: 100%;
    height: 100%;
    background: #0f172a; /* 🔹 Use your Slate-900 to match your dashboard */
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 8px; /* 🔹 Matching your button radii */
    animation: jump7456 0.5s linear infinite;
  }

  @keyframes jump7456 {
    15% { border-bottom-right-radius: 3px; }
    25% { transform: translateY(9px) rotate(22.5deg); }
    50% {
      transform: translateY(18px) scale(1, .9) rotate(45deg);
      border-bottom-right-radius: 32px; /* 🔹 Softer corner transition */
    }
    75% { transform: translateY(9px) rotate(67.5deg); }
    100% { transform: translateY(0) rotate(90deg); }
  }

  @keyframes shadow324 {
    0%, 100% { transform: scale(1, 1); }
    50% { transform: scale(1.2, 1); }
  }
`;

export default FullPageLoader;