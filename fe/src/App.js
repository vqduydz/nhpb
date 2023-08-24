import { Fragment } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PrivateRoutes, PublicRoutes } from './routes';
import { DesktopLayout } from './layouts';
import { Box, Typography } from '@mui/material';
import { MyButton } from './components/common';

function App() {
  const { currentUser } = useAuth();
  return isMobileOnly ? (
    <Box
      sx={{
        p: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
      }}
    >
      <Typography>Tải app đi má</Typography>
      <MyButton text href={'/#'}>
        Link tải ap nè má
      </MyButton>
    </Box>
  ) : (
    <Router>
      <Box className="App">
        <Routes>
          {(!currentUser || currentUser.role === 'Customer') &&
            PublicRoutes().map((route, index) => {
              const Page = route.comp;
              let Layout = DesktopLayout;
              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }

              return (
                <Route
                  key={index}
                  exact
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          {currentUser?.role !== 'Customer' &&
            PrivateRoutes().map((route, index) => {
              const Page = route.comp;
              let Layout = DesktopLayout;
              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }

              return (
                <Route
                  key={index}
                  exact
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
