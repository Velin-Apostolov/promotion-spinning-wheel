import React from 'react';

const MyModal = ({ isOpen, handleClose, prize }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2 className='modal-title'>Congratulations!</h2>
                </div>
                <div className="modal-body">
                    <p>You've won:</p>
                    <h3>{prize}</h3>
                    <p>Check the code below and enjoy your prize!</p>
                    <button className="close-button" onClick={handleClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default MyModal;
