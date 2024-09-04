import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement, // Import PointElement
  LineElement,  // Import LineElement
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale, // Register RadialLinearScale for Radar chart
  PointElement,      // Register PointElement for Radar chart
  LineElement,       // Register LineElement for Radar chart
  Title,
  Tooltip,
  Legend
);

function Overview({ mentorId, mentorName }) {
  // eslint-disable-next-line
  const [mentees, setMentees] = useState([]);
  const [views, setViews] = useState(0);
  // eslint-disable-next-line
  const [totalMentees, setTotalMentees] = useState(0);
  const [menteesForMentor, setMenteesForMentor] = useState(0);
  const [mentorSkills, setMentorSkills] = useState([]);
  const [totalPlatformMentees, setTotalPlatformMentees] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        if (!mentorId) {
          console.error("Mentor ID is undefined.");
          setError("Invalid Mentor ID.");
          return;
        }

        console.log('Fetching mentees for mentorId:', mentorId);

        const menteesRef = collection(db, 'users'); // Updated to 'users' collection
        const q = query(menteesRef, where('mentorId', '==', mentorId), where('role', '==', 'mentee')); // Ensure role is 'mentee'

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.warn('No mentees found for the provided mentorId and role.');
        } else {
          const menteeList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('Fetched mentees:', menteeList);
          setMentees(menteeList);
          setTotalMentees(menteeList.length); // Update total mentees count
          setMenteesForMentor(menteeList.length); // Assuming all fetched mentees are for the current mentor
        }
      } catch (error) {
        console.error('Error fetching mentees:', error);
        setError('Failed to fetch mentees.');
      }
    };

    const fetchMentorData = async () => {
      try {
        if (!mentorName) {
          console.error("Mentor Name is undefined.");
          setError("Invalid Mentor Name.");
          return;
        }

        console.log('Fetching data for mentorName:', mentorName);

        const mentorsRef = collection(db, 'mentors');
        const q = query(mentorsRef, where('name', '==', mentorName));

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const mentorData = querySnapshot.docs[0].data(); // Assuming mentor names are unique
          setViews(mentorData.views || 0); // Set the views from Firestore
          console.log('Fetched views:', mentorData.views);

          // Extract mentor skills
          const skills = mentorData.skills ? mentorData.skills.split(',').map(skill => skill.trim()) : [];
          setMentorSkills(skills);
          console.log('Fetched skills:', skills);
        } else {
          console.error('No mentor found with the given name:', mentorName);
          setViews(0);
        }
      } catch (error) {
        console.error('Error fetching mentor data:', error);
        setError('Failed to fetch mentor data.');
      }
    };

    const fetchTotalMenteesOnPlatform = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'mentee'));
        const querySnapshot = await getDocs(q);
        setTotalPlatformMentees(querySnapshot.size); // Set the total mentees on the platform
        console.log('Total mentees on platform:', querySnapshot.size);
      } catch (error) {
        console.error('Error fetching total mentees on platform:', error);
        setError('Failed to fetch total mentees on platform.');
      }
    };

    fetchMentees();
    fetchMentorData();
    fetchTotalMenteesOnPlatform();
  }, [mentorId, mentorName]);

  // Prepare data for mentee statistics chart
  const menteeChartData = {
    labels: ['Total Mentees', 'Mentees Registered with You', 'Total Mentees Who Viewed You'],
    datasets: [
      {
        label: 'Mentee Statistics',
        data: [totalPlatformMentees, menteesForMentor, views],
        backgroundColor: ['#3b82f6', '#f97316', '#10b981'],
      },
    ],
  };

  // Prepare data for mentor skills chart
  const mentorSkillsData = {
    labels: mentorSkills,
    datasets: [
      {
        label: 'Mentor Skills Distribution',
        data: mentorSkills.map(() => 1), // Each skill is equally distributed
        backgroundColor: ['#f87171', '#34d399', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Overview',
      },
    },
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Mentees Overview</h2>

      {/* Profile Views */}
      <div className="mb-8 p-4 bg-white shadow-lg rounded-lg">
        <p className="text-xl font-semibold">Total Profile Views: {views}</p>
        <p className="text-xl font-semibold">Total Mentees on Platform: {totalPlatformMentees}</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Mentees Statistics - Bar Chart */}
        <div className="p-4 bg-white shadow-lg rounded-lg" style={{ height: '400px' }}>
          <Bar data={menteeChartData} options={chartOptions} />
        </div>

        {/* Mentor Skills Distribution - Radar Chart */}
        <div className="p-4 bg-white shadow-lg rounded-lg" style={{ height: '400px' }}>
          <h3 className="text-center text-lg font-semibold mb-4">Mentor Skills Distribution</h3>
          <Radar data={mentorSkillsData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Overview;













// import React, { useState, useEffect } from 'react';
// import { db } from '../../firebase/firebase';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { Bar, Doughnut, Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Register the necessary components for Chart.js
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// function Overview({ mentorId, mentorName }) {
//   const [mentees, setMentees] = useState([]);
//   const [views, setViews] = useState(0);
//   const [totalMentees, setTotalMentees] = useState(0);
//   const [menteesForMentor, setMenteesForMentor] = useState(0);
//   const [mentorSkills, setMentorSkills] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMentees = async () => {
//       try {
//         if (!mentorId) {
//           console.error("Mentor ID is undefined.");
//           setError("Invalid Mentor ID.");
//           return;
//         }

//         console.log('Fetching mentees for mentorId:', mentorId);

//         const menteesRef = collection(db, 'users'); // Updated to 'users' collection
//         const q = query(menteesRef, where('mentorId', '==', mentorId), where('role', '==', 'mentee')); // Ensure role is 'mentee'

//         const querySnapshot = await getDocs(q);
//         const menteeList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log('Fetched mentees:', menteeList);
//         setMentees(menteeList);
//         setTotalMentees(menteeList.length); // Update total mentees count
//         setMenteesForMentor(menteeList.length); // Assuming all fetched mentees are for the current mentor
//       } catch (error) {
//         console.error('Error fetching mentees:', error);
//         setError('Failed to fetch mentees.');
//       }
//     };

//     const fetchMentorData = async () => {
//       try {
//         if (!mentorName) {
//           console.error("Mentor Name is undefined.");
//           setError("Invalid Mentor Name.");
//           return;
//         }

//         console.log('Fetching data for mentorName:', mentorName);

//         const mentorsRef = collection(db, 'mentors');
//         const q = query(mentorsRef, where('name', '==', mentorName));

//         const querySnapshot = await getDocs(q);
//         if (!querySnapshot.empty) {
//           const mentorData = querySnapshot.docs[0].data(); // Assuming mentor names are unique
//           setViews(mentorData.views || 0); // Set the views from Firestore
//           console.log('Fetched views:', mentorData.views);

//           // Extract mentor skills
//           const skills = mentorData.skills ? mentorData.skills.split(',').map(skill => skill.trim()) : [];
//           setMentorSkills(skills);
//           console.log('Fetched skills:', skills);
//         } else {
//           console.error('No mentor found with the given name:', mentorName);
//           setViews(0);
//         }
//       } catch (error) {
//         console.error('Error fetching mentor data:', error);
//         setError('Failed to fetch mentor data.');
//       }
//     };

//     fetchMentees();
//     fetchMentorData();
//   }, [mentorId, mentorName]);

//   // Prepare data for mentee statistics chart
//   const menteeChartData = {
//     labels: ['Total Mentees', 'Mentees Registered with You'],
//     datasets: [
//       {
//         label: 'Mentee Statistics',
//         data: [totalMentees, menteesForMentor],
//         backgroundColor: ['#3b82f6', '#f97316'],
//       },
//     ],
//   };

//   // Prepare data for mentor skills chart
//   const mentorSkillsData = {
//     labels: mentorSkills,
//     datasets: [
//       {
//         label: 'Mentor Skills Distribution',
//         data: mentorSkills.map(() => 1), // Each skill is equally distributed
//         backgroundColor: ['#f87171', '#34d399', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa'],
//       },
//     ],
//   };

//   if (error) {
//     return <p className="text-red-500 text-center">{error}</p>;
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h2 className="text-3xl font-bold mb-6">Mentees Overview</h2>

//       {/* Profile Views */}
//       <div className="mb-8 p-4 bg-white shadow-lg rounded-lg">
//         <p className="text-xl font-semibold">Total Profile Views: {views}</p>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//         {/* Mentees Statistics - Bar Chart */}
//         <div className="p-4 bg-white shadow-lg rounded-lg">
//           <Bar data={menteeChartData} />
//         </div>

//         {/* Mentees Statistics - Doughnut Chart */}
//         <div className="p-4 bg-white shadow-lg rounded-lg">
//           <Doughnut data={menteeChartData} />
//         </div>

//         {/* Mentor Skills Distribution - Pie Chart */}
//         <div className="p-4 bg-white shadow-lg rounded-lg">
//           <h3 className="text-center text-lg font-semibold mb-4">Mentor Skills Distribution</h3>
//           <Pie data={mentorSkillsData} />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Overview;















