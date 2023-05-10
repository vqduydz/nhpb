import { Fragment } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PrivateRoutes, PublicRoutes } from './routes';
import { DesktopLayout } from './layouts';
import { Box } from '@mui/material';

function App() {
    const { currentUser } = useAuth();
    return isMobileOnly ? (
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
                        PrivateRoutes.map((route, index) => {
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
                        PrivateRoutes.map((route, index) => {
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
