import React from 'react';

const statusStyles = {
  resolved: 'bg-green-600 text-white hover:bg-green-400 transition-colors duration-200 ',
  pending: 'bg-red-600 text-white hover:bg-red-400 transition-colors duration-200',
  no: 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200'
};

const TicketStatus = ({ status }) => {
  
  const style = statusStyles[status] || statusStyles.no;

  // Capitalize first letter for display if status is provided
  const displayStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : 'No Status';

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${style}`}>
      {displayStatus}
    </span>
  );
};

export default TicketStatus;
