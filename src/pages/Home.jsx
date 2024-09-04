import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/homeimg.png'; // Update with the path to your image

function Home() {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 text-white flex flex-col md:flex-row items-center h-screen p-8 md:p-10">
        {/* Text Content */}
        <div className="md:w-1/2 flex flex-col justify-center md:pr-8 mb-6 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Unlock Your Potential <br /> with Expert Mentorship
          </h1>
          <p className="text-lg md:text-2xl mb-6">
            Join our community and find the guidance you need to succeed in your career.
          </p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <Link
              to="/mentee"
              className="bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-yellow-400 transition duration-300 w-full md:w-auto text-center"
            >
              Find a Mentor
            </Link>
            <Link
              to="/mentor"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400 transition duration-300 w-full md:w-auto text-center"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
        {/* Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={heroImage}
            alt="Mentoring"
            className="w-full h-auto md:h-full object-cover rounded-lg p-2"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 md:px-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Personalized Guidance</h2>
            <p className="text-gray-700">
              Receive tailored advice and support to help you achieve your goals and advance your career.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Expert Mentors</h2>
            <p className="text-gray-700">
              Connect with experienced professionals who can provide valuable insights and guidance.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Flexible Scheduling</h2>
            <p className="text-gray-700">
              Schedule sessions at times that work best for you and your mentor, with easy rescheduling options.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-black text-white text-center py-12 px-4 md:px-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg md:text-xl mb-6">
          Whether you're looking for mentorship or ready to guide others, join us today and make a difference.
        </p>
        <Link
          to="/login"
          className="bg-yellow-500 text-black py-2 px-6 rounded-lg hover:bg-yellow-400 transition duration-300"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
}

export default Home;
