import { unwrapResult } from '@reduxjs/toolkit';
import { selector } from '_/redux/selector';
import { changeLanguage, getCartItem, handleAddToCart, login, logout } from '_/redux/slices';
import { en, vi } from '_/utills/translations';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useThemMui } from './ThemeMuiContext';

const AuthContext = createContext({
  socket: null,
  token: null,
  text: null,
  currentUser: null,
  language: '',
  handleChangeLanguage: () => {},
  // Snackbar noti
  snackbar: null,
  setSnackbar: () => {},
  handleCloseSnackbar: () => {},
  //cart
  cartItems: [],
  handleGetCartItem: () => {},
  addToCart: () => {},
  // cart item
  orderItems: null,
});

export const useAuth = () => useContext(AuthContext);

function AuthContextProvider({ children }) {
  const dispatch = useDispatch();
  const [text, setText] = useState(vi);
  const [cartItems, setCartItems] = useState([]);
  const { currentUser, language, token, orderItems } = useSelector(selector.globalStates);
  const { setLoading, loading } = useThemMui();
  const [snackbar, setSnackbar] = useState({ open: false });

  // language
  useEffect(() => {
    if (language === 'vi') setText(vi);
    else if (language === 'en') setText(en);
  }, [language]);

  useEffect(() => {
    if (!token) return;
    dispatch(login(token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChangeLanguage = async (languageCode) => {
    dispatch(changeLanguage(languageCode));
  };

  // Snackbar noti

  const handleCloseSnackbar = (status) => {
    setSnackbar({ open: false, message: '', status });
  };

  // auth

  const socket = io(process.env.REACT_APP_BACKEND_URL, {
    transports: ['websocket'],
    // cors: {
    //     origin: '*',
    //     methods: ['GET', 'POST'],
    //     allowedHeaders: ['my-custom-header'],
    //     credentials: true,
    // },
  });

  // currentUser nhận được sau khi giải mã JWT lưu ở local storage
  if (currentUser) {
    const userEmail = currentUser.email;
    socket.emit('checkAvailableUser', userEmail);
  }

  socket.on('connection', () => {});
  socket.on('forceLogout', (userEmail) => {
    if (currentUser.email) {
      if (currentUser.email === userEmail) {
        dispatch(logout());
      }
    }
  });

  socket.on('logoutUser', (userId) => {
    if (currentUser.id) {
      if (currentUser.id === userId) {
        dispatch(logout());
      }
    }
  });

  ///////// cart ------------
  const handleGetCartItem = (customer_id) => {
    dispatch(getCartItem(customer_id))
      .then(unwrapResult)
      .then((res) => {
        const cartItems = res.map((item) => {
          const { menu, id, customer_id, menu_id, quantity } = item;
          const { id: _, ...menu_info } = menu;
          const cartItem = { id, customer_id, menu_id, quantity, ...menu_info };
          return cartItem;
        });
        setCartItems(cartItems);
      })
      .catch((error) => {
        setCartItems([]);
      });
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'Customer') {
      setCartItems([]);
      return;
    } else {
      handleGetCartItem(currentUser.id);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, loading]);

  // add cart item

  const addToCart = (cartItem) => {
    setLoading(true);
    dispatch(handleAddToCart(cartItem))
      .then(unwrapResult)
      .then((res) => {
        setLoading(false);
        setSnackbar({ open: true, message: res.message, status: 'success' });
        handleGetCartItem(currentUser.id);
      })
      .catch((error) => {
        setLoading(false);
        setSnackbar({ open: true, message: error.errorMessage, status: 'error' });
      });
  };

  const value = {
    socket,
    token,
    text,
    currentUser,
    language,
    handleChangeLanguage,
    // Snackbar noti
    snackbar,
    setSnackbar,
    handleCloseSnackbar,
    // cart
    cartItems,
    handleGetCartItem,
    // add to cart
    addToCart,
    orderItems,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
