import React from 'react';
import ReactDOM from 'react-dom';

const ModalWrapper = ({ children }) => {
  return ReactDOM.createPortal(
    children,
    document.getElementById('modal-root') || document.body
  );
};

export default ModalWrapper;