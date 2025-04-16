import React from "react";
import MainLayout from "../layout/MainLayout";
import image from '../assets/pic2.png';

const HomePage = () => {
  return (
    <MainLayout>
      <div className="bg-[#f3f4f6] min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-16 py-16 flex flex-col lg:flex-row items-center">
        
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-semibold text-[#333] mb-4">
              AI-Powered Help Desk Assistant
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Empower your team with an intelligent help desk tool that uses machine learning to automatically categorize support tickets and connect them to the right department.
            </p>
            
            <div className="mt-10">
              <button className="px-6 py-3 bg-[#00A8CC] text-white font-semibold rounded-lg hover:bg-[#008C99] transition duration-300 ease-in-out">
                Get Started
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <img src={image} alt="Help Desk" className="w-3/4 h-auto object-contain mx-auto" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
