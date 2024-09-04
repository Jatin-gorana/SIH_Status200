import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between mb-6">
          <div className="w-1/2 md:w-1/4 mb-4">
            <h4 className="text-lg font-semibold mb-2">For Business</h4>
            <a href="/employer" className="block text-gray-400 hover:text-white">
              Employer
            </a>
            <a href="/employer" className="block text-gray-400 hover:text-white">
              Employee
            </a>
            <a href="/employer" className="block text-gray-400 hover:text-white">
              Consultant
            </a>
          </div>
          <div className="w-1/2 md:w-1/4 mb-4">
            <h4 className="text-lg font-semibold mb-2">Resources</h4>
            <a href="/resources" className="block text-gray-400 hover:text-white">
              Blog
            </a>
            <a href="/resources" className="block text-gray-400 hover:text-white">
              Case Studies
            </a>
            <a href="/resources" className="block text-gray-400 hover:text-white">
              Webinars
            </a>
          </div>
          <div className="w-1/2 md:w-1/4 mb-4">
            <h4 className="text-lg font-semibold mb-2">Partners</h4>
            <a href="/partners" className="block text-gray-400 hover:text-white">
              Our Partners
            </a>
            <a href="/partners" className="block text-gray-400 hover:text-white">
              Become a Partner
            </a>
          </div>
          <div className="w-1/2 md:w-1/4 mb-4">
            <h4 className="text-lg font-semibold mb-2">Company</h4>
            <a href="/about" className="block text-gray-400 hover:text-white">
              About Us
            </a>
            <a href="/careers" className="block text-gray-400 hover:text-white">
              Careers
            </a>
            <a href="/contact" className="block text-gray-400 hover:text-white">
              Contact Us
            </a>
          </div>
          <div className="w-full md:w-1/4 mb-4">
            <h4 className="text-lg font-semibold mb-2">Connect Us Through</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="text-gray-400 hover:text-white w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-gray-400 hover:text-white w-6 h-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn className="text-gray-400 hover:text-white w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-gray-400 hover:text-white w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} XYZ. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="/terms" className="text-gray-400 hover:text-white text-sm">
              Terms & Conditions
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm">
              Privacy
            </a>
            <a href="/security" className="text-gray-400 hover:text-white text-sm">
              Security
            </a>
            <a href="/cookies" className="text-gray-400 hover:text-white text-sm">
              Cookie Declaration
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
