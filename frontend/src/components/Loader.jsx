// src/components/Loader.js
import React from 'react';

function Loader({ message = "Submitting ticket..." }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-40 z-50">
      <div className="bg-white dark:bg-black px-6 py-4 rounded-xl shadow-xl flex flex-col items-center">
        <svg
          className="animate-spin h-8 w-8 text-blue-500 mb-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        <p className="text-gray-700 dark:text-white text-sm">{message}</p>
      </div>
    </div>
  );
}

export default Loader;
