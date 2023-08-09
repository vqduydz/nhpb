import {
  BackHome,
  Bill,
  BookingManage,
  BookingsManage,
  Cart,
  CatalogManage,
  CheckOut,
  Detail,
  ForgotPassword,
  Home,
  Login,
  Menu,
  MenuManage,
  NotFoundPage,
  Order,
  OrderManage,
  Orders,
  OrdersManage,
  Profile,
  Register,
  ResetPass,
  Test,
  UserManage,
} from '_/components/pages';
import { ContentOnlyLayout, ManageLayout } from '_/layouts';
import { selector } from '_/redux/selector';
import { useSelector } from 'react-redux';

const routes = {
  home: '/',
  menu: '/thuc-don',
  detail: '/mon-an',
  cart: '/cart',
  checkout: '/checkout',
  orders: '/order',
  test: '/test',
  login: '/login',
  register: '/register',
  manage: '/',
  usermanage: '/usermanage',
  menumanage: '/menumanage',
  catalogmanage: '/catalogmanage',
  ordersmanage: '/ordermanage',
  bookingmanage: '/bookingmanage',
  bill: '/bill',
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
    orders: '/order',
    order: '/order/:order_code',
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
      { path: publicRoutes.orders, comp: Orders },
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
      { path: publicRoutes.orders, comp: BackHome },
      { path: publicRoutes.order, comp: BackHome },
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
    home: '/usermanage',
    usermanage: '/usermanage',
    menumanage: '/menumanage',
    catalogmanage: '/catalogmanage',
    ordersmanage: '/ordermanage',
    ordermanage: '/ordermanage/:order_code',
    bookingsmanage: '/bookingmanage',
    bookingmanage: '/bookingmanage/:booking_code',
    profile: '/profile',
    detail: '/mon-an/:slug',
    bill: '/bill/:order_code',

    notfoundpage: '*',
  };
  return [
    { path: routes.login, comp: Login, layout: ContentOnlyLayout },
    { path: routes.menu, comp: Menu, layout: ManageLayout },
    { path: privateRoutes.detail, comp: Detail, layout: ManageLayout },
    { path: privateRoutes.bill, comp: Bill, layout: ContentOnlyLayout },
    { path: privateRoutes.profile, comp: Profile },
    { path: privateRoutes.home, comp: UserManage, layout: ManageLayout },
    { path: privateRoutes.usermanage, comp: UserManage, layout: ManageLayout },
    { path: privateRoutes.menumanage, comp: MenuManage, layout: ManageLayout },
    { path: privateRoutes.catalogmanage, comp: CatalogManage, layout: ManageLayout },
    { path: privateRoutes.ordersmanage, comp: OrdersManage, layout: ManageLayout },
    { path: privateRoutes.bookingsmanage, comp: BookingsManage, layout: ManageLayout },
    { path: privateRoutes.ordermanage, comp: OrderManage, layout: ManageLayout },
    { path: privateRoutes.bookingmanage, comp: BookingManage, layout: ManageLayout },
    { path: privateRoutes.notfoundpage, comp: BackHome },
  ];
}

export { PrivateRoutes, PublicRoutes, routes };
