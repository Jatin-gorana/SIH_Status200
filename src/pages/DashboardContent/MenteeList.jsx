import React from 'react';

const MenteeList = () => {
  // Static data for mentees
  const mentees = [
    {
      name: 'Jatin',
      email: 'jatingorana123@gmail.com',
      areaOfInterest: 'Web Development',
      badge: 'Dedicated Achiever',
    },
    {
      name: 'Manas Patil',
      email: 'patilmanas63@gmail.com',
      areaOfInterest: 'Data Science',
      badge: 'Committed Learner',
    },
    {
      name: 'Vedant Modhave',
      email: 'vedhmodh26@gmail.com',
      areaOfInterest: 'Machine Learning',
      badge: 'Engaged Starter',
    },
    {
      name: 'Drishti',
      email: 'drishti@gmail.com',
      areaOfInterest: 'Cloud Computing',
      badge: 'Dedicated Achiever',
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Mentees Overview</h2>

      {/* Additional Information */}
      <div className="mb-8 p-4 bg-blue-100 rounded-lg shadow-md text-center">
        <p className="text-xl font-semibold">Total Mentees Met: {mentees.length}</p>
        <p className="text-gray-700">Keep up the great work mentoring your mentees!</p>
      </div>

      {/* Mentee List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentees.map((mentee, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold mb-2">{mentee.name}</h3>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {mentee.email}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Area of Interest:</span> {mentee.areaOfInterest}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-medium">Badge Earned:</span> {mentee.badge}
            </p>
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenteeList;
