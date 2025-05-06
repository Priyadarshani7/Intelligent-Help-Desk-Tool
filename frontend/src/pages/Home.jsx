import React, { useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import image from "../assets/pic1.png";
import Toggle from "../components/Toggle";  
import { Link } from 'react-router-dom';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen flex flex-col justify-center items-center px-12 py-20 bg-gradient-to-b bg-[#ECF9FF] dark:from-gray-800 dark:to-gray-900">
        <div className="absolute top-6 right-6">
          <Toggle />
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-5xl">
          <div className="w-full lg:w-1/2 flex justify-center mb-10 lg:mb-0">
            <img
              src={image}
              alt="Help Desk"
              className="w-full max-w-md h-auto object-contain"
            />
          </div>

          <div className="w-full lg:w-1/2 text-center lg:text-left px-6">
            <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-6 leading-tight">
              AI-Powered Help Desk Assistant
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Empower your team with an intelligent help desk tool that uses machine learning to automatically categorize support tickets and connect them to the right department.
            </p>
            {/* <Link to="/create-ticket">
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300">
                Get Started
              </button>
            </Link> */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
