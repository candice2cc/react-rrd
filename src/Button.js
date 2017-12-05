import React from 'react';
import PropTypes from 'prop-types';

const buttonStyles = {
    border: '1px solid #eee',
    borderRadius: '3px',
};

const Button = ({ children, onClick }) => (
    <button
        style={buttonStyles}
        onClick={onClick}>
        {children}
    </button>
);
Button.propTypes = {
    children: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};
export default Button;
