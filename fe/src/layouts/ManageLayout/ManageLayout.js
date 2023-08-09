import { Box } from '@mui/material';
import Header from '_/components/pages/Manager/Header';
import CreateNewUser from '_/components/pages/Manager/User/CreateNewUser';
import Edit from '_/components/pages/Manager/User/EditUser';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SnackbarWrapper } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';

export default function ManageLayout({ children }) {
  const [edit, setEdit] = useState({ stt: false, value: {} });
  const [addUser, setAddUser] = useState(false);
  const [overLay, setOverLay] = useState(false);
  const [sideNav, setSideNav] = useState(false);
  const { snackbar } = useAuth();
  const { open } = snackbar;

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) navigate('/login');
    // if (currentUser && currentUser.role === 'Customer') navigate(routes.home);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (!sideNav && !addUser && !edit.stt) {
      setOverLay(false);
      return;
    }
    setOverLay(true);
  }, [addUser, edit.stt, sideNav]);

  return (
    <Box
      sx={{
        padding: `var(--padding)`,
        borderRadius: ` 0px 0px 6px 6px`,
        width: `100%`,
        minHeight: `100vh`,
        '& p': { fontSize: '1.4rem', fontWeight: 500 },
        '& i': { fontSize: '1.2rem', lineHeight: 1 },
      }}
    >
      {open && <SnackbarWrapper />}
      <Box>
        <Box>
          <Header currentUser={currentUser} />
          <Box
            sx={{
              maxWidth: '768px',
              paddingRight: '0.1rem',
              paddingLeft: '0.1rem',
              marginRight: 'auto',
              marginLeft: 'auto',
              width: '100%',
              minWidth: '762px',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
