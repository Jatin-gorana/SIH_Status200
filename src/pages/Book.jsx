import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { InlineWidget } from 'react-calendly';

function Book() {
  const { id } = useParams(); // Get the mentor's ID from the URL
  const [mentor, setMentor] = useState(null);
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        // Fetch mentor details
        const mentorDoc = await getDoc(doc(db, 'mentors', id));
        if (mentorDoc.exists()) {
          const mentorData = mentorDoc.data();
          setMentor(mentorData);

          // Fetch Calendly URL from 'users' collection based on mentor's name
          const userQuery = query(
            collection(db, 'users'),
            where('name', '==', mentorData.name),
            where('role', '==', 'mentor')
          );
          const userDocs = await getDocs(userQuery);
          if (!userDocs.empty) {
            const userData = userDocs.docs[0].data();
            setCalendlyUrl(userData.calendlyUrl); // Ensure 'calendlyUrl' field exists
          } else {
            setError('No matching user found or user is not a mentor');
          }
        } else {
          setError('No such mentor document!');
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      }
    };

    fetchMentorDetails();
  }, [id]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <span className="text-lg">{error}</span>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6 lg:p-12">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-4xl pb-3">
        Book Session with {mentor.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center text-center md:text-left">
          <img
            src={mentor.photo}
            alt={mentor.name}
            className="w-48 h-48 rounded-full mb-4 mx-auto md:mx-0 object-cover"
          />
          <h2 className="text-2xl font-semibold mb-2">{mentor.name}</h2>
          <p className="mb-2">{mentor.bio}</p>
          <p className="mb-2"><strong>Skills:</strong> {mentor.skills}</p>
          <p className="mb-2"><strong>Experience:</strong> {mentor.experience} years</p>
          <p className="mb-4"><strong>Mentorship Areas:</strong> {mentor.mentorshipAreas}</p>
        </div>
        <div className="flex flex-col items-center">
          {calendlyUrl ? (
            <InlineWidget
              url={calendlyUrl}
              styles={{
                height: '600px',
                width: '90%',
              }}
            />
          ) : (
            <p className="text-lg">No Calendly URL available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Book;









// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { db } from '../firebase/firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import { InlineWidget } from 'react-calendly';

// function Book() {
//   const { id } = useParams(); // Get the mentor's ID from the URL
//   const [mentor, setMentor] = useState(null);

//   useEffect(() => {
//     const fetchMentorDetails = async () => {
//       try {
//         const mentorDoc = await getDoc(doc(db, 'mentors', id));
//         if (mentorDoc.exists()) {
//           setMentor(mentorDoc.data());
//         } else {
//           console.error('No such document!');
//         }
//       } catch (error) {
//         console.error('Error fetching mentor details:', error);
//       }
//     };

//     fetchMentorDetails();
//   }, [id]);

//   if (!mentor) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
//         <span className="text-lg">Loading...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6 lg:p-12">
//       <h1 className="text-2xl font-bold mb-6 text-center md:text-4xl pb-3">
//         Book Session with {mentor.name}
//       </h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="flex flex-col items-center text-center md:text-left">
//           <img
//             src={mentor.photo}
//             alt={mentor.name}
//             className="w-48 h-48 rounded-full mb-4 mx-auto md:mx-0 object-cover"
//           />
//           <h2 className="text-2xl font-semibold mb-2">{mentor.name}</h2>
//           <p className="mb-2">{mentor.bio}</p>
//           <p className="mb-2"><strong>Skills:</strong> {mentor.skills}</p>
//           <p className="mb-2"><strong>Experience:</strong> {mentor.experience} years</p>
//           <p className="mb-4"><strong>Mentorship Areas:</strong> {mentor.mentorshipAreas}</p>
//         </div>
//         <div className="flex flex-col items-center">
//           {/* <h2 className="text-xl font-semibold mb-4">Schedule a Meeting</h2> */}
//           <InlineWidget
//             url="https://calendly.com/persacc9" // Replace with your Calendly URL
//             styles={{
//               height: '600px',
//               width: '90%',
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Book;









