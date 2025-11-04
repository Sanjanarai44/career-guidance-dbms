import React from 'react';
import './Common.css';

const Button = ({ children, onClick, type = 'button', variant = 'primary' }) => {
  return (
    <button 
      className={`button button-${variant}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;