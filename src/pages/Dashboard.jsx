import React, { useState, useEffect } from 'react';
import Overview from './DashboardContent/Overview';
import SessionOverview from './DashboardContent/SessionOverview';
// import MentorProfile from './DashboardContent/MentorProfile';
import MenteeList from './DashboardContent/MenteeList';
import { HiHome, HiUserGroup, HiCalendar, HiBookOpen } from 'react-icons/hi';
import { auth, db } from '../firebase/firebase'; // Ensure your Firebase setup is imported
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import Resources from './DashboardContent/Resources';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mentorId, setMentorId] = useState(null); // State for mentor ID
  const [mentorName, setMentorName] = useState(''); // State for mentor name
  const [error, setError] = useState(null); // Error state for fetching mentor data
  const [loading, setLoading] = useState(true); // Loading state to handle async operations

  // Fetch the logged-in mentor's ID and name on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Assuming mentor's name is stored in displayName when using Firebase Authentication
        const mentorDisplayName = user.displayName; 
        if (mentorDisplayName) {
          // User is signed in, fetch mentor data from Firestore using name
          try {
            const mentorsRef = collection(db, 'mentors');
            const q = query(mentorsRef, where('name', '==', mentorDisplayName)); // Use name for querying

            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const mentorData = querySnapshot.docs[0].data(); // Assuming mentor names are unique
              setMentorId(querySnapshot.docs[0].id); // Set the mentor ID from Firestore
              setMentorName(mentorData.name); // Set the mentor name from Firestore
              console.log('Mentor data fetched:', mentorData); // Debugging log
            } else {
              console.error('No mentor found with the logged-in name.');
              setError('No mentor found with the logged-in name.');
            }
          } catch (error) {
            console.error('Error fetching mentor data:', error);
            setError('Failed to fetch mentor data.');
          }
        } else {
          console.error('Mentor name not available.');
          setError('Mentor name not available.');
        }
      } else {
        console.error('User is not logged in.');
        setError('User is not logged in.');
      }
      setLoading(false); // Stop loading after handling auth state
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'mentees':
        return <MenteeList mentorId={mentorId} mentorName={mentorName} />; // Pass props to MenteeList
      case 'sessions':
        return <SessionOverview />;
        case 'resources':
          return <Resources />;
      default:
        return <Overview mentorId={mentorId} mentorName={mentorName} />; // Default to MenteeList with props
    }
  };

  if (loading) {
    return <p className="text-center">Loading...</p>; // Display loading state while fetching data
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>; // Display error message if there is an error
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Desktop */}
      <div className={`hidden md:flex md:flex-col md:w-64 md:bg-gray-800 md:text-white`}>
        <div className="flex items-center justify-center p-4 bg-gray-900">
          <h1 className="text-2xl font-bold">Mentor Dashboard</h1>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {[
            { name: 'Overview', icon: <HiHome />, section: 'overview' },
            { name: 'Mentees', icon: <HiUserGroup />, section: 'mentees' },
            { name: 'Sessions', icon: <HiCalendar />, section: 'sessions' },
            { name: 'Planning', icon: <HiBookOpen />, section: 'resources' }
          ].map((item) => (
            <button
              key={item.section}
              className={`w-full flex items-center text-left px-4 py-2 rounded-md hover:bg-gray-700 ${
                activeSection === item.section ? 'bg-gray-700' : ''
              }`}
              onClick={() => setActiveSection(item.section)}
            >
              {item.icon} <span className="ml-3">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 bg-gray-800 text-white md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <h1 className="text-2xl font-bold">Mentor Dashboard</h1>
          <button className="text-white" onClick={() => setSidebarOpen(false)}>X</button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {[
            { name: 'Overview', icon: <HiHome />, section: 'overview' },
            { name: 'Mentees', icon: <HiUserGroup />, section: 'mentees' },
            { name: 'Sessions', icon: <HiCalendar />, section: 'sessions' },
            { name: 'Resources', icon: <HiBookOpen />, section: 'resources' }
          ].map((item) => (
            <button
              key={item.section}
              className={`w-full flex items-center text-left px-4 py-2 rounded-md hover:bg-gray-700 ${
                activeSection === item.section ? 'bg-gray-700' : ''
              }`}
              onClick={() => {
                setActiveSection(item.section);
                setSidebarOpen(false); // Close sidebar on selection
              }}
            >
              {item.icon} <span className="ml-3">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:ml-10 overflow-y-auto">
        <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>☰</button>
        {renderContent()}
      </div>
    </div>
  );
}

export default Dashboard;









// import React, { useState } from 'react';
// import MenteeList from './DashboardContent/MenteeList';
// import SessionOverview from './DashboardContent/SessionOverview';
// import MentorProfile from './DashboardContent/MentorProfile';
// import { HiHome, HiUserGroup, HiCalendar, HiBookOpen, HiUserCircle } from 'react-icons/hi';

// function Dashboard() {
//   const [activeSection, setActiveSection] = useState('overview');
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'mentees':
//         return <MenteeList />;
//       case 'sessions':
//         return <SessionOverview />;
//       case 'profile':
//         return <MentorProfile />;
//       default:
//         return <MenteeList />;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar for Desktop */}
//       <div className={`hidden md:flex md:flex-col md:w-64 md:bg-gray-800 md:text-white`}>
//         <div className="flex items-center justify-center p-4 bg-gray-900">
//           <h1 className="text-2xl font-bold">Mentor Dashboard</h1>
//         </div>
//         <nav className="flex-1 px-2 py-4 space-y-2">
//           {[
//             { name: 'Overview', icon: <HiHome />, section: 'overview' },
//             { name: 'Mentees', icon: <HiUserGroup />, section: 'mentees' },
//             { name: 'Sessions', icon: <HiCalendar />, section: 'sessions' },
//             { name: 'Resources', icon: <HiBookOpen />, section: 'resources' },
//             { name: 'Profile', icon: <HiUserCircle />, section: 'profile' },
//           ].map((item) => (
//             <button
//               key={item.section}
//               className={`w-full flex items-center text-left px-4 py-2 rounded-md hover:bg-gray-700 ${
//                 activeSection === item.section ? 'bg-gray-700' : ''
//               }`}
//               onClick={() => setActiveSection(item.section)}
//             >
//               {item.icon} <span className="ml-3">{item.name}</span>
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Mobile Sidebar */}
//       <div className={`fixed inset-0 z-40 bg-gray-800 text-white md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
//         <div className="flex items-center justify-between p-4 bg-gray-900">
//           <h1 className="text-2xl font-bold">Mentor Dashboard</h1>
//           <button className="text-white" onClick={() => setSidebarOpen(false)}>X</button>
//         </div>
//         <nav className="flex-1 px-2 py-4 space-y-2">
//           {[
//             { name: 'Overview', icon: <HiHome />, section: 'overview' },
//             { name: 'Mentees', icon: <HiUserGroup />, section: 'mentees' },
//             { name: 'Sessions', icon: <HiCalendar />, section: 'sessions' },
//             { name: 'Resources', icon: <HiBookOpen />, section: 'resources' },
//             { name: 'Profile', icon: <HiUserCircle />, section: 'profile' },
//           ].map((item) => (
//             <button
//               key={item.section}
//               className={`w-full flex items-center text-left px-4 py-2 rounded-md hover:bg-gray-700 ${
//                 activeSection === item.section ? 'bg-gray-700' : ''
//               }`}
//               onClick={() => {
//                 setActiveSection(item.section);
//                 setSidebarOpen(false); // Close sidebar on selection
//               }}
//             >
//               {item.icon} <span className="ml-3">{item.name}</span>
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 p-6 md:ml-10 overflow-y-auto">
//         <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>☰</button>
//         {renderContent()}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
