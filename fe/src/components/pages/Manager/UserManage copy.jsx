import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Loading, MyButton } from '_/components';
import { muiCustomStyles } from '_/components/common/CustomComponents/CustomMui';
import { useThemMui } from '_/context/ThemeMuiContext';
import { getUser } from '_/redux/slices';
import CreateNewUser from './User/CreateNewUser';
import Edit from './Edit';
import Row from './Row';

export default function UserManage() {
    const [edit, setEdit] = useState({ stt: false, value: {} });
    const [addUser, setAddUser] = useState(false);
    const [overLay, setOverLay] = useState(false);
    const [sideNav, setSideNav] = useState(false);
    const [allUser, setAllUser] = useState([]);
    const { loading } = useThemMui();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!sideNav && !addUser && !edit.stt) {
            setOverLay(false);
            return;
        }
        setOverLay(true);
    }, [addUser, edit.stt, sideNav]);

    useEffect(() => {
        dispatch(getUser())
            .then(unwrapResult)
            .then((result) => {
                setAllUser(result.data?.data);
            });
    }, [dispatch]);

    return (
        <Box sx={{ ...muiCustomStyles, width: 'calc(100% - 0px)' }}>
            {loading && <Loading />}
            <Box sx={{ minWidth: '768px', position: 'relative', mt: '80px' }}>
                <TableContainer sx={{ padding: '10px', boxShadow: 'unset' }} component={Paper}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            '&  .btn': {
                                fontSize: '1.2rem',
                                padding: '10px',
                                '& *': { justifyContent: 'center' },
                            },
                        }}
                    >
                        <Typography variant="h4">Current user list</Typography>{' '}
                        <MyButton
                            onClick={() => setAddUser(true)}
                            style={{ padding: '3px 8px' }}
                            className="btn add-btn"
                        >
                            Add new user
                        </MyButton>
                    </Box>
                    <hr style={{ marginTop: '5px', marginBottom: '5px', border: 0, borderTop: '1px solid #000' }} />
                    <Table
                        sx={{
                            width: '100%',
                            '& span.Mui-checked , span.MuiCheckbox-indeterminate': {
                                color: '#333 !important ',
                            },
                            '& *': {
                                // fontSize: '1.2rem !important',
                                '& .MuiTableCell-root': {
                                    padding: '5px',
                                    borderBottomColor: '#00000024',
                                },
                            },
                        }}
                        aria-label="collapsible table"
                    >
                        <TableHead sx={{ '& *': { fontWeight: '700 !important' } }}>
                            <TableRow>
                                <TableCell align="center" sx={{ maxWidth: '15px' }}>
                                    STT
                                </TableCell>
                                <TableCell>Email address</TableCell>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Role</TableCell>
                                <TableCell align="right">Create date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allUser.map((user, index) => {
                                return <Row setEdit={setEdit} key={user.id} user={user} STT={index + 1} />;
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
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
    );
}
