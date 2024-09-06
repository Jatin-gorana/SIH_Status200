import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebase/firebase'; // Import db for Firestore
import { doc, getDoc, query, collection, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { InlineWidget } from 'react-calendly';

function Book() {
  const { id } = useParams(); // Get the mentor's ID from the URL
  const [mentor, setMentor] = useState(null);
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [error, setError] = useState('');
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [reviewerName, setReviewerName] = useState(''); // State to store the logged-in user's name
  const [loading, setLoading] = useState(true); // State to handle loading

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
      } finally {
        setLoading(false); // Set loading to false after data fetching
      }
    };

    const fetchReviewerName = async () => {
      try {
        // Fetch the current user's name using the auth instance
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              setReviewerName(userDoc.data().name); // Set the reviewer's name
            }
          } else {
            setError('User not logged in.');
          }
        });

        // Cleanup the subscription
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchMentorDetails();
    fetchReviewerName(); // Fetch the reviewer's name
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!newReview || newRating < 1) {
      alert('Please provide a review and a rating of at least 1 star.');
      return;
    }

    try {
      // Update mentor document in Firestore with new review and rating
      const mentorRef = doc(db, 'mentors', id);

      await updateDoc(mentorRef, {
        reviews: arrayUnion({
          reviewerName, // Use the logged-in user's name
          review: newReview,
          rating: newRating
        }),
        ratings: ((mentor.ratings || 0) * (mentor.reviews?.length || 0) + newRating) / ((mentor.reviews?.length || 0) + 1)
      });

      // Clear the review form
      setNewReview('');
      setNewRating(0);

      // Refresh mentor data
      const updatedMentorDoc = await getDoc(mentorRef);
      if (updatedMentorDoc.exists()) {
        setMentor(updatedMentorDoc.data());
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

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
      
      {/* Ratings and Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Ratings & Reviews</h2>
        {mentor.reviews && mentor.reviews.length > 0 ? (
          mentor.reviews.map((review, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4">
              <p className="font-semibold">{review.reviewerName}</p>
              <p className="text-yellow-400">Rating: {review.rating} / 5</p>
              <p className="mt-2">{review.review}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to leave a review!</p>
        )}

        {/* Add a Review */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Leave a Review</h3>
          <textarea
            className="w-full p-2 bg-gray-800 text-white rounded mb-4"
            rows="4"
            placeholder="Write your review here..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <input
            type="number"
            min="1"
            max="5"
            className="w-full p-2 bg-gray-800 text-white rounded mb-4"
            placeholder="Rating (1 to 5)"
            value={newRating}
            onChange={(e) => setNewRating(Number(e.target.value))}
          />
          <button
            onClick={handleReviewSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default Book;















// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { db } from '../firebase/firebase';
// import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
// import { InlineWidget } from 'react-calendly';

// function Book() {
//   const { id } = useParams(); // Get the mentor's ID from the URL
//   const [mentor, setMentor] = useState(null);
//   const [calendlyUrl, setCalendlyUrl] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchMentorDetails = async () => {
//       try {
//         // Fetch mentor details
//         const mentorDoc = await getDoc(doc(db, 'mentors', id));
//         if (mentorDoc.exists()) {
//           const mentorData = mentorDoc.data();
//           setMentor(mentorData);

//           // Fetch Calendly URL from 'users' collection based on mentor's name
//           const userQuery = query(
//             collection(db, 'users'),
//             where('name', '==', mentorData.name),
//             where('role', '==', 'mentor')
//           );
//           const userDocs = await getDocs(userQuery);
//           if (!userDocs.empty) {
//             const userData = userDocs.docs[0].data();
//             setCalendlyUrl(userData.calendlyUrl); // Ensure 'calendlyUrl' field exists
//           } else {
//             setError('No matching user found or user is not a mentor');
//           }
//         } else {
//           setError('No such mentor document!');
//         }
//       } catch (error) {
//         setError('Error fetching data: ' + error.message);
//       }
//     };

//     fetchMentorDetails();
//   }, [id]);

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
//         <span className="text-lg">{error}</span>
//       </div>
//     );
//   }

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
//           {calendlyUrl ? (
//             <InlineWidget
//               url={calendlyUrl}
//               styles={{
//                 height: '600px',
//                 width: '90%',
//               }}
//             />
//           ) : (
//             <p className="text-lg">No Calendly URL available</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Book;








