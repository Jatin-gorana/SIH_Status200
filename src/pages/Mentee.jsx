import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase'; // Ensure correct path to your Firebase config
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function MentorRegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    occupation: '',
    company: '',
    experience: '',
    skills: '',
    linkedin: '',
    mentorshipAreas: '',
    availability: '',
    bio: '',
  });

  const [photoFile, setPhotoFile] = useState(null); // State to handle photo file
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storage = getStorage();
    let photoURL = '';

    try {

         // If a photo is selected, upload it to Firebase Storage
      if (photoFile) {
        const storageRef = ref(storage, `mentors/${photoFile.name}`);
        const snapshot = await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      // Add new mentor data to Firestore
      await addDoc(collection(db, 'mentors'), {
        name: formData.fullName,
        photo: photoURL, // Placeholder for photo URL
        bio: formData.bio,
        experience: formData.experience,
        skills: formData.skills,
        linkedin: formData.linkedin,
        mentorshipAreas: formData.mentorshipAreas,
        availability: formData.availability,
        occupation: formData.occupation,
        company: formData.company,
      });

      alert('Mentor registered successfully!');
      navigate('/mentor'); // Ensure this matches your route setup
    } catch (error) {
      console.error('Error adding mentor: ', error);
      alert('Error registering mentor. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-black to-gray-900 py-5 px-3">
      <form 
        onSubmit={handleSubmit} 
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Register as a Mentor</h2>

        {/* Personal Information */}
         <div className="mb-4">
           <label className="block text-gray-400 mb-2">Full Name</label>
           <input 
            type="text" 
            name="fullName" 
            value={formData.fullName} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
            required 
          />
        </div>

        {/* photo */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Profile Photo</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg"
          />
        </div>

        {/* Professional Information */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Occupation</label>
          <input 
            type="text" 
            name="occupation" 
            value={formData.occupation} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Company/Organization</label>
          <input 
            type="text" 
            name="company" 
            value={formData.company} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Years of Experience</label>
          <input 
            type="number" 
            name="experience" 
            value={formData.experience} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Skills</label>
          <input 
            type="text" 
            name="skills" 
            value={formData.skills} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
            placeholder="E.g., Data Science, Web Development"
            required 
          />
        </div>

        

        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Areas of Mentorship</label>
          <input 
            type="text" 
            name="mentorshipAreas" 
            value={formData.mentorshipAreas} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
            placeholder="E.g., Career Development, Leadership"
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Availability</label>
          <input 
            type="text" 
            name="availability" 
            value={formData.availability} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
            placeholder="E.g., Weekdays, Weekends"
            required 
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Mentorship Bio</label>
          <textarea 
            name="bio" 
            value={formData.bio} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
            rows="4"
            placeholder="Describe your mentoring approach, experience, and what you can offer."
            required 
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default MentorRegistrationForm;
















// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { db } from '../firebase/firebase'; // Ensure correct path to your Firebase config
// import { collection, addDoc } from 'firebase/firestore';

// function MentorRegistrationForm() {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     phone: '',
//     occupation: '',
//     company: '',
//     experience: '',
//     skills: '',
//     linkedin: '',
//     mentorshipAreas: '',
//     availability: '',
//     bio: '',
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Add new mentor data to Firestore
//       await addDoc(collection(db, 'mentors'), {
//         name: formData.fullName,
//         photo: '', // Placeholder for photo URL
//         bio: formData.bio,
//         experience: formData.experience,
//         skills: formData.skills,
//         linkedin: formData.linkedin,
//         mentorshipAreas: formData.mentorshipAreas,
//         availability: formData.availability,
//         occupation: formData.occupation,
//         company: formData.company,
//       });

//       alert('Mentor registered successfully!');
//       navigate('/mentor'); // Ensure this matches your route setup
//     } catch (error) {
//       console.error('Error adding mentor: ', error);
//       alert('Error registering mentor. Please try again.');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-black to-gray-900 py-5 px-3">
//       <form 
//         onSubmit={handleSubmit} 
//         className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg"
//       >
//         <h2 className="text-3xl font-bold text-center mb-6 text-white">Register as a Mentor</h2>

//         {/* Personal Information */}
//          <div className="mb-4">
//            <label className="block text-gray-400 mb-2">Full Name</label>
//            <input 
//             type="text" 
//             name="fullName" 
//             value={formData.fullName} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             required 
//           />
//         </div>

         

//         {/* Professional Information */}
//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Occupation</label>
//           <input 
//             type="text" 
//             name="occupation" 
//             value={formData.occupation} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             required 
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Company/Organization</label>
//           <input 
//             type="text" 
//             name="company" 
//             value={formData.company} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Years of Experience</label>
//           <input 
//             type="number" 
//             name="experience" 
//             value={formData.experience} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             required 
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Skills</label>
//           <input 
//             type="text" 
//             name="skills" 
//             value={formData.skills} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             placeholder="E.g., Data Science, Web Development"
//             required 
//           />
//         </div>

        

//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Areas of Mentorship</label>
//           <input 
//             type="text" 
//             name="mentorshipAreas" 
//             value={formData.mentorshipAreas} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             placeholder="E.g., Career Development, Leadership"
//             required 
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Availability</label>
//           <input 
//             type="text" 
//             name="availability" 
//             value={formData.availability} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             placeholder="E.g., Weekdays, Weekends"
//             required 
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-gray-400 mb-2">Mentorship Bio</label>
//           <textarea 
//             name="bio" 
//             value={formData.bio} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             rows="4"
//             placeholder="Describe your mentoring approach, experience, and what you can offer."
//             required 
//           ></textarea>
//         </div>
        
//         <button 
//           type="submit" 
//           className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }

// export default MentorRegistrationForm;









// import React, { useState } from 'react';

// function MentorRegistrationForm() {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     phone: '',
//     occupation: '',
//     company: '',
//     experience: '',
//     skills: '',
//     linkedin: '',
//     mentorshipAreas: '',
//     availability: '',
//     bio: '',
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Code to handle form submission, like sending data to the backend.
//     console.log(formData);
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-black to-gray-900 py-5 px-3">
//       <form 
//         onSubmit={handleSubmit} 
//         className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg"
//       >
//         <h2 className="text-3xl font-bold text-center mb-6 text-white">Register as a Mentor</h2>

//         {/* Personal Information */}
//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Full Name</label>
//           <input 
//             type="text" 
//             name="fullName" 
//             value={formData.fullName} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             required 
//           />
//         </div>

//         {/* <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Email</label>
//           <input 
//             type="email" 
//             name="email" 
//             value={formData.email} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             required 
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Password</label>
//           <input 
//             type="password" 
//             name="password" 
//             value={formData.password} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             required 
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Phone Number</label>
//           <input 
//             type="tel" 
//             name="phone" 
//             value={formData.phone} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             required 
//           />
//         </div> */}

//         {/* Professional Information */}
//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Occupation</label>
//           <input 
//             type="text" 
//             name="occupation" 
//             value={formData.occupation} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             required 
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Company/Organization</label>
//           <input 
//             type="text" 
//             name="company" 
//             value={formData.company} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Years of Experience</label>
//           <input 
//             type="number" 
//             name="experience" 
//             value={formData.experience} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             required 
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Skills</label>
//           <input 
//             type="text" 
//             name="skills" 
//             value={formData.skills} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             placeholder="E.g., Data Science, Web Development"
//             required 
//           />
//         </div>

        

//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Areas of Mentorship</label>
//           <input 
//             type="text" 
//             name="mentorshipAreas" 
//             value={formData.mentorshipAreas} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             placeholder="E.g., Career Development, Leadership"
//             required 
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-400 mb-2">Availability</label>
//           <input 
//             type="text" 
//             name="availability" 
//             value={formData.availability} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             placeholder="E.g., Weekdays, Weekends"
//             required 
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-gray-400 mb-2">Mentorship Bio</label>
//           <textarea 
//             name="bio" 
//             value={formData.bio} 
//             onChange={handleChange} 
//             className="w-full p-3 border border-gray-700 bg-gray-900 text-white rounded-lg" 
//             rows="4"
//             placeholder="Describe your mentoring approach, experience, and what you can offer."
//             required 
//           ></textarea>
//         </div>

//         <button 
//           type="submit" 
//           className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }

// export default MentorRegistrationForm;
