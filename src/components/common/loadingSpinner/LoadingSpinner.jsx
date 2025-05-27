import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClass = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  }[size] || styles.medium;

  return (
    <div className={styles.spinnerContainer}>
      <div className={`${styles.spinner} ${sizeClass}`}></div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default LoadingSpinner;
