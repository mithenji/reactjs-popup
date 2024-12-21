import React, { useState, useCallback } from 'react';
import Warper from './Warper';
import Popup from 'reactjs-popup';

const ControlledPopup = () => {
  const [open, setOpen] = useState(false);
  
  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const handleToggle = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  return (
    <div>
      <button 
        type="button" 
        className="button" 
        onClick={handleToggle}
      >
        Controlled Popup
      </button>
      <Popup 
        open={open} 
        closeOnDocumentClick 
        onClose={closeModal}
      >
        {close => (
          <div className="modal">
            <button 
              className="close" 
              onClick={close}
              aria-label="Close modal"
            >
              &times;
            </button>
            <div className="modal-content">
              Lorem ipsum dolor sit amet...
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default Warper(ControlledPopup);
