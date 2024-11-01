'use client'
import React from 'react';

export default function Logout() {
  return (
    <>
      <style jsx>{`
        .logout-container {
          margin-left: 10px;
          float: right;
          width: fit-content;
          padding: 5px;
          border-radius: 5px;
          background-color: #d32f2f;
          display: flex;
          align-items: center;
        }

        .logout-button {
          border: none;
          color: white;
          float:right;
          background-color: #d32f2f;
          cursor: pointer;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 4px;
          transition: background-color 0.3s ease, transform 0.1s ease;
        }

        .logout-button:hover {
          background-color: #c62828;
          transform: scale(1.05);
        }

        .logout-button:active {
          background-color: #b71c1c;
          transform: scale(0.98);
        }
      `}</style>

      <div className="logout-container">
        <button 
          className="logout-button"
          onClick={() => {
            localStorage.removeItem('access_token');
            window.location.href = "http://localhost:3000/";
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
}
