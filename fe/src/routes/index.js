import {
    Cart,
    Detail,
    ForgotPassword,
    Home,
    Login,
    Menu,
    NotFoundPage,
    CheckOut,
    Register,
    ResetPass,
    Test,
    Profile,
} from '_/components/pages';
import { ContentOnlyLayout } from '_/layouts';
import { selector } from '_/redux/selector';
import { useSelector } from 'react-redux';

const routes = {
    home: '/',
    menu: '/thuc-don',
    detail: '/mon-an/:slug',
    cart: '/cart',
    checkout: '/checkout',
    test: '/test',

    login: '/login',
    register: '/register',
    manage: '/manage',
    usermanage: '/manage/user',
    contentmanage: '/manage/a',
    ordermanage: '/manage/b',

    forgotpassword: '/forgotpassword',
    resetPassword: '/reset-password/:token',
    profile: '/profile',
    timeline: '/timeline',
    project: '/project',
    notfoundpage: '*',
};

const PrivateRoutes = [{ path: routes.home, comp: Home }];

function PublicRoutes() {
    const { currentUser } = useSelector(selector.globalStates);
    return currentUser
        ? [
              { path: routes.home, comp: Home },
              { path: routes.test, comp: Test, layout: ContentOnlyLayout },
              { path: routes.menu, comp: Menu },
              { path: routes.detail, comp: Detail },
              { path: routes.profile, comp: Profile },
              { path: routes.cart, comp: Cart },
              { path: routes.checkout, comp: CheckOut },
              { path: routes.login, comp: Login, layout: ContentOnlyLayout },
              { path: routes.register, comp: Register, layout: ContentOnlyLayout },
              { path: routes.forgotpassword, comp: ForgotPassword, layout: ContentOnlyLayout },
              { path: routes.resetPassword, comp: ResetPass, layout: ContentOnlyLayout },
              { path: routes.notfoundpage, comp: NotFoundPage },
          ]
        : [
              { path: routes.home, comp: Home },
              { path: routes.test, comp: Test, layout: ContentOnlyLayout },
              { path: routes.menu, comp: Menu },
              { path: routes.detail, comp: Detail },
              { path: routes.profile, comp: Login, layout: ContentOnlyLayout },
              { path: routes.cart, comp: Login, layout: ContentOnlyLayout },
              { path: routes.checkout, comp: Login, layout: ContentOnlyLayout },
              { path: routes.login, comp: Login, layout: ContentOnlyLayout },
              { path: routes.register, comp: Register, layout: ContentOnlyLayout },
              { path: routes.forgotpassword, comp: ForgotPassword, layout: ContentOnlyLayout },
              { path: routes.resetPassword, comp: ResetPass, layout: ContentOnlyLayout },
              { path: routes.notfoundpage, comp: NotFoundPage },
          ];
}

export { PrivateRoutes, PublicRoutes, routes };
