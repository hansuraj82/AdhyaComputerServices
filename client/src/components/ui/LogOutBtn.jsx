import React from 'react';
import styled from 'styled-components';

const LogOutBtn = ({ onLogout }) => {
  return (
    <StyledWrapper>
      <button className="Btn" onClick={onLogout}>
        <div className="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" /></svg></div>
        <div className="text">Logout</div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 40px; /* 🔹 Slightly smaller for elegance */
    height: 40px;
    border: none;
    border-radius: 12px; /* 🔹 Matching your input/button radius */
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: .3s;
    background-color: #0f172a; /* 🔹 Default to Slate-900 */
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
  }

  .sign {
    width: 40px;
    transition-duration: .3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign svg {
    width: 18px;
    fill: white;
  }

  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 11px; /* 🔹 Micro-copy looks more professional */
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transition-duration: .3s;
  }

  .Btn:hover {
    width: 110px;
    border-radius: 12px;
    background-color: #ef4444; /* 🔹 Turns red only on hover */
    box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2);
  }

  .Btn:hover .sign {
    width: 30%;
    padding-left: 12px;
  }

  .Btn:hover .text {
    opacity: 1;
    width: 70%;
  }

  .Btn:active {
    transform: translate(1px, 1px);
    box-shadow: 0 5px 10px rgba(239, 68, 68, 0.2);
  }
`;

export default LogOutBtn;
