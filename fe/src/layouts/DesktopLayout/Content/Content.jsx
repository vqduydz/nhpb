import { Box } from '@mui/material';
import classNames from 'classnames/bind';
import { Loading } from '_/components/common';
import { useThemMui } from '_/context/ThemeMuiContext';

import styles from './Content.module.scss';

const cx = classNames.bind(styles);

function Content({ children }) {
    const { loading } = useThemMui();
    return (
        <div className={cx('wrapper')}>
            {loading && <Loading />}
            <Box className={cx('inner')}>{children}</Box>
        </div>
    );
}

export default Content;
