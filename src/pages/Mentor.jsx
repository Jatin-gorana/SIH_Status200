import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase'; // Ensure correct path to your Firebase config
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; // Import updateDoc for Firestore updates
import { useNavigate } from 'react-router-dom';

function MentorCard({ mentor, onBook }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white transition-transform transform hover:scale-105 duration-300">
      {mentor.photo ? (
        <div className="flex justify-center">
          <img 
            src={mentor.photo} 
            alt={`${mentor.name}'s profile`} 
            className="w-24 h-24 rounded-full mb-4"
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full mb-4 bg-gray-700 flex items-center justify-center text-gray-400">
            No Photo
          </div>
        </div>
      )}
      <h3 className="text-xl font-bold text-center mt-4">{mentor.name}</h3>
      <p className="text-center text-gray-400">{mentor.experience} years of experience</p>
      <p className="mt-2 text-gray-300 text-center">{mentor.bio}</p>
      <p className="mt-2 text-gray-300 text-center"><strong>Skills:</strong> {mentor.skills}</p>
      <p className="mt-2 text-gray-300 text-center"><strong>Mentorship Areas:</strong> {mentor.mentorshipAreas}</p>
      <p className="mt-2 text-gray-300 text-center"><strong>Availability:</strong> {mentor.availability}</p>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => onBook(mentor)} 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition-colors duration-300"
        >
          Connect
        </button>
      </div>
    </div>
  );
}

function Mentor() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mentors, setMentors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'mentors'));
        const mentorList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched mentors:', mentorList); // Log mentors to verify
        setMentors(mentorList);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };
    fetchMentors();
  }, []);

  const handleBook = async (mentor) => {
    if (mentor && mentor.id) {
      try {
        // Increment the view count in Firestore
        const mentorRef = doc(db, 'mentors', mentor.id);
        await updateDoc(mentorRef, {
          views: (mentor.views || 0) + 1, // Increment the views count
        });

        // Navigate to the booking page
        navigate(`/book/${mentor.id}`);
      } catch (error) {
        console.error('Error updating views count:', error);
      }
    } else {
      console.error('Mentor ID is missing.');
    }
  };

  const filteredMentors = mentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.mentorshipAreas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-white mb-10">Our Mentors</h1>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search Mentors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-700 bg-gray-900 text-white rounded-lg w-full max-w-md"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMentors.length > 0 ? (
          filteredMentors.map((mentor, index) => (
            <MentorCard key={index} mentor={mentor} onBook={handleBook} />
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">No mentors found</p>
        )}
      </div>
    </div>
  );
}

export default Mentor;

















// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase/firebase'; // Ensure correct path to your Firebase config
// import { collection, getDocs } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';

// function MentorCard({ mentor, onBook }) {
    
//   return (
//     <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white transition-transform transform hover:scale-105 duration-300">
//       {mentor.photo ? (
//         <div className="flex justify-center">
//           <img 
//             src={mentor.photo} 
//             alt={`${mentor.name}'s profile`} 
//             className="w-24 h-24 rounded-full mb-4"
//           />
//         </div>
//       ) : (
//         <div className="flex justify-center">
//           <div className="w-24 h-24 rounded-full mb-4 bg-gray-700 flex items-center justify-center text-gray-400">
//             No Photo
//           </div>
//         </div>
//       )}
//       <h3 className="text-xl font-bold text-center mt-4">{mentor.name}</h3>
//       <p className="text-center text-gray-400">{mentor.experience} years of experience</p>
//       <p className="mt-2 text-gray-300 text-center">{mentor.bio}</p>
//       <p className="mt-2 text-gray-300 text-center"><strong>Skills:</strong> {mentor.skills}</p>
//       <p className="mt-2 text-gray-300 text-center"><strong>Mentorship Areas:</strong> {mentor.mentorshipAreas}</p>
//       <p className="mt-2 text-gray-300 text-center"><strong>Availability:</strong> {mentor.availability}</p>
//       <div className="flex justify-center mt-4">
//         <button
//           onClick={() => onBook(mentor)} 
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition-colors duration-300"
//         >
//           Connect
//         </button>
//       </div>
//     </div>
//   );
// }

// function Mentor() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [mentors, setMentors] = useState([]);
//   const navigate = useNavigate();  // useNavigate instead of useHistory

//   useEffect(() => {
//     const fetchMentors = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'mentors'));
//         const mentorList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Add the ID
//         console.log('Fetched mentors:', mentorList); // Log mentors to verify
//         setMentors(mentorList);
//       } catch (error) {
//         console.error('Error fetching mentors:', error);
//       }
//     };
//     fetchMentors();
//   }, []);

// //   const handleBook = (mentor) => {
// //     navigate('/book', { state: { mentor } }); // use navigate instead of history.push
// //   };

// const handleBook = (mentor) => {
//     if (mentor && mentor.id) {
//       navigate(`/book/${mentor.id}`);
//     } else {
//       console.error('Mentor ID is missing.');
//     }
//   };
  
  
  
  
  
  
  

//   const filteredMentors = mentors.filter((mentor) =>
//     mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     mentor.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     mentor.mentorshipAreas.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-10 px-4">
//       <h1 className="text-4xl font-bold text-center text-white mb-10">Our Mentors</h1>
//       <div className="flex justify-center mb-6">
//         <input
//           type="text"
//           placeholder="Search Mentors"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="p-3 border border-gray-700 bg-gray-900 text-white rounded-lg w-full max-w-md"
//         />
//       </div>
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {filteredMentors.length > 0 ? (
//           filteredMentors.map((mentor, index) => (
//             <MentorCard key={index} mentor={mentor} onBook={handleBook} />
//           ))
//         ) : (
//           <p className="text-center text-gray-400 col-span-full">No mentors found</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Mentor;
















// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const mentors = [
//       {
//         id: 1,
//         name: 'John Doe',
//         photo: 'https://via.placeholder.com/150',
//         bio: 'An experienced software engineer with over 10 years in web development.',
//         experience: '10+ years in Web Development',
//         skills: 'JavaScript, React, Node.js',
//         linkedin: 'https://www.linkedin.com/in/johndoe',
//         mentorshipAreas: 'Web Development, Career Guidance',
//         availability: 'Weekdays',
//       },
      
//       // Add more mentor objects here
//     ];

// function MentorCard({ mentor }) {
//   return (
//     <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white transition-transform transform hover:scale-105 duration-300">
//       <img 
//         src={mentor.photo} 
//         alt={mentor.name} 
//         className="w-24 h-24 rounded-full mx-auto"
//       />
//       <h3 className="text-xl font-bold text-center mt-4">{mentor.name}</h3>
//       <p className="text-center text-gray-400">{mentor.experience}</p>
//       <p className="mt-2 text-gray-300 text-center">{mentor.bio}</p>
//       <p className="mt-2 text-gray-300 text-center"><strong>Skills:</strong> {mentor.skills}</p>
//       <p className="mt-2 text-gray-300 text-center"><strong>Mentorship Areas:</strong> {mentor.mentorshipAreas}</p>
//       <p className="mt-2 text-gray-300 text-center"><strong>Availability:</strong> {mentor.availability}</p>
//       <div className="flex justify-center mt-4">
//         <Link 
//           to="/book"
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition-colors duration-300"
//         >
//           Book a Meet
//         </Link>
//       </div>
//     </div>
//   );
// }

// function Mentor() {
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredMentors = mentors.filter(mentor =>
//     mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     mentor.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     mentor.mentorshipAreas.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-10">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8">
//           <h1 className="text-4xl font-bold mb-4 md:mb-0">Find Your Mentors</h1>
//           <input 
//             type="text" 
//             placeholder="Search by name, skills, or area"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="bg-gray-700 text-white p-2 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-600"
//           />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {filteredMentors.map(mentor => (
//             <MentorCard key={mentor.id} mentor={mentor} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Mentor;


// import React from 'react';
// import { Link } from 'react-router-dom';

// const mentors = [
//   {
//     id: 1,
//     name: 'John Doe',
//     photo: 'https://via.placeholder.com/150',
//     bio: 'An experienced software engineer with over 10 years in web development.',
//     experience: '10+ years in Web Development',
//     skills: 'JavaScript, React, Node.js',
//     linkedin: 'https://www.linkedin.com/in/johndoe',
//     mentorshipAreas: 'Web Development, Career Guidance',
//     availability: 'Weekdays',
//   },
//   {
//     id: 2,
//     name: 'Jane Smith',
//     photo: 'https://via.placeholder.com/150',
//     bio: 'Data scientist with a passion for machine learning and AI.',
//     experience: '7 years in Data Science',
//     skills: 'Python, Machine Learning, AI',
//     linkedin: 'https://www.linkedin.com/in/janesmith',
//     mentorshipAreas: 'Data Science, Machine Learning',
//     availability: 'Weekends',
//   },
//   {
//     id: 3,
//     name: 'Micheal Smith',
//     photo: 'https://via.placeholder.com/150',
//     bio: 'Data scientist with a passion for machine learning and AI.',
//     experience: '2 years in Data Science',
//     skills: 'Python, Machine Learning, AI',
//     linkedin: 'https://www.linkedin.com/in/janesmith',
//     mentorshipAreas: 'Data Science, Machine Learning',
//     availability: 'Weekends',
//   },
//   // Add more mentor objects here
// ];

// function MentorCard({ mentor }) {
//   return (
//     <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
//       <img 
//         src={mentor.photo} 
//         alt={mentor.name} 
//         className="w-24 h-24 rounded-full mx-auto"
//       />
//       <h3 className="text-xl font-bold text-center mt-4">{mentor.name}</h3>
//       <p className="text-center text-gray-400">{mentor.experience}</p>
//       <p className="mt-2 text-gray-300 text-center">{mentor.bio}</p>
//       <p className="mt-2 text-gray-300 text-center"><strong>Skills:</strong> {mentor.skills}</p>
//       <p className="mt-2 text-gray-300 text-center"><strong>Mentorship Areas:</strong> {mentor.mentorshipAreas}</p>
//       <p className="mt-2 text-gray-300 text-center"><strong>Availability:</strong> {mentor.availability}</p>
//       <div className="flex justify-center mt-4">
//         <Link 
//           to="/book"
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
//         >
//           Book a Meet
//         </Link>
//       </div>
//     </div>
//   );
// }

// function Mentor() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-10">
//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl font-bold text-center mb-8">Find Your Mentors</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {mentors.map(mentor => (
//             <MentorCard key={mentor.id} mentor={mentor} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Mentor;
