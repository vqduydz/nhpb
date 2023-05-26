import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Button } from '_/components/common';
import UserAvatar from '_/components/common/Avatar/Avatar';
import { useAuth } from '_/context/AuthContext';
import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

function Profile() {
    const [open, setOpen] = useState(false);
    const { currentUser } = useAuth();

    // eslint-disable-next-line no-unused-vars

    const handleEdit = () => {};

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {};
    if (!currentUser) return;
    const { id, email, firstName, lastName, phoneNumber, gender, place, image, role, birthday, createdAt } =
        currentUser;
    const displayName = firstName + ' ' + lastName;

    return (
        <Box className={cx('wrapper')}>
            <Box className={cx('inner')}>
                <Box className={cx('settings-detail')}>
                    <Box
                        sx={{ fontSize: '1.6rem', lineHeight: '19px', margin: '12px', textAlign: 'left', opacity: 0.5 }}
                    >
                        Profile
                    </Box>
                    <Box className={cx('form-group')}>
                        <Box className={cx('account-box')}>
                            <Box className={cx('portrait-container')}>
                                <UserAvatar
                                    style={{
                                        width: '70px',
                                        height: '70px',
                                        border: '1px solid currentColor',
                                        marginRight: '24px',
                                    }}
                                />
                                <Box className={cx('portrait-right')}>
                                    <Box className={cx('username')}>
                                        <span>{displayName}</span>
                                    </Box>
                                </Box>
                            </Box>
                            <Box className={cx('account')}>
                                <span className={cx('title')}>Gender : </span>
                                <span className={cx('msg')}>{gender}</span>
                            </Box>
                            {/* <Box className={cx('account')}>
                                <span className={cx('title')}>Birth : </span>
                                <span className={cx('msg')}>Birth</span>
                            </Box> */}
                            <Box className={cx('account')}>
                                <span className={cx('title')}>Email :</span>
                                <span className={cx('msg')}>{email}</span>
                            </Box>
                            <Box className={cx('account')}>
                                <span className={cx('title')}>Mobile number :</span>
                                <span className={cx('msg')}> {phoneNumber}</span>
                            </Box>

                            <Box className={cx('account')}>
                                <span className={cx('title')}>Address :</span>
                                <span className={cx('msg')}>{place}</span>
                            </Box>

                            <Box className={cx('acction')}>
                                <Button onClick={handleEdit} outline className={cx('edit-btn')}>
                                    Edit
                                </Button>
                                <Box>
                                    <Button onClick={handleClickOpen} outline className={cx('delete-btn')}>
                                        Delete user
                                    </Button>
                                    <Dialog
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <Box className={cx('dialog')}>
                                            <DialogTitle id="alert-dialog-title">{'Delete the account ?'}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText
                                                    sx={{ color: 'inherit' }}
                                                    id="alert-dialog-description"
                                                >
                                                    All data about you will be permanently deleted. Do you want to
                                                    continue ?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions sx={{ color: 'inherit' }}>
                                                <Button onClick={handleClose} outline className={cx('disagree-btn')}>
                                                    Disagree
                                                </Button>
                                                <Button onClick={handleDelete} outline className={cx('agree-btn')}>
                                                    Agree
                                                </Button>
                                            </DialogActions>
                                        </Box>
                                    </Dialog>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Profile;
