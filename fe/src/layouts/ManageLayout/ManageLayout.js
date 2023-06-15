import { Box } from '@mui/material';
import Header from '_/components/pages/Manager/Header';
import CreateNewUser from '_/components/pages/Manager/User/CreateNewUser';
import Edit from '_/components/pages/Manager/User/EditUser';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Inner } from '_/components/common/CustomComponents/CustomMui';
import { useAuth } from '_/context/AuthContext';

export default function ManageLayout({ children }) {
  const [edit, setEdit] = useState({ stt: false, value: {} });
  const [addUser, setAddUser] = useState(false);
  const [overLay, setOverLay] = useState(false);
  const [sideNav, setSideNav] = useState(false);
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
      }}
    >
      <Box>
        <Box>
          {currentUser && (
            <Header setAddUser={setAddUser} sideNav={sideNav} setSideNav={setSideNav} currentUser={currentUser} />
          )}
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
          ;
          {overLay && (
            <Box
              sx={{
                // display: { 0: 'block', 768: 'none' },
                position: 'fixed',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                opacity: 0.6,
                transition: 'bottom 0.3s linear 0s',
                backgroundColor: '#212121',
              }}
              onClick={() => {
                setEdit(false);
                setAddUser(false);
                setSideNav(false);
              }}
            />
          )}
          {edit.stt && <Edit setEdit={setEdit} edit={edit} />}
          {addUser && <CreateNewUser setAddUser={setAddUser} edit={edit} />}
        </Box>
      </Box>
    </Box>
  );
}
