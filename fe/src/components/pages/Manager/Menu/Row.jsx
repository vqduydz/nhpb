import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { MyButton } from '_/components/common';
import { useAuth } from '_/context/AuthContext';
import { useThemMui } from '_/context/ThemeMuiContext';
import { deleteMenu } from '_/redux/slices';
import { dateTimeFormate } from '_/utills';

export default function Row(props) {
    const dispatch = useDispatch();
    const { setLoading } = useThemMui();
    const { menu, STT, setEdit, imagePath } = props;
    const { id, createdAt, slug, name, catalog, price, unit, thumb_url, desc } = menu;
    const { setSnackbar } = useAuth();
    const [open, setOpen] = useState(false);
    const handleDelete = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Delete confirmation')) {
            setLoading(true);
            dispatch(deleteMenu(id))
                .then(unwrapResult)
                .then((result) => {
                    let message, status;
                    if (result.error) {
                        message = result.error;
                        status = 'error';
                    } else {
                        message = result.message;
                        status = 'success';
                    }
                    setLoading(false);
                    setSnackbar({ open: true, message, status });
                })
                .catch((e) => {
                    setLoading(false);
                    setSnackbar({ open: true, message: 'unknow error', status: 'error' });
                });
        } else {
            setSnackbar({ open: true, message: 'Cancel delete', status: 'info' });
        }
    };
    const renderPrice = (price) => {
        if (!price) return;
        const options = { style: 'currency', currency: 'VND' };
        return `${price.toLocaleString('vi-VN', options)}`;
    };
    return (
        <>
            <TableRow
                onClick={() => {
                    setOpen(!open);
                }}
                sx={{
                    cursor: 'pointer',
                    backgroundColor: STT % 2 === 0 ? '#f9f9f9' : '#fff',
                    borderRadius: '3px',
                    background: 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(0,0,0,0.2) 100%)',
                    '& > *': { borderBottom: 'unset' },
                }}
            >
                <TableCell sx={{ width: '35px' }} align="center">
                    {STT}
                </TableCell>
                <TableCell component="th" scope="row">
                    {name}
                </TableCell>
                <TableCell align="right">{catalog}</TableCell>
                <TableCell align="right">{renderPrice(price)}</TableCell>
                <TableCell align="right">{unit}</TableCell>
                <TableCell align="right">{dateTimeFormate(createdAt)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ paddingLeft: '5vh' }}>
                            <Table size="small" aria-label="purchases">
                                <TableHead
                                    onClick={() => {
                                        setOpen(!open);
                                    }}
                                >
                                    <TableRow>
                                        <TableCell sx={{ width: '200px' }} align="center">
                                            Hình ảnh
                                        </TableCell>
                                        <TableCell align="left">Mô tả</TableCell>
                                        <TableCell align="right">Link</TableCell>
                                        <TableCell sx={{ maxWidth: '100px', width: '100px' }} align="center">
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell
                                            align="center"
                                            sx={{ paddingLeft: '1vh' }}
                                            component="th"
                                            scope="row"
                                        >
                                            <img src={imagePath + thumb_url} alt="Uploaded" width={150} height={100} />
                                        </TableCell>
                                        <TableCell align="left" dangerouslySetInnerHTML={{ __html: desc }}></TableCell>
                                        <TableCell align="right">
                                            <MyButton style={{ ploat: 'right' }} to={`/mon-an/${slug}`} text>
                                                Link
                                            </MyButton>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box
                                                justifyContent={'flex-end'}
                                                sx={{
                                                    display: 'flex',
                                                    '& .btn ': {
                                                        // padding: '0 2px',
                                                        '+ .btn': {
                                                            marginLeft: '5px',
                                                        },
                                                    },

                                                    '& .icon': {
                                                        fontSize: '1.6rem !important',
                                                    },
                                                    ' * ': {
                                                        borderRadius: '3px',
                                                    },
                                                }}
                                            >
                                                <MyButton
                                                    effect
                                                    color={{ mainColor: 'orange' }}
                                                    onClick={() => {
                                                        setEdit({ stt: true, value: menu });
                                                    }}
                                                    aria-label="delete"
                                                    className={' btn edit-btn'}
                                                >
                                                    <EditIcon className="icon" />
                                                </MyButton>

                                                <MyButton
                                                    effect
                                                    color={{ mainColor: 'red' }}
                                                    padding="2px 4px"
                                                    onClick={handleDelete}
                                                    className={' btn del-btn'}
                                                    aria-label="delete"
                                                >
                                                    <DeleteIcon className="icon" />
                                                </MyButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}
