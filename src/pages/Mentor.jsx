import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase'; // Ensure correct path to your Firebase config
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import { useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'; // Import star icons for ratings

// Star Rating Component
function StarRating({ rating }) {
  const fullStars = Math.floor(rating); // Number of full stars
  const hasHalfStar = rating % 1 >= 0.5; // Check if there's a half star

  return (
    <div className="flex justify-center mt-2">
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          return <FaStar key={index} size={20} color="#FFD700" />;
        }
        if (index === fullStars && hasHalfStar) {
          return <FaStarHalfAlt key={index} size={20} color="#FFD700" />;
        }
        return <FaStar key={index} size={20} color="#ddd" />;
      })}
    </div>
  );
}

function MentorCard({ mentor, onBook }) {
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    // Calculate review count
    if (mentor.reviews) {
      setReviewCount(mentor.reviews.length);
    }
  }, [mentor.reviews]);

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 ease-in-out">
      {/* Mentor Image */}
      {mentor.photo ? (
        <div className="flex justify-center mb-4">
          <img 
            src={mentor.photo} 
            alt={`${mentor.name}'s profile`} 
            className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-lg"
          />
        </div>
      ) : (
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border-4 border-yellow-500 shadow-lg">
            No Photo
          </div>
        </div>
      )}

      {/* Mentor Details */}
      <h3 className="text-2xl font-bold text-center mt-4">{mentor.name}</h3>
      <p className="text-center text-gray-400">{mentor.experience} years of experience</p>
      <p className="mt-2 text-gray-300 text-center italic">{mentor.bio}</p>

      {/* Skills Display */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {mentor.skills.split(',').map((skill, index) => (
          <span key={index} className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {skill.trim()}
          </span>
        ))}
      </div>

      {/* Mentorship Areas */}
      <div className="mt-4">
        <p className="text-sm text-gray-300 text-center"><strong>Mentorship Areas:</strong></p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {mentor.mentorshipAreas.split(',').map((area, index) => (
            <span key={index} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {area.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* Availability */}
      <p className="mt-4 text-gray-300 text-center">
        <strong>Availability:</strong> {mentor.availability}
      </p>

      {/* Star Rating and Reviews */}
      <div className="flex flex-col items-center mt-4">
        <StarRating rating={mentor.ratings} />
        <p className="text-gray-400 mt-1">({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</p>
      </div>

      {/* Connect Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => onBook(mentor)} 
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
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
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [menteeSkills, setMenteeSkills] = useState([]); // State to store mentee skills as an array
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'mentors'));
        const mentorList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched mentors:', mentorList); // Log mentors to verify
        setMentors(mentorList);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    const fetchMenteeSkills = async () => {
      const currentUser = auth.currentUser; // Directly get the currently logged-in user
      if (currentUser) {
        try {
          const menteeRef = doc(db, 'users', currentUser.uid); // Use the current user's UID
          const menteeSnap = await getDoc(menteeRef);

          if (menteeSnap.exists()) {
            const menteeData = menteeSnap.data();
            // Split skills by comma and trim whitespace
            const skillsArray = menteeData.areasOfInterest ? menteeData.areasOfInterest.split(',').map(skill => skill.trim().toLowerCase()) : [];
            setMenteeSkills(skillsArray); // Update state with mentee skills
          } else {
            console.log('No such document for mentee!');
          }
        } catch (error) {
          console.error('Error fetching mentee skills:', error);
        }
      }
    };

    fetchMentors();
    fetchMenteeSkills();
  }, []); // No dependencies since we fetch `currentUser` directly from `auth`

  useEffect(() => {
    if (menteeSkills.length > 0) {
      const recommended = mentors.filter((mentor) => {
        const mentorSkills = mentor.skills.toLowerCase().split(',').map(skill => skill.trim());
        return menteeSkills.some(skill => mentorSkills.includes(skill)); // Check if any mentee skills match mentor skills
      });
      setRecommendedMentors(recommended);
    }
  }, [mentors, menteeSkills]);

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

  // Filtered Mentors based on search term for recommended mentors
  const filteredRecommendedMentors = recommendedMentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.mentorshipAreas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered Mentors based on search term for all mentors
  const filteredAllMentors = mentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.mentorshipAreas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-10 px-4">
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search Mentors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-700 bg-gray-900 text-white rounded-lg w-full max-w-md"
        />
      </div>

      {/* Recommended Mentors Section */}
      {filteredRecommendedMentors.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-center text-white mb-6">Recommended Mentors</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
            {filteredRecommendedMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} onBook={handleBook} />
            ))}
          </div>
        </>
      )}

      {/* All Mentors Section */}
      <h1 className="text-3xl font-bold text-center text-white mb-10">All Mentors</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAllMentors.length > 0 ? (
          filteredAllMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} onBook={handleBook} />
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
// import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; // Import updateDoc for Firestore updates
// import { useNavigate } from 'react-router-dom';
// import { FaStar, FaStarHalfAlt } from 'react-icons/fa'; // Import star icons for ratings


// // Star Rating Component
// function StarRating({ rating }) {
//   const fullStars = Math.floor(rating); // Number of full stars
//   const hasHalfStar = rating % 1 >= 0.5; // Check if there's a half star

//   return (
//     <div className="flex justify-center mt-2">
//       {[...Array(5)].map((_, index) => {
//         if (index < fullStars) {
//           return <FaStar key={index} size={20} color="#FFD700" />;
//         }
//         if (index === fullStars && hasHalfStar) {
//           return <FaStarHalfAlt key={index} size={20} color="#FFD700" />;
//         }
//         return <FaStar key={index} size={20} color="#ddd" />;
//       })}
//     </div>
//   );
// }



// function MentorCard({ mentor, onBook }) {
//   return (
//     <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white transition-transform transform hover:scale-105 duration-300">
//       {mentor.photo ? (
//         <div className="flex justify-center">
//           <img 
//             src={mentor.photo} 
//             alt={`${mentor.name}'s profile`} 
//             className="w-24 h-24 rounded-full mb-4 border-4 border-yellow-500"
//           />
//         </div>
//       ) : (
//         <div className="flex justify-center">
//           <div className="w-24 h-24 rounded-full mb-4 bg-gray-700 flex items-center justify-center text-gray-400 border-4 border-yellow-500">
//             No Photo
//           </div>
//         </div>
//       )}
//       <h3 className="text-2xl font-bold text-center mt-4">{mentor.name}</h3>
//       <p className="text-center text-gray-400">{mentor.experience} years of experience</p>
//       <p className="mt-2 text-gray-300 text-center">{mentor.bio}</p>
//       <p className="mt-2 text-gray-300 text-center"><strong>Skills:</strong> {mentor.skills}</p>
//       <p className="mt-2 text-gray-300 text-center"><strong>Mentorship Areas:</strong> {mentor.mentorshipAreas}</p>
//       <p className="mt-2 text-gray-300 text-center"><strong>Availability:</strong> {mentor.availability}</p>

//       {/* Star Rating Display */}
//       <StarRating rating={mentor.ratings} />

//       {/* Connect Button */}
//       <div className="flex justify-center mt-4">
//         <button
//           onClick={() => onBook(mentor)} 
//           className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-2 px-4 rounded-full transition-colors duration-300"
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
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMentors = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'mentors'));
//         const mentorList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log('Fetched mentors:', mentorList); // Log mentors to verify
//         setMentors(mentorList);
//       } catch (error) {
//         console.error('Error fetching mentors:', error);
//       }
//     };
//     fetchMentors();
//   }, []);

//   const handleBook = async (mentor) => {
//     if (mentor && mentor.id) {
//       try {
//         // Increment the view count in Firestore
//         const mentorRef = doc(db, 'mentors', mentor.id);
//         await updateDoc(mentorRef, {
//           views: (mentor.views || 0) + 1, // Increment the views count
//         });

//         // Navigate to the booking page
//         navigate(`/book/${mentor.id}`);
//       } catch (error) {
//         console.error('Error updating views count:', error);
//       }
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
//           filteredMentors.map((mentor) => (
//             <MentorCard key={mentor.id} mentor={mentor} onBook={handleBook} />
//           ))
//         ) : (
//           <p className="text-center text-gray-400 col-span-full">No mentors found</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Mentor;


