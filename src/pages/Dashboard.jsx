import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';

import NormalUserDash from './NOrmalUserDash';

function Dashboard() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setRole(response.data.role);
      } catch (err) {
        // Not logged in, redirect to login
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  // Render role-based dashboard
  if(role == 'STUDENT' || role == 'FACULTY' || role == 'STAFF'){
    return <NormalUserDash/>
  }
  

}

export default Dashboard;