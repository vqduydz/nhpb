import SettingsIcon from '@mui/icons-material/Settings';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { Box } from '@mui/material';
import classNames from 'classnames/bind';
import { useAuth } from '_/context/AuthContext';
import { routes } from '_/routes';

import styles from './NotFoundPage.module.scss';
import { MyButton } from '../common';

const cx = classNames.bind(styles);

function NotFoundPage() {
  const { currentUser } = useAuth();
  return (
    <>
      <div className={cx('container')}>
        <h1 className={cx('first-four')}>4</h1>
        <SettingsIcon sx={{ fontSize: '40vmin' }} className={cx('cog1')} />
        <SettingsIcon sx={{ fontSize: '40vmin' }} className={cx('cog2')} />
        <h1 className={cx('second-four')}>4</h1>
        <p className={cx('wrong-para')}>Uh Oh! Page not found!</p>
        <Box className={cx('button')}>
          <MyButton outline to={routes.home}>
            Go to home <TouchAppIcon />
          </MyButton>

          {!currentUser && (
            <MyButton outline to={routes.login}>
              Go to login <TouchAppIcon />
            </MyButton>
          )}
          {currentUser && currentUser?.role !== 'Customer' ? (
            <MyButton outline to={routes.manage}>
              Go to manage <TouchAppIcon />
            </MyButton>
          ) : (
            <></>
          )}
        </Box>
      </div>
      <div className={cx('bottom')}></div>
    </>
  );
}

export default NotFoundPage;
