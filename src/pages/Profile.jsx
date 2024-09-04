import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FaMedal } from 'react-icons/fa'; // Importing the medal icon
import { toast } from 'react-toastify'; // Optional: For better notifications
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [userType, setUserType] = useState('');
  const [calendlyURL, setCalendlyURL] = useState('');
  const [areasOfInterest, setAreasOfInterest] = useState('');
  const [sessionsCount, setSessionsCount] = useState(0);
  const [photoFile, setPhotoFile] = useState(null);
  const [badge, setBadge] = useState(null);
  // const [badgeTitle, setBadgeTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name || '');
          setEmail(userData.email || '');
          setPhotoURL(userData.photoURL || '');
          setUserType(userData.role || '');
          setCalendlyURL(userData.calendlyUrl || '');
          setAreasOfInterest(userData.areasOfInterest || '');
          setSessionsCount(userData.sessionsCount || 0);

          // Set badge based on sessions count
          assignBadge(userData.sessionsCount || 0);
        } else {
          setName('');
        }
      }
    };

    fetchUserData();
  }, []);

  const assignBadge = (sessions) => {
    if (sessions >= 10) {
      setBadge({ icon: <FaMedal color="#FFD700" size={40} />, title: 'Dedicated Achiever' }); // Gold
    } else if (sessions >= 6) {
      setBadge({ icon: <FaMedal color="#C0C0C0" size={40} />, title: 'Committed Learner' }); // Silver
    } else if (sessions >= 0) {
      setBadge({ icon: <FaMedal color="#CD7F32" size={40} />, title: 'Engaged Starter' }); // Bronze
    } else {
      setBadge(null);
    }
  };

  const handleNameChange = (e) => setName(e.target.value);
  const handleAreasOfInterestChange = (e) => setAreasOfInterest(e.target.value);
  const handleCalendlyURLChange = (e) => setCalendlyURL(e.target.value);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    if (file) {
      setPhotoURL(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      let uploadedPhotoURL = photoURL;

      if (photoFile) {
        const storageRef = ref(storage, `profile_photos/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, photoFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => reject(error),
            async () => {
              uploadedPhotoURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      await updateProfile(user, {
        displayName: name,
        photoURL: uploadedPhotoURL,
      });

      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        name,
        photoURL: uploadedPhotoURL,
        calendlyUrl: calendlyURL,
        areasOfInterest,
      });

      // Reassign badge in case sessions count has changed elsewhere
      assignBadge(sessionsCount);

      toast.success('Profile updated successfully!');
      // navigate('/'); // Optional: Redirect after update
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen p-5 flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-800 shadow-md rounded-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Your Profile</h2>

        {photoURL && (
          <div className="flex justify-center mb-6">
            <img
              src={photoURL}
              alt="Profile"
              className="h-24 w-24 rounded-full border-4 border-blue-500 object-cover"
            />
          </div>
        )}

        {userType==='mentee' &&(
          <>
        {badge && (
                        <div className="flex items-center justify-center mb-6">
                          {badge.icon}
                          <span className="ml-3 text-xl text-white font-semibold">{badge.title}</span>
                        </div>
                      )}
            </>
        )}

        
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleNameChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-400 rounded-md cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="photoURL" className="block text-sm font-medium text-gray-300">
              Profile Photo
            </label>
            <input
              type="file"
              id="photoURL"
              name="photoURL"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mt-1 block w-full text-gray-300"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="userType" className="block text-sm font-medium text-gray-300">
              User Type
            </label>
            <input
              type="text"
              id="userType"
              name="userType"
              value={userType}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-400 rounded-md cursor-not-allowed"
            />
          </div>

          {userType === 'mentee' && (
            <>
              <div className="mb-4">
                <label htmlFor="areasOfInterest" className="block text-sm font-medium text-gray-300">
                  Areas of Interest
                </label>
                <input
                  type="text"
                  id="areasOfInterest"
                  name="areasOfInterest"
                  value={areasOfInterest}
                  onChange={handleAreasOfInterestChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Web Development, Data Science"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="sessionsCount" className="block text-sm font-medium text-gray-300">
                  Sessions Attended
                </label>
                <input
                  type="number"
                  id="sessionsCount"
                  name="sessionsCount"
                  value={sessionsCount}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-400 rounded-md cursor-not-allowed"
                />
              </div>

              
            </>
          )}

          {userType === 'mentor' && (
            <div className="mb-4">
              <label htmlFor="calendlyURL" className="block text-sm font-medium text-gray-300">
                Calendly URL
              </label>
              <input
                type="url"
                id="calendlyURL"
                name="calendlyURL"
                value={calendlyURL}
                onChange={handleCalendlyURLChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://calendly.com/your-link"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Profile
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="text-red-400 hover:underline focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth } from '../firebase/firebase';
// import { updateProfile } from 'firebase/auth';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db, storage } from '../firebase/firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// const Profile = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [photoURL, setPhotoURL] = useState('');
//   const [userType, setUserType] = useState('');
//   const [calendlyURL, setCalendlyURL] = useState('');
//   const [areasOfInterest, setAreasOfInterest] = useState(''); // For handling mentee's areas of interest
//   const [sessionsCount, setSessionsCount] = useState(0); // For displaying total sessions registered
//   const [photoFile, setPhotoFile] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = auth.currentUser;

//       if (user) {
//         const docRef = doc(db, 'users', user.uid);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const userData = docSnap.data();
//           setName(userData.name || '');
//           setEmail(userData.email || '');
//           setPhotoURL(userData.photoURL || '');
//           setUserType(userData.role || '');
//           setCalendlyURL(userData.calendlyUrl || '');
//           setAreasOfInterest(userData.areasOfInterest || ''); // Fetch areas of interest
//           setSessionsCount(userData.sessionsCount || 0); // Fetch total sessions registered
//         } else {
//           setName('');
//         }
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleNameChange = (e) => setName(e.target.value);
//   const handleAreasOfInterestChange = (e) => setAreasOfInterest(e.target.value); // Handle areas of interest change
//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     setPhotoFile(file);
//     if (file) {
//       setPhotoURL(URL.createObjectURL(file));
//     }
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     try {
//       let uploadedPhotoURL = photoURL;
//       if (photoFile) {
//         const storageRef = ref(storage, `profile_photos/${auth.currentUser.uid}`);
//         const uploadTask = uploadBytesResumable(storageRef, photoFile);

//         await new Promise((resolve, reject) => {
//           uploadTask.on(
//             'state_changed',
//             null,
//             (error) => reject(error),
//             async () => {
//               try {
//                 uploadedPhotoURL = await getDownloadURL(uploadTask.snapshot.ref);
//                 resolve();
//               } catch (error) {
//                 reject(error);
//               }
//             }
//           );
//         });
//       }

//       await updateProfile(auth.currentUser, {
//         displayName: name,
//         photoURL: uploadedPhotoURL,
//       });

//       const docRef = doc(db, 'users', auth.currentUser.uid);
//       await updateDoc(docRef, {
//         name,
//         photoURL: uploadedPhotoURL,
//         calendlyUrl: calendlyURL,
//         areasOfInterest, // Update areas of interest
//         sessionsCount, // Ensure sessions count is updated in Firestore
//       });

//       alert('Profile updated successfully!');
//       navigate('/');
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert(error.message);
//     }
//   };

//   const handleLogout = () => {
//     auth.signOut();
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen p-5 flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
//       <div className="w-full max-w-md p-6 bg-gray-800 shadow-md rounded-md">
//         <h2 className="text-2xl font-bold mb-6 text-center text-white">Profile</h2>
//         <form onSubmit={handleUpdateProfile}>
//           <div className="mb-4">
//             <label htmlFor="name" className="block text-sm font-medium text-gray-300">
//               Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={name}
//               onChange={handleNameChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="Enter your name"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-300">
//               Email
//             </label>
//             <input
//               type="text"
//               id="email"
//               name="email"
//               value={email}
//               disabled
//               className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="Your email"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="photoURL" className="block text-sm font-medium text-gray-300">
//               Photo
//             </label>
//             <input
//               type="file"
//               id="photoURL"
//               name="photoURL"
//               onChange={handlePhotoChange}
//               className="mt-1 block w-full text-white"
//             />
//             {photoURL && typeof photoURL === 'string' && (
//               <img src={photoURL} alt="Profile" className="mt-2 h-20 w-20 rounded-full" />
//             )}
//           </div>
//           <div className="mb-4">
//             <label htmlFor="userType" className="block text-sm font-medium text-gray-300">
//               User Type
//             </label>
//             <input
//               type="text"
//               id="userType"
//               name="userType"
//               value={userType}
//               readOnly
//               className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm sm:text-sm"
//             />
//           </div>
//           {userType === 'mentee' && (
//             <>
//               <div className="mb-4">
//                 <label htmlFor="areasOfInterest" className="block text-sm font-medium text-gray-300">
//                   Areas of Interest
//                 </label>
//                 <input
//                   type="text"
//                   id="areasOfInterest"
//                   name="areasOfInterest"
//                   value={areasOfInterest}
//                   onChange={handleAreasOfInterestChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   placeholder="Enter your areas of interest"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="sessionsCount" className="block text-sm font-medium text-gray-300">
//                   Total Sessions Registered
//                 </label>
//                 <input
//                   type="text"
//                   id="sessionsCount"
//                   name="sessionsCount"
//                   value={sessionsCount}
//                   readOnly
//                   className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm sm:text-sm"
//                 />
//               </div>
//             </>
//           )}
//           {userType === 'mentor' && (
//             <div className="mb-4">
//               <label htmlFor="calendlyURL" className="block text-sm font-medium text-gray-300">
//                 Calendly URL
//               </label>
//               <input
//                 type="text"
//                 id="calendlyURL"
//                 name="calendlyURL"
//                 value={calendlyURL}
//                 readOnly
//                 className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               />
//             </div>
//           )}
//           <button
//             type="submit"
//             className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             Update Profile
//           </button>
//         </form>
//         <div className="mt-6 text-center">
//           <button
//             onClick={handleLogout}
//             className="text-red-400 hover:underline"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

























// // src/pages/Profile.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth } from '../firebase/firebase';
// import { updateProfile } from 'firebase/auth';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db, storage } from '../firebase/firebase'; // Ensure this import matches your Firebase setup
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// const Profile = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [photoURL, setPhotoURL] = useState('');
//   const [userType, setUserType] = useState('');
//   const [calendlyURL, setCalendlyURL] = useState('');
//   const [photoFile, setPhotoFile] = useState(null); // For handling photo file
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = auth.currentUser;

//       if (user) {
//         const docRef = doc(db, 'users', user.uid);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const userData = docSnap.data();
//           setName(userData.name || '');
//           setEmail(userData.email || '');
//           setPhotoURL(userData.photoURL || '');
//           setUserType(userData.role || '');
//           setCalendlyURL(userData.calendlyUrl || ''); // Fetch calendlyUrl from Firestore
//         } else {
//           // If document doesn't exist, let the user enter their name
//           setName('');
//         }
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleNameChange = (e) => setName(e.target.value);
//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     setPhotoFile(file);
//     if (file) {
//       setPhotoURL(URL.createObjectURL(file)); // For immediate preview
//     }
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     try {
//       // Handle photo upload if there's a file
//       let uploadedPhotoURL = photoURL;
//       if (photoFile) {
//         const storageRef = ref(storage, `profile_photos/${auth.currentUser.uid}`);
//         const uploadTask = uploadBytesResumable(storageRef, photoFile);

//         await new Promise((resolve, reject) => {
//           uploadTask.on(
//             'state_changed',
//             null,
//             (error) => reject(error),
//             async () => {
//               try {
//                 uploadedPhotoURL = await getDownloadURL(uploadTask.snapshot.ref);
//                 resolve();
//               } catch (error) {
//                 reject(error);
//               }
//             }
//           );
//         });
//       }

//       await updateProfile(auth.currentUser, {
//         displayName: name,
//         photoURL: uploadedPhotoURL,
//       });

//       // Update Firestore
//       const docRef = doc(db, 'users', auth.currentUser.uid);
//       await updateDoc(docRef, {
//         name,
//         photoURL: uploadedPhotoURL,
//         calendlyUrl: calendlyURL, // Update calendlyUrl in Firestore
//       });

//       alert('Profile updated successfully!');
//       navigate('/');
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert(error.message);
//     }
//   };

//   const handleLogout = () => {
//     auth.signOut();
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen p-5 flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
//       <div className="w-full max-w-md p-6 bg-gray-800 shadow-md rounded-md">
//         <h2 className="text-2xl font-bold mb-6 text-center text-white">Profile</h2>
//         <form onSubmit={handleUpdateProfile}>
//           <div className="mb-4">
//             <label htmlFor="name" className="block text-sm font-medium text-gray-300">
//               Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={name}
//               onChange={handleNameChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="Enter your name"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-300">
//               Email
//             </label>
//             <input
//               type="text"
//               id="email"
//               name="email"
//               value={email}
//               disabled
//               className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="Your email"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="photoURL" className="block text-sm font-medium text-gray-300">
//               Photo
//             </label>
//             <input
//               type="file"
//               id="photoURL"
//               name="photoURL"
//               onChange={handlePhotoChange}
//               className="mt-1 block w-full text-white"
//             />
//             {photoURL && typeof photoURL === 'string' && (
//               <img src={photoURL} alt="Profile" className="mt-2 h-20 w-20 rounded-full" />
//             )}
//           </div>
//           <div className="mb-4">
//             <label htmlFor="userType" className="block text-sm font-medium text-gray-300">
//               User Type
//             </label>
//             <input
//               type="text"
//               id="userType"
//               name="userType"
//               value={userType}
//               readOnly
//               className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm sm:text-sm"
//             />
//           </div>
//           {userType === 'mentor' && (
//             <div className="mb-4">
//               <label htmlFor="calendlyURL" className="block text-sm font-medium text-gray-300">
//                 Calendly URL
//               </label>
//               <input
//                 type="text"
//                 id="calendlyURL"
//                 name="calendlyURL"
//                 value={calendlyURL}
//                 readOnly
//                 // onChange={(e) => setCalendlyURL(e.target.value)}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 // placeholder="Enter your Calendly URL"
//               />
//             </div>
//           )}
//           <button
//             type="submit"
//             className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             Update Profile
//           </button>
//         </form>
//         <div className="mt-6 text-center">
//           <button
//             onClick={handleLogout}
//             className="text-red-400 hover:underline"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;













