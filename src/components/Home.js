import React from 'react';
import { Link } from 'react-router-dom';

const DeliveryPartnerButton = ({ to, name, bgColor, textColor }) => (
  <Link 
    to={to} 
    className={`w-full max-w-md h-40 flex items-center justify-center ${bgColor} ${textColor} rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
  >
    <span className="text-3xl font-bold">{name}</span>
  </Link>
);

const Home = () => {
  return (
    <div className="container mx-auto text-center py-12 px-4">
      <h2 className="text-3xl font-bold mb-12 text-gray-800">Select Delivery Partner</h2>
      <div className="flex flex-col items-center space-y-6">
        <DeliveryPartnerButton 
          to="/upload/talabat" 
          name="Talabat" 
          bgColor="bg-orange-500" 
          textColor="text-white"
        />
        <DeliveryPartnerButton 
          to="/upload/snoonu" 
          name="Snoonu" 
          bgColor="bg-red-600" 
          textColor="text-white"
        />
        <DeliveryPartnerButton 
          to="/upload/rafeeq" 
          name="Rafeeq" 
          bgColor="bg-purple-600" 
          textColor="text-white"
        />
      </div>
    </div>
  );
};

export default Home;
