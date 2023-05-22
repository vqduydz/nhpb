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
import { MyButton } from '_/components/common';
import { muiCustomStyles } from '_/components/common/CustomComponents/CustomMui';
import { useThemMui } from '_/context/ThemeMuiContext';
import { getMenu } from '_/redux/slices';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FileUpload from '../FileUpload';
import CreateNewUser from './CreateNewMenu';
import EditMenu from './EditMenu';
import Row from './Row';

export default function MenuManage() {
    const [edit, setEdit] = useState({ stt: false, value: {} });
    const [addMenu, setAddMenu] = useState(false);
    const [upload, setUpload] = useState(false);
    const [overLay, setOverLay] = useState(false);
    const [sideNav, setSideNav] = useState(false);
    const [menus, setMenus] = useState({ items: [], pathImage: '' });
    const [access, setAccess] = useState({ permission: false, message: '' });
    const { loading } = useThemMui();
    const dispatch = useDispatch();
    const { items, imagePath } = menus;
    const { permission, message } = access;
    useEffect(() => {
        if (!sideNav && !addMenu && !edit.stt) {
            setOverLay(false);
            return;
        }
        setOverLay(true);
    }, [addMenu, edit?.stt, sideNav]);

    useEffect(() => {
        dispatch(getMenu())
            .then(unwrapResult)
            .then((result) => {
                setAccess({ permission: true });
                setMenus({ items: result.menu, imagePath: result.imagePath });
            })
            .catch((error) => {
                setAccess({ permission: false, message: error.errorMessage });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    return (
        <Box sx={{ ...muiCustomStyles }}>
            <Box
                sx={{
                    minWidth: permission ? '768px' : '320px',
                    position: 'relative',
                }}
            >
                {permission ? (
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
                            <Typography variant="h4">Current menu list</Typography>{' '}
                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                <MyButton
                                    effect
                                    color={{ mainColor: 'green' }}
                                    onClick={() => setAddMenu(true)}
                                    style={{ padding: '3px 8px' }}
                                    className="btn"
                                >
                                    Add new menu
                                </MyButton>
                                <MyButton
                                    effect
                                    color={{ mainColor: 'blue' }}
                                    onClick={() => setUpload(true)}
                                    style={{ padding: '3px 8px' }}
                                    className="btn"
                                >
                                    Import
                                </MyButton>
                            </Box>
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
                                    <TableCell align="center" sx={{ width: '45px' }}>
                                        STT
                                    </TableCell>
                                    <TableCell>Tên món ăn</TableCell>
                                    <TableCell align="right">Danh mục</TableCell>
                                    <TableCell align="right">Đơn giá</TableCell>
                                    <TableCell align="right">Đơn vị tính</TableCell>
                                    <TableCell align="right">Create date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((menu, index) => {
                                    return (
                                        <Row
                                            imagePath={imagePath}
                                            setEdit={setEdit}
                                            key={menu.id}
                                            menu={menu}
                                            STT={index + 1}
                                        />
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box>
                        <Box
                            sx={{
                                padding: '0 20px',
                                maxWidth: '100vh',
                                margin: '20px auto',
                                textAlign: 'center',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: 'red',
                            }}
                        >
                            <Box>{message}</Box>
                        </Box>
                    </Box>
                )}
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
                        setAddMenu(false);
                        setSideNav(false);
                    }}
                />
            )}
            {edit.stt && <EditMenu setEdit={setEdit} edit={edit} />}
            {/* {addMenu && <CreateNewUser setAddMenu={setAddMenu} edit={edit} />} */}
            {addMenu && <CreateNewUser setAddMenu={setAddMenu} edit={edit} />}
            {upload && <FileUpload setUpload={setUpload} menus />}
        </Box>
    );
}
