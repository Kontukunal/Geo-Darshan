import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex flex-col items-center justify-center p-8 rounded-none">
      <div className="flex flex-col items-center text-center">
        <span className="font-black text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tighter mb-2">
          Geo Darshan
        </span>

        <hr className="my-2 w-2/3 md:w-1/2 lg:w-1/3 border-t-2 border-white opacity-50" />

        <p className="text-white text-sm mt-2">Developed by Kunal Mali</p>
      </div>
    </footer>
  );
};

export default Footer;
