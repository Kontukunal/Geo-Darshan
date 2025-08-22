import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-xl text-blue-400">GeoDarshan</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-blue-400 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Case Studies
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Blog
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Privacy
            </a>
          </nav>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400 mb-2">
            All Right Reserved, All Wrong Reversed.
          </p>
          <p className="text-sm text-gray-400">Proudly created in India.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
