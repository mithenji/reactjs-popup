import React, { useCallback } from 'react';
import Warper from './Warper';
import Popup from 'reactjs-popup';
//

const contentStyle = {
  maxWidth: '600px',
  width: '90%',
};

const CustomModal = () => {
  const handleClose = useCallback((close) => {
    console.log('modal closed');
    close();
  }, []);

  return (
    <Popup
      trigger={
        <button type="button" className="button">
          Open Modal
        </button>
      }
      modal
      lockScroll={true}
      contentStyle={contentStyle}
      nested
    >
      {close => (
        <div className="modal" role="dialog" aria-modal="true">
          <button 
            className="close" 
            onClick={close}
            aria-label="Close modal"
          >
            &times;
          </button>
          <div className="header">
            <h2>Modal Title</h2>
          </div>
          <div className="content">
            {/* Modal content */}
          </div>
          <div className="actions">
            <Popup
              trigger={
                <button type="button" className="button">
                  Menu Demo
                </button>
              }
              position="top center"
              closeOnDocumentClick
              contentStyle={{ padding: '0px' }}
              nested
              keepTooltipInside
            >
              <nav className="popup-menu" role="menu">
                {/* Menu items */}
              </nav>
            </Popup>
            <button
              type="button"
              className="button"
              onClick={() => handleClose(close)}
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default Warper(CustomModal);
