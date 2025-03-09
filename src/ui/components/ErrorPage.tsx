import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoAdminHome = () => {
    navigate("/admin/login");
  };

  return (
    <div className="h-full bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-11/12 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <div className="px-6 pb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Challenger non trovato
          </h1>
          <p className="text-gray-600 mb-6">
            Il challenger che stai cercando non esiste nel sistema.
          </p>
          <Button variant="contained" onClick={handleGoAdminHome}>
            Torna alla Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
