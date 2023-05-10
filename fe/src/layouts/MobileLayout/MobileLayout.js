import classNames from 'classnames/bind';
import Content from './Content/Content';
import Footer from './Footer/Footer';

import styles from './MobileLayout.module.scss';
import { Header } from '.';

const cx = classNames.bind(styles);

function MobileLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('content')}>
                <Content>{children}</Content>
            </div>
            <div className={cx('footer')}>
                <Footer />
            </div>
        </div>
    );
}

export default MobileLayout;
