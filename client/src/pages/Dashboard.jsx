// import { useAuth } from '../context/AuthContext';

// function Dashboard() {
//   const { user, logoutUser } = useAuth();

//   return (
//     <div>
//       <h2>Dashboard</h2>
//       <p>Welcome, {user?.name}!</p>
//       <button onClick={logoutUser}>Logout</button>
//     </div>
//   );
// }

// export default Dashboard;

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.name}!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;