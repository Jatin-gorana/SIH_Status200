import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase/firebase'; // Import db for Firestore
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('mentee');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [isCalendlyUrlProvided, setIsCalendlyUrlProvided] = useState(false);

  const navigate = useNavigate();

  const handleRoleChange = (e) => setRole(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleCalendlyUrlChange = (e) => {
    setCalendlyUrl(e.target.value);
    setIsCalendlyUrlProvided(e.target.value.trim() !== '');
  };

  const notifySuccess = (message) => {
    toast.success(message, {
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const notifyError = (message) => {
    toast.error(message, {
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, 'users', user.uid); // Reference to Firestore document
    const userData = {
      name: user.displayName || name,
      email: user.email,
      role: role,
      calendlyUrl: role === 'mentor' ? calendlyUrl : '',
    };

    try {
      await setDoc(userRef, userData);
      notifySuccess('User data saved successfully!');
    } catch (error) {
      console.error('Error saving user data:', error);
      notifyError('Failed to save user data.');
    }
  };

  const fetchUserRoleFromFirestore = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      setRole(userData.role || 'mentee'); // Set role to fetched value or default to 'mentee'
    } else {
      console.log('No such document!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === 'mentor' && !isCalendlyUrlProvided) {
      notifyError('Please provide your Calendly URL after signing in on Calendly.');
      return;
    }

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        notifySuccess('Login successful!');

        // Fetch user role from Firestore after login
        const user = userCredential.user;
        await fetchUserRoleFromFirestore(user.uid);

      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        notifySuccess(`Account created successfully as a ${role}!`);

        const user = userCredential.user;
        await saveUserToFirestore(user);
      }

      navigate('/'); // Redirect to home page after login/signup
    } catch (error) {
      console.error('Error during authentication:', error);
      notifyError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (role === 'mentor' && !isCalendlyUrlProvided) {
        notifyError('Please provide your Calendly URL to continue as a mentor.');
      } else {
        await saveUserToFirestore(user);
        notifySuccess('Signed in with Google successfully!');
        navigate('/'); // Redirect to home page after successful Google sign-in
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      notifyError(error.message);
    }
  };

  return (
    <div className="min-h-screen p-5 flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-800 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
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
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your name"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                I want to become a:
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={handleRoleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="mentee">Mentee</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>
          )}

          {/* Calendly URL input for mentors */}
          {!isLogin && role === 'mentor' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                To schedule meetings, sign in on Calendly and provide your Calendly URL below.
              </label>
              <button
                type="button"
                onClick={() => window.open('https://calendly.com/signup', '_blank')}
                className="mb-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in on Calendly
              </button>


              <input
                type="url"
                id="calendlyUrl"
                name="calendlyUrl"
                value={calendlyUrl}
                onChange={handleCalendlyUrlChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your Calendly URL"
              />
              <br />
              
              <button
                type="button"
                onClick={()=> navigate('/help')}
                className="mb-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Don't Know how to use Calendly?
              </button>


            </div>

            
          )}

          <div className="mb-6">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </div>
        </form>
        <p className="text-center text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:text-blue-400 focus:outline-none ml-1"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign in with Google
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginSignUp;














// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth, googleProvider, db } from '../firebase/firebase'; // Import db for Firestore
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup
// } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const LoginSignUp = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [role, setRole] = useState('mentee');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [calendlyUrl, setCalendlyUrl] = useState('');
//   const [isCalendlyUrlProvided, setIsCalendlyUrlProvided] = useState(false);

//   const navigate = useNavigate();

//   const handleRoleChange = (e) => setRole(e.target.value);
//   const handleNameChange = (e) => setName(e.target.value);
//   const handleEmailChange = (e) => setEmail(e.target.value);
//   const handlePasswordChange = (e) => setPassword(e.target.value);
//   const handleCalendlyUrlChange = (e) => {
//     setCalendlyUrl(e.target.value);
//     setIsCalendlyUrlProvided(e.target.value.trim() !== '');
//   };

//   const notifySuccess = (message) => {
//     toast.success(message, {
//       position: "bottom-left",
//       autoClose: 3000,
//       hideProgressBar: true,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "colored",
//     });
//   };

//   const notifyError = (message) => {
//     toast.error(message, {
//       position: "bottom-left",
//       autoClose: 3000,
//       hideProgressBar: true,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "colored",
//     });
//   };

//   const saveUserToFirestore = async (user) => {
//     const userRef = doc(db, 'users', user.uid); // Reference to Firestore document
//     const userData = {
//       name: user.displayName || name,
//       email: user.email,
//       role: role,
//       calendlyUrl: role === 'mentor' ? calendlyUrl : '',
//     };

//     try {
//       await setDoc(userRef, userData);
//       notifySuccess('User data saved successfully!');
//     } catch (error) {
//       console.error('Error saving user data:', error);
//       notifyError('Failed to save user data.');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (role === 'mentor' && !isCalendlyUrlProvided) {
//       notifyError('Please provide your Calendly URL after signing in on Calendly.');
//       return;
//     }

//     try {
//       let userCredential;
//       if (isLogin) {
//         userCredential = await signInWithEmailAndPassword(auth, email, password);
//         notifySuccess('Login successful!');
//       } else {
//         userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         notifySuccess(`Account created successfully as a ${role}!`);
//       }

//       const user = userCredential.user;
//       await saveUserToFirestore(user);
//       navigate('/'); // Redirect to home page after login/signup
//     } catch (error) {
//       console.error('Error during authentication:', error);
//       notifyError(error.message);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;

//       if (role === 'mentor' && !isCalendlyUrlProvided) {
//         notifyError('Please provide your Calendly URL to continue as a mentor.');
//       } else {
//         await saveUserToFirestore(user);
//         notifySuccess('Signed in with Google successfully!');
//         navigate('/'); // Redirect to home page after successful Google sign-in
//       }
//     } catch (error) {
//       console.error('Error during Google sign-in:', error);
//       notifyError(error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen p-5 flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
//       <div className="w-full max-w-md p-6 bg-gray-800 shadow-md rounded-md">
//         <h2 className="text-2xl font-bold mb-6 text-center text-white">
//           {isLogin ? 'Login' : 'Sign Up'}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           {!isLogin && (
//             <div className="mb-4">
//               <label htmlFor="name" className="block text-sm font-medium text-gray-300">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={name}
//                 onChange={handleNameChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 placeholder="Enter your name"
//                 required
//               />
//             </div>
//           )}
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-300">
//               Email address
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={email}
//               onChange={handleEmailChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="Enter your email"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={password}
//               onChange={handlePasswordChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           {!isLogin && (
//             <div className="mb-4">
//               <label htmlFor="role" className="block text-sm font-medium text-gray-300">
//                 I want to become a:
//               </label>
//               <select
//                 id="role"
//                 name="role"
//                 value={role}
//                 onChange={handleRoleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               >
//                 <option value="mentee">Mentee</option>
//                 <option value="mentor">Mentor</option>
//               </select>
//             </div>
//           )}

//           {/* Calendly URL input for mentors */}
//           {!isLogin && role === 'mentor' && (
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 To schedule meetings, sign in on Calendly and provide your Calendly URL below.
//               </label>
//               <button
//                 type="button"
//                 onClick={() => window.open('https://calendly.com/signup', '_blank')}
//                 className="mb-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Sign in on Calendly
//               </button>
//               <div className="mb-4">
//                 <label htmlFor="calendlyUrl" className="block text-sm font-medium text-gray-300">
//                   Your Calendly URL
//                 </label>
//                 <input
//                   type="url"
//                   id="calendlyUrl"
//                   name="calendlyUrl"
//                   value={calendlyUrl}
//                   onChange={handleCalendlyUrlChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   placeholder="Enter your Calendly URL"
//                 />
//               </div>
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           >
//             {isLogin ? 'Login' : 'Sign Up'}
//           </button>
//         </form>

//         <div className="mt-4">
//           {isLogin ? (
//             <p className="text-center text-gray-300">
//               Don't have an account?{' '}
//               <span className="text-blue-500 cursor-pointer" onClick={() => setIsLogin(false)}>
//                 Sign up
//               </span>
//             </p>
//           ) : (
//             <p className="text-center text-gray-300">
//               Already have an account?{' '}
//               <span className="text-blue-500 cursor-pointer" onClick={() => setIsLogin(true)}>
//                 Log in
//               </span>
//               <br />
//               <br />
//               <p className='text-2xl'>OR</p>
//             </p>
//           )}
//         </div>

//         <div className="mt-4">
//           <button
//             type="button"
//             className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//             onClick={handleGoogleSignIn}
//           >
//             Sign In with Google
//           </button>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default LoginSignUp;










// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth, googleProvider } from '../firebase/firebase';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';

// const LoginSignUp = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [role, setRole] = useState('mentee');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [calendlyUrl, setCalendlyUrl] = useState('');
//   const [isCalendlySignedIn, setIsCalendlySignedIn] = useState(false); // New state to check if mentor has signed in Calendly

//   const navigate = useNavigate();

//   const handleRoleChange = (e) => setRole(e.target.value);
//   const handleNameChange = (e) => setName(e.target.value);
//   const handleEmailChange = (e) => setEmail(e.target.value);
//   const handlePasswordChange = (e) => setPassword(e.target.value);
//   const handleCalendlyUrlChange = (e) => setCalendlyUrl(e.target.value);

//   const notifySuccess = (message) => {
//     toast.success(message, {
//       position: "bottom-left",
//       autoClose: 3000,
//       hideProgressBar: true,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "colored",
//     });
//   };

//   const notifyError = (message) => {
//     toast.error(message, {
//       position: "bottom-left",
//       autoClose: 3000,
//       hideProgressBar: true,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "colored",
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (role === 'mentor' && !isCalendlySignedIn) {
//       notifyError('Please sign in with Calendly and enter your Calendly URL.');
//       return;
//     }

//     try {
//       if (isLogin) {
//         await signInWithEmailAndPassword(auth, email, password);
//         notifySuccess('Login successful!');
//       } else {
//         await createUserWithEmailAndPassword(auth, email, password);
//         notifySuccess(`Account created successfully as a ${role}!`);
//       }

//       // Get Calendly URL if role is mentor
//       const user = auth.currentUser;
//       if (user) {
//         const token = await user.getIdToken();
//         const response = await axios.post('http://localhost:5000/auth/calendly', { token });
//         const calendlyUrl = response.data.url;

//         // Save Calendly URL to local storage or context
//         localStorage.setItem('calendlyUrl', calendlyUrl);

//         // Redirect to home page or a page with Calendly embedded
//         setTimeout(() => {
//           navigate('/');
//         }, 1000);
//       }
//     } catch (error) {
//       console.error('Error during authentication:', error);
//       notifyError(error.message);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;
//       notifySuccess('Signed in with Google successfully!');

//       // Get Calendly URL
//       const token = await user.getIdToken();
//       const response = await axios.post('http://localhost:5000/auth/calendly', { token });
//       const calendlyUrl = response.data.url;

//       // Save Calendly URL to local storage or context
//       localStorage.setItem('calendlyUrl', calendlyUrl);

//       // Delay navigation to ensure alert is shown
//       setTimeout(() => {
//         navigate('/');
//       }, 1000);
//     } catch (error) {
//       console.error('Error during Google sign-in:', error);
//       notifyError(error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen p-5 flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
//       <div className="w-full max-w-md p-6 bg-gray-800 shadow-md rounded-md">
//         <h2 className="text-2xl font-bold mb-6 text-center text-white">
//           {isLogin ? 'Login' : 'Sign Up'}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           {!isLogin && (
//             <div className="mb-4">
//               <label htmlFor="name" className="block text-sm font-medium text-gray-300">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={name}
//                 onChange={handleNameChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 placeholder="Enter your name"
//                 required
//               />
//             </div>
//           )}
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-300">
//               Email address
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={email}
//               onChange={handleEmailChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="Enter your email"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={password}
//               onChange={handlePasswordChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           {!isLogin && (
//             <div className="mb-4">
//               <label htmlFor="role" className="block text-sm font-medium text-gray-300">
//                 I want to become a:
//               </label>
//               <select
//                 id="role"
//                 name="role"
//                 value={role}
//                 onChange={handleRoleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               >
//                 <option value="mentee">Mentee</option>
//                 <option value="mentor">Mentor</option>
//               </select>
//             </div>
//           )}

//           {/* Conditionally render Calendly embed and URL input for mentors */}
//           {!isLogin && role === 'mentor' && (
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Calendly Sign In
//               </label>
//               {/* Calendly Embed */}
//               <div className="mb-4">
//                 <iframe
//                   src="https://calendly.com/signup"
//                   title="Calendly Sign In"
//                   width="100%"
//                   height="500"
//                   frameBorder="0"
//                   className="rounded-md border border-gray-600"
//                   onLoad={() => setIsCalendlySignedIn(true)} // Set to true once Calendly is loaded
//                 ></iframe>
//               </div>
//               {/* Calendly URL Input */}
//               <div className="mb-4">
//                 <label htmlFor="calendlyUrl" className="block text-sm font-medium text-gray-300">
//                   Your Calendly URL
//                 </label>
//                 <input
//                   type="url"
//                   id="calendlyUrl"
//                   name="calendlyUrl"
//                   value={calendlyUrl}
//                   onChange={handleCalendlyUrlChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   placeholder="Enter your Calendly URL"
//                   required
//                 />
//               </div>
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           >
//             {isLogin ? 'Login' : 'Sign Up'}
//           </button>
//         </form>

//         <div className="mt-6 text-center text-gray-400">
//           {isLogin ? (
//             <p>
//               Don't have an account?{' '}
//               <span className="text-blue-500 cursor-pointer" onClick={() => setIsLogin(false)}>
//                 Sign up
//               </span>
//             </p>
//           ) : (
//             <p>
//               Already have an account?{' '}
//               <span className="text-blue-500 cursor-pointer" onClick={() => setIsLogin(true)}>
//                 Login
//               </span>
//             </p>
//           )}
//         </div>
//         <div className="mt-4">
//           <button
//             className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//             onClick={handleGoogleSignIn}
//           >
//             Sign In with Google
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginSignUp;













// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth, googleProvider } from '../firebase/firebase';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';

// const LoginSignUp = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [role, setRole] = useState('mentee');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleRoleChange = (e) => setRole(e.target.value);
//   const handleNameChange = (e) => setName(e.target.value);
//   const handleEmailChange = (e) => setEmail(e.target.value);
//   const handlePasswordChange = (e) => setPassword(e.target.value);

//   const notifySuccess = (message) => {
//     toast.success(message, {
//       position: "bottom-left",
//       autoClose: 3000,
//       hideProgressBar: true,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "colored",
//     });
//   };

//   const notifyError = (message) => {
//     toast.error(message, {
//       position: "bottom-left",
//       autoClose: 3000,
//       hideProgressBar: true,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "colored",
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (isLogin) {
//         await signInWithEmailAndPassword(auth, email, password);
//         notifySuccess('Login successful!');
//       } else {
//         await createUserWithEmailAndPassword(auth, email, password);
//         notifySuccess(`Account created successfully as a ${role}!`);
//       }

//       // Get Calendly URL
//       const user = auth.currentUser;
//       if (user) {
//         const token = await user.getIdToken();
//         const response = await axios.post('http://localhost:5000/auth/calendly', { token });
//         const calendlyUrl = response.data.url;

//         // Save Calendly URL to local storage or context
//         localStorage.setItem('calendlyUrl', calendlyUrl);

//         // Redirect to home page or a page with Calendly embedded
//         setTimeout(() => {
//           navigate('/');
//         }, 1000);
//       }
//     } catch (error) {
//       console.error('Error during authentication:', error);
//       notifyError(error.message);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;
//       notifySuccess('Signed in with Google successfully!');

//       // Get Calendly URL
//       const token = await user.getIdToken();
//       const response = await axios.post('http://localhost:5000/auth/calendly', { token });
//       const calendlyUrl = response.data.url;

//       // Save Calendly URL to local storage or context
//       localStorage.setItem('calendlyUrl', calendlyUrl);

//       // Delay navigation to ensure alert is shown
//       setTimeout(() => {
//         navigate('/');
//       }, 1000);
//     } catch (error) {
//       console.error('Error during Google sign-in:', error);
//       notifyError(error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen p-5 flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
//       <div className="w-full max-w-md p-6 bg-gray-800 shadow-md rounded-md">
//         <h2 className="text-2xl font-bold mb-6 text-center text-white">
//           {isLogin ? 'Login' : 'Sign Up'}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           {!isLogin && (
//             <div className="mb-4">
//               <label htmlFor="name" className="block text-sm font-medium text-gray-300">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={name}
//                 onChange={handleNameChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 placeholder="Enter your name"
//                 required
//               />
//             </div>
//           )}
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-300">
//               Email address
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={email}
//               onChange={handleEmailChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="Enter your email"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={password}
//               onChange={handlePasswordChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           {!isLogin && (
//             <div className="mb-4">
//               <label htmlFor="role" className="block text-sm font-medium text-gray-300">
//                 I want to become a:
//               </label>
//               <select
//                 id="role"
//                 name="role"
//                 value={role}
//                 onChange={handleRoleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               >
//                 <option value="mentee">Mentee</option>
//                 <option value="mentor">Mentor</option>
//               </select>
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             {isLogin ? 'Login' : 'Sign Up'}
//           </button>
//           <div className="mt-4 text-center">
//             <button
//               type="button"
//               onClick={() => setIsLogin(!isLogin)}
//               className="text-blue-400 hover:underline"
//             >
//               {isLogin ? 'Create an account' : 'Already have an account?'}
//             </button>
//           </div>
//         </form>
//         <div className="mt-6 flex justify-center">
//           <button
//             type="button"
//             onClick={handleGoogleSignIn}
//             className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//           >
//             <svg
//               className="w-5 h-5 mr-2 svg-inline--fa fa-google fa-w-16"
//               aria-hidden="true"
//               focusable="false"
//               data-prefix="fab"
//               data-icon="google"
//               role="img"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 488 512"
//             >
//               <path
//                 fill="currentColor"
//                 d="M488 261.8C488 403.3 391.1 512 248.5 512 111.1 512 0 400.9 0 263.5S111.1 15 248.5 15c66.7 0 123.4 24.4 167.8 64.7L348.1 144c-28.7-27.2-66.4-42.2-107.1-42.2-87.7 0-158.7 71.2-158.7 158.7S153.3 418 241 418c70.8 0 120.8-48.1 126-111.3h-126v-86.8H488v42.8z"
//               >
//               </path>
//             </svg>
//             Sign in with Google
//           </button>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default LoginSignUp;








