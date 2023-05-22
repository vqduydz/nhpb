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
    Manage,
    UserManage,
    ContentManage,
    OrderManage,
    BackHome,
    MenuManage,
    CatalogManage,
    Order,
} from '_/components/pages';
import { ContentOnlyLayout, ManageLayout } from '_/layouts';
import { selector } from '_/redux/selector';
import { useSelector } from 'react-redux';

const routes = {
    home: '/',
    menu: '/thuc-don',
    detail: '/mon-an/:slug',
    cart: '/cart',
    checkout: '/checkout',
    order: '/order',
    test: '/test',

    login: '/login',
    register: '/register',
    manage: '/manage',
    usermanage: '/manage/user',
    menumanage: '/manage/menu',
    catalogmanage: '/manage/catalog',
    contentmanage: '/manage/a',
    ordermanage: '/manage/b',
    forgotpassword: '/forgotpassword',
    resetPassword: '/reset-password/:token',
    profile: '/profile',
    timeline: '/timeline',
    project: '/project',
    notfoundpage: '*',
};

function PublicRoutes() {
    const { currentUser } = useSelector(selector.globalStates);
    const publicRoutes = {
        home: '/',
        menu: '/thuc-don',
        detail: '/mon-an/:slug',
        cart: '/cart',
        checkout: '/checkout',
        order: '/order',
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
    if (currentUser)
        return [
            { path: publicRoutes.home, comp: Home },
            { path: publicRoutes.menu, comp: Menu },
            { path: publicRoutes.detail, comp: Detail },
            { path: publicRoutes.profile, comp: Profile },
            { path: publicRoutes.cart, comp: Cart },
            { path: publicRoutes.checkout, comp: CheckOut },
            { path: publicRoutes.order, comp: Order },
            { path: publicRoutes.test, comp: Test, layout: ContentOnlyLayout },
            { path: publicRoutes.login, comp: Login, layout: ContentOnlyLayout },
            { path: publicRoutes.register, comp: Register, layout: ContentOnlyLayout },
            { path: publicRoutes.forgotpassword, comp: ForgotPassword, layout: ContentOnlyLayout },
            { path: publicRoutes.resetPassword, comp: ResetPass, layout: ContentOnlyLayout },
            { path: publicRoutes.notfoundpage, comp: NotFoundPage },
        ];
    else
        return [
            { path: publicRoutes.home, comp: Home },
            { path: publicRoutes.test, comp: Test, layout: ContentOnlyLayout },
            { path: publicRoutes.menu, comp: Menu },
            { path: publicRoutes.detail, comp: Detail },
            { path: publicRoutes.order, comp: Login },
            { path: publicRoutes.profile, comp: Login, layout: ContentOnlyLayout },
            { path: publicRoutes.cart, comp: Login, layout: ContentOnlyLayout },
            { path: publicRoutes.checkout, comp: Login, layout: ContentOnlyLayout },
            { path: publicRoutes.login, comp: Login, layout: ContentOnlyLayout },
            { path: publicRoutes.register, comp: Register, layout: ContentOnlyLayout },
            { path: publicRoutes.forgotpassword, comp: ForgotPassword, layout: ContentOnlyLayout },
            { path: publicRoutes.resetPassword, comp: ResetPass, layout: ContentOnlyLayout },
            { path: publicRoutes.notfoundpage, comp: NotFoundPage },
        ];
}

function PrivateRoutes() {
    const privateRoutes = {
        home: '/',
        usermanage: '/manage/user',
        menumanage: '/manage/menu',
        catalogmanage: '/manage/catalog',
        contentmanage: '/manage/a',
        ordermanage: '/manage/b',
        profile: '/profile',
        notfoundpage: '*',
    };
    return [
        // { path: routes.login, comp: Login, layout: ContentOnlyLayout },
        // { path: routes.home, comp: Home },
        // { path: routes.menu, comp: Menu },
        // { path: routes.home, comp: Home, layout: ManageLayout },
        { path: routes.menu, comp: Menu, layout: ManageLayout },
        { path: routes.detail, comp: Detail, layout: ManageLayout },
        { path: privateRoutes.profile, comp: Profile },
        { path: privateRoutes.home, comp: Manage, layout: ManageLayout },
        { path: privateRoutes.usermanage, comp: UserManage, layout: ManageLayout },
        { path: privateRoutes.menumanage, comp: MenuManage, layout: ManageLayout },
        { path: privateRoutes.catalogmanage, comp: CatalogManage, layout: ManageLayout },
        { path: privateRoutes.contentmanage, comp: ContentManage, layout: ManageLayout },
        { path: privateRoutes.ordermanage, comp: OrderManage, layout: ManageLayout },
        { path: privateRoutes.notfoundpage, comp: BackHome, layout: ManageLayout },
    ];
}

export { PrivateRoutes, PublicRoutes, routes };
