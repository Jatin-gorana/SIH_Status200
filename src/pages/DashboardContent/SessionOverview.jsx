import React from 'react';

const SessionOverview = () => {
  // Static data for sessions
  const sessions = [
    {
      date: '2024-09-01',
      time: '10:00 AM - 11:00 AM',
      menteeName: 'Jatin',
      topic: 'React Basics',
      notes: 'Covered React components, props, and state.',
    },
    {
      date: '2024-09-05',
      time: '2:00 PM - 3:00 PM',
      menteeName: 'Manas Patil',
      topic: 'Data Structures',
      notes: 'Focused on arrays, linked lists, and trees.',
    },
    {
      date: '2024-09-08',
      time: '4:00 PM - 5:00 PM',
      menteeName: 'Vedant Modhave',
      topic: 'Machine Learning Intro',
      notes: 'Discussed supervised and unsupervised learning.',
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Session Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold mb-2">{session.topic}</h3>
            <p className="text-gray-700">
              <span className="font-medium">Date:</span> {session.date}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Time:</span> {session.time}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Mentee:</span> {session.menteeName}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-medium">Notes:</span> {session.notes}
            </p>
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-10 p-6 bg-blue-100 rounded-lg shadow-md">
        <h4 className="text-2xl font-semibold mb-4">Additional Information</h4>
        <p className="text-gray-800 mb-2">
          <span className="font-medium">Total Sessions Conducted:</span> {sessions.length}
        </p>
        <p className="text-gray-800">
          <span className="font-medium">Most Recent Session Date:</span> {sessions[sessions.length - 1].date}
        </p>
      </div>
    </div>
  );
};

export default SessionOverview;
