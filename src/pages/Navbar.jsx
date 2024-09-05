import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { FaUserCircle } from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../assets/logo.jpg';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [isOpen, setIsOpen] = useState(false); // State to handle mobile menu toggle
  // const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Fetch user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role); // Assume 'role' field contains 'mentor' or 'mentee'
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check if user signed in through Google
  const isGoogleSignIn = user?.providerData.some((provider) => provider.providerId === 'google.com');

  // const handleSignOut = async () => {
  //   try {
  //     await signOut(auth);
  //     navigate('/login');
  //   } catch (error) {
  //     console.error('Error signing out:', error);
  //   }
  // };

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
       <Link to="/">
        <img src={logo} alt="" width="250px" height="160px" />
        </Link>
        {/* <Link to="/" className="text-3xl font-bold">
          MentorConnect
        </Link> */}
        <div className="hidden md:flex space-x-6 text-xl font-medium">
          {/* Common link for all users */}
          <Link to="/" className="hover:text-gray-400 hover:scale-105 transition duration-300 pt-1">
            Home
          </Link>
          {/* Conditionally render links based on user role */}
          {userRole === 'mentee' && (
            <>
              <Link to="/mentee" className="hover:text-gray-400 hover:scale-105 transition duration-300 pt-1">
                Discover
              </Link>
              <Link to="/contact" className="hover:text-gray-400 hover:scale-105 transition duration-300 pt-1">
                Contact Us
              </Link>
            </>
          )}
          {userRole === 'mentor' && (
            <>
              <Link to="/mentor" className="hover:text-gray-400 hover:scale-105 transition duration-300 pt-1">
                Guide
              </Link>
              <Link to="/dashboard" className="hover:text-gray-400 hover:scale-105 transition duration-300 pt-1">
                Dashboard
              </Link>
              {/* <Link to="/help" className="hover:text-gray-400 hover:scale-105 transition duration-300 pt-1">
                Help
              </Link> */}
            </>
          )}
          {/* Profile and Logout */}
          {user ? (
            <>
              <Link to="/profile" className="flex items-center space-x-2">
                {isGoogleSignIn ? (
                  <img
                    src={user.photoURL || '/default-profile.png'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                ) : (
                  <FaUserCircle className="w-10 h-10 cursor-pointer text-gray-600" />
                )}
              </Link>
              {/* <button
                onClick={handleSignOut}
                className="bg-yellow-500 text-black py-2 px-3 text-base rounded-lg hover:bg-yellow-400 transition duration-300 hover:scale-90"
              >
                Logout
              </button> */}
            </>
          ) : (
            <Link to="/login" className="bg-yellow-500 text-black py-2 px-3 text-base rounded-lg hover:bg-yellow-400 transition duration-300 hover:scale-90">
              Sign Up
            </Link>
          )}
        </div>
        <button 
          onClick={toggleMenu}
          className="md:hidden text-2xl focus:outline-none"
        >
          <i className={`fa ${isOpen ? 'fa-times' : 'fa-bars'}`} />
        </button>
      </div>
      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-gray-800`}>
        <Link 
          to="/" 
          className="block px-4 py-2 hover:bg-gray-700"
          onClick={toggleMenu}
        >
          Home
        </Link>
        {userRole === 'mentee' && (
          <>
            <Link 
              to="/mentee" 
              className="block px-4 py-2 hover:bg-gray-700"
              onClick={toggleMenu}
            >
              Discover
            </Link>
            <Link 
              to="/contact" 
              className="block px-4 py-2 hover:bg-gray-700"
              onClick={toggleMenu}
            >
              Contact Us
            </Link>
          </>
        )}
        {userRole === 'mentor' && (
          <>
            <Link 
              to="/mentor" 
              className="block px-4 py-2 hover:bg-gray-700"
              onClick={toggleMenu}
            >
              Guide
            </Link>
            <Link 
              to="/dashboard" 
              className="block px-4 py-2 hover:bg-gray-700"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            {/* <Link 
              to="/help" 
              className="block px-4 py-2 hover:bg-gray-700"
              onClick={toggleMenu}
            >
              Help
            </Link> */}
          </>
        )}
        {user ? (
          <>
            <Link 
              to="/profile"
              className="block px-4 py-2 hover:bg-gray-700 flex items-center"
              onClick={toggleMenu}
            >
              {isGoogleSignIn ? (
                <img
                  src={user.photoURL || '/default-profile.png'}
                  alt="Profile"
                  className="w-6 h-6 rounded-full mr-2"
                />
              ) : (
                <FaUserCircle className="w-6 h-6 mr-2" />
              )}
              <span>Profile</span>
            </Link>
            {/* <button
              onClick={handleSignOut}
              className="block w-full px-4 py-2 text-left hover:bg-yellow-400 text-black"
            >
              Logout
            </button> */}
          </>
        ) : (
          <Link 
            to="/login" 
            className="block px-4 py-2 bg-yellow-500 text-black text-center rounded-lg hover:bg-yellow-400 transition duration-300 hover:scale-90"
            onClick={toggleMenu}
          >
            Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;















// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { auth } from '../firebase/firebase';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { FaUserCircle } from 'react-icons/fa';

// const Navbar = () => {
//   const [user, setUser] = useState(null);
//   const [isOpen, setIsOpen] = useState(false); // State to handle mobile menu toggle
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   // Check if user signed in through Google
//   const isGoogleSignIn = user?.providerData.some((provider) => provider.providerId === 'google.com');

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       navigate('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   return (
//     <nav className="bg-black text-white p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-3xl font-bold">
//           MentorWave
//         </Link>
//         <div className="hidden md:flex space-x-6 text-xl font-medium">
//           <Link to="/mentor" className="hover:text-gray-400 hover:scale-105 transition duration-300 pt-1">
//             Guide
//           </Link>
//           <Link to="/mentee" className="hover:text-gray-400 hover:scale-105 transition duration-300 pt-1">
//             Discover
//           </Link>
//           {user ? (
//             <>
//               <Link to="/profile" className="flex items-center space-x-2">
//                 {isGoogleSignIn ? (
//                   <img
//                     src={user.photoURL || '/default-profile.png'}
//                     alt="Profile"
//                     className="w-10 h-10 rounded-full cursor-pointer"
//                   />
//                 ) : (
//                   <FaUserCircle
//                     className="w-10 h-10 cursor-pointer text-gray-600"
//                   />
//                 )}
//               </Link>
//               <button
//                 onClick={handleSignOut}
//                 className="bg-yellow-500 text-black py-2 px-3 text-base rounded-lg hover:bg-yellow-400 transition duration-300 hover:scale-90"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link to="/login" className="bg-yellow-500 text-black py-2 px-3 text-base rounded-lg hover:bg-yellow-400 transition duration-300 hover:scale-90">
//               Sign Up
//             </Link>
//           )}
//         </div>
//         <button 
//           onClick={toggleMenu}
//           className="md:hidden text-2xl focus:outline-none"
//         >
//           <i className={`fa ${isOpen ? 'fa-times' : 'fa-bars'}`} />
//         </button>
//       </div>
//       {/* Mobile Menu */}
//       <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-gray-800`}>
//         <Link 
//           to="/mentor" 
//           className="block px-4 py-2 hover:bg-gray-700"
//           onClick={toggleMenu}
//         >
//           Guide
//         </Link>
//         <Link 
//           to="/mentee" 
//           className="block px-4 py-2 hover:bg-gray-700"
//           onClick={toggleMenu}
//         >
//           Discover
//         </Link>
//         {user ? (
//           <>
//             <Link 
//               to="/profile"
//               className="block px-4 py-2 hover:bg-gray-700 flex items-center"
//               onClick={toggleMenu}
//             >
//               {isGoogleSignIn ? (
//                 <img
//                   src={user.photoURL || '/default-profile.png'}
//                   alt="Profile"
//                   className="w-6 h-6 rounded-full mr-2"
//                 />
//               ) : (
//                 <FaUserCircle
//                   className="w-6 h-6 mr-2"
//                 />
//               )}
//               <span>Profile</span>
//             </Link>
//             <button
//               onClick={handleSignOut}
//               className="block w-full px-4 py-2 text-left hover:bg-yellow-400 text-black"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <Link 
//             to="/login" 
//             className="block px-4 py-2 bg-yellow-500 text-black text-center rounded-lg hover:bg-yellow-400 transition duration-300 hover:scale-90"
//             onClick={toggleMenu}
//           >
//             Sign Up
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




