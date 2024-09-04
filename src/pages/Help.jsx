import React, { useState, useEffect } from 'react';
import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';
import img5 from '../assets/5.jpg';
import img6 from '../assets/6.jpg';
import img7 from '../assets/7.jpg';

const HelpPage = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Effect to check screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // Consider screen widths less than 768px as mobile
    };

    handleResize(); // Initialize the state on component mount
    window.addEventListener('resize', handleResize); // Update on resize

    return () => window.removeEventListener('resize', handleResize); // Clean up event listener on unmount
  }, []);

  const steps = [
    {
      step: 'Step 1',
      text: 'Go to the Calendly website and click on "Sign Up".',
      imgSrc: img1,
    },
    {
      step: 'Step 2',
      text: 'Enter your email address and click on "Get Started".',
      imgSrc: img2,
    },
    {
      step: 'Step 3',
      text: 'Choose how you want to sign up (Google, Office 365, etc.).',
      imgSrc: img3,
    },
    {
      step: 'Step 4',
      text: 'Fill in your profile details and set your availability.',
      imgSrc: img4,
    },
    {
      step: 'Step 5',
      text: 'Connect your calendar to automatically update your availability.',
      imgSrc: img5,
    },
    {
      step: 'Step 6',
      text: 'Customize your event types for different meeting scenarios.',
      imgSrc: img6,
    },
    {
      step: 'Step 7',
      text: 'Share your Calendly link with mentees to schedule meetings.',
      imgSrc: img7,
    },
  ];

  const openLightbox = (imgSrc) => {
    if (!isMobileView) { // Open lightbox only if it's not in mobile view
      setCurrentImage(imgSrc);
      setIsLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setCurrentImage(null);
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-black to-gray-900 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-6">How to Create a Calendly Account</h1>
      <div className="w-full max-w-3xl">
        {steps.map((step, index) => (
          <div key={index} className="mb-8 p-4 bg-gray-800 text-white rounded-lg shadow-lg flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
              {/* Controlled Image Size */}
              <img
                src={step.imgSrc}
                alt={step.step}
                className="cursor-pointer w-full h-auto max-w-[300px] max-h-[300px] md:max-w-[200px] md:max-h-[200px] object-contain"
                onClick={() => openLightbox(step.imgSrc)} // Open lightbox on click
              />
            </div>
            <div className="md:w-2/3 md:pl-6">
              <h2 className="text-xl font-semibold text-gray-700 text-white">{step.step}</h2>
              <p className="text-white">{step.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeLightbox} // Close lightbox on background click
        >
          <div className="relative w-3/5 h-3/5 flex justify-center items-center bg-white p-4 rounded-lg">
            <img src={currentImage} alt="Enlarged view" className="max-w-full max-h-full object-contain" />
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-black text-2xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl mt-10">
        <h2 className="text-2xl font-bold text-white mb-4">Additional Information</h2>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 Aspect Ratio */}
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            src="https://www.youtube.com/embed/EXULajMc_5M"
            title="Calendly Guide"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;









// import React from 'react';
// import img1 from '../assets/1.jpg'
// import img2 from '../assets/2.jpg'
// import img3 from '../assets/3.jpg'
// import img4 from '../assets/4.jpg'
// import img5 from '../assets/5.jpg'
// import img6 from '../assets/6.jpg'
// import img7 from '../assets/7.jpg'

// const HelpPage = () => {
//   const steps = [
//     {
//       step: 'Step 1',
//       text: 'Go to the Calendly website and click on "Sign Up".',
//       imgSrc: img1, // replace with actual image link
//     },
//     {
//       step: 'Step 2',
//       text: 'Enter your email address and click on "Get Started".',
//       imgSrc: img2,
//     },
//     {
//       step: 'Step 3',
//       text: 'Choose how you want to sign up (Google, Office 365, etc.).',
//       imgSrc: img3,
//     },
//     {
//       step: 'Step 4',
//       text: 'Fill in your profile details and set your availability.',
//       imgSrc: img4,
//     },
//     {
//       step: 'Step 5',
//       text: 'Connect your calendar to automatically update your availability.',
//       imgSrc: img5,
//     },
//     {
//       step: 'Step 6',
//       text: 'Customize your event types for different meeting scenarios.',
//       imgSrc: img6,
//     },
//     {
//       step: 'Step 7',
//       text: 'Share your Calendly link with mentees to schedule meetings.',
//       imgSrc: img7,
//     },
//   ];

//   return (
//     <div className="min-h-screen p-4 bg-gray-100 flex flex-col items-center">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">How to Create a Calendly Account</h1>
//       <div className="w-full max-w-3xl">
//         {steps.map((step, index) => (
//           <div key={index} className="mb-8 p-4 bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center">
//             <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
//               {/* Controlled Image Size */}
//               <img
//                 src={step.imgSrc}
//                 alt={step.step}
//                 className="w-full h-auto max-w-[300px] max-h-[300px] md:max-w-[200px] md:max-h-[200px] object-contain" // Responsive and size-controlled
//               />
//             </div>
//             <div className="md:w-2/3 md:pl-6">
//               <h2 className="text-xl font-semibold text-gray-700">{step.step}</h2>
//               <p className="text-gray-600">{step.text}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="w-full max-w-3xl mt-10">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Information</h2>
//         <div className="aspect-w-16 aspect-h-9">
//           <iframe
//             className="w-full h-full rounded-lg shadow-lg"
//             src="https://www.youtube.com/embed/your-video-id" // replace with actual video link
//             title="Calendly Guide"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           ></iframe>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HelpPage;