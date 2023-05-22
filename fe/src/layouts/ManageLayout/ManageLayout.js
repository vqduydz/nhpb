import { Box } from '@mui/material';
import Edit from '_/components/pages/Manager/User/EditUser';
import Header from '_/components/pages/Manager/Header';
import CreateNewUser from '_/components/pages/Manager/User/CreateNewUser';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { styleBtn } from '_/components/pages/Manager/styleBtn';
import { useAuth } from '_/context/AuthContext';
import { Content } from '../DesktopLayout';
import styles from './ManageLayout.module.scss';

const cx = classNames.bind(styles);

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
        <Content>
            <Box sx={{ ...styleBtn }}>
                <div className={cx('wrapper')}>
                    {currentUser && (
                        <Header
                            setAddUser={setAddUser}
                            sideNav={sideNav}
                            setSideNav={setSideNav}
                            currentUser={currentUser}
                        />
                    )}

                    <div className={cx('content')}>{children}</div>
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
                </div>
            </Box>
        </Content>
    );
}
