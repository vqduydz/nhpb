import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import classNames from 'classnames/bind';
import { useState } from 'react';

import { MyButton } from '_/components/common';
import UserAvatar from '_/components/common/Avatar/Avatar';
import { useAuth } from '_/context/AuthContext';
import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

function Profile() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();

  const handleEdit = () => {};

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {};
  if (!currentUser) return;
  const { email, firstName, lastName, phoneNumber, gender, place } = currentUser;
  const displayName = firstName + ' ' + lastName;

  return (
    <Box className={cx('wrapper')}>
      <Box className={cx('inner')}>
        <Box className={cx('settings-detail')}>
          <Box sx={{ fontSize: '1.6rem', lineHeight: '19px', margin: '12px', textAlign: 'left', opacity: 0.5 }}>
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
                <span className={cx('msg')}>
                  {(() => {
                    if (place) {
                      const address = JSON.parse(place);
                      return `${address?.address}, ${address?.ward}, ${address?.district}, ${address?.province}`;
                    } else {
                      return ``;
                    }
                  })()}
                </span>
              </Box>

              <Box className={cx('acction')}>
                <MyButton onClick={handleEdit} outline className={cx('edit-btn')}>
                  Edit
                </MyButton>
                <Box>
                  <MyButton onClick={handleClickOpen} outline className={cx('delete-btn')}>
                    Delete user
                  </MyButton>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <Box className={cx('dialog')}>
                      <DialogTitle id="alert-dialog-title">{'Delete the account ?'}</DialogTitle>
                      <DialogContent>
                        <DialogContentText sx={{ color: 'inherit' }} id="alert-dialog-description">
                          All data about you will be permanently deleted. Do you want to continue ?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions sx={{ color: 'inherit' }}>
                        <MyButton onClick={handleClose} outline className={cx('disagree-btn')}>
                          Disagree
                        </MyButton>
                        <MyButton onClick={handleDelete} outline className={cx('agree-btn')}>
                          Agree
                        </MyButton>
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
