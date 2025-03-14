import React from 'react';

const ValidationMessage = ({ message }) => {
    return message ? (
        <div className="text-danger mt-1" style={{ fontSize: '0.8rem' }}>
            {message}
        </div>
    ) : null;
};

export default ValidationMessage;
