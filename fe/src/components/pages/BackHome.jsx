import { useAuth } from '_/context/AuthContext';
import { routes } from '_/routes';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

function BackHome() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    navigate(routes.home);
    currentUser?.role !== 'Customer' ? navigate(routes.usermanage) : navigate(routes.home);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return;
}

export default BackHome;
