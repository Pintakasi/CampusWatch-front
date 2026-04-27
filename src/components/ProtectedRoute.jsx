import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../config/axios';

function ProtectedRoute({ children, allowedRoles }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      api.get('/auth/me')
      .then(res => setRole(res.data.role))
      .catch(() => setRole(null))
      .finally(() => setLoading(false));
  }, []);


  if (loading) return <div>Checking permissions...</div>;
  
  if (!role) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    console.log(role);
    return <div>Access Denied</div>;
  }
  
  return children;
}

export default ProtectedRoute;