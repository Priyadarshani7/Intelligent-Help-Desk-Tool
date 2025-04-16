import React from "react";
import MainLayout from "../layout/MainLayout";
import image from '../assets/pic1.png';

const HomePage = () => {
  return (
    <MainLayout>
      <div className="bg-[#f3f4f6] min-h-screen flex flex-col justify-center items-center px-12 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-4xl">
        
          <div className="w-full lg:w-1/2 flex justify-center mb-10 lg:mb-0">
            <img
              src={image}
              alt="Help Desk"
              className="w-full max-w-md h-auto object-contain"
            />
          </div>

          
          <div className="w-full lg:w-1/2 text-center lg:text-left px-6">
            <h1 className="text-4xl font-semibold text-[#333] mb-4">
              AI-Powered Help Desk Assistant
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Empower your team with an intelligent help desk tool that uses machine learning to automatically categorize support tickets and connect them to the right department.
            </p>
          </div>
        </div>

       
        <div className="mt-12">
          <button className="px-5 py-3 bg-[#00A8CC] text-white font-semibold rounded-4xl hover:bg-[#008C99] transition duration-300 ease-in-out">
            Get Started
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
