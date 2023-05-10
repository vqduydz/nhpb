import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import * as userAPI from '_/services/api/userApi';
import * as menuAPI from '_/services/api/menuApi';
import * as catalogAPI from '_/services/api/catalogApi';
import * as cartItemAPI from '_/services/api/cartItemApi';

// order

export const orderSlice = createSlice({
    name: 'orderItems',
    initialState: { orderItems: [] },
    reducers: {
        getOrderItems: (state, action) => {
            state.orderItems = action.payload;
        },
        delOrderItems: (state) => {
            state.orderItems = [];
        },
    },
});
export const { getOrderItems, delOrderItems } = orderSlice.actions;
const { reducer: orderItemsReducer } = orderSlice;
export { orderItemsReducer };

// cart item

export const getCartItem = createAsyncThunk('getCartItem', async (user_id, thunkAPI) => {
    try {
        const res = await cartItemAPI.getCartItemApi(user_id);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const handleAddToCart = createAsyncThunk('handleAddToCart', async (cartItem, thunkAPI) => {
    try {
        const res = await cartItemAPI.handleAddToCartApi(cartItem);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const updateCartItem = createAsyncThunk('updateCartItem', async (updateData, thunkAPI) => {
    try {
        const res = await cartItemAPI.updateCartItemApi(updateData);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const deleteCartItem = createAsyncThunk('deleteCartItem', async (id, thunkAPI) => {
    try {
        const res = await cartItemAPI.deleteCartItemApi(id);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const cartItemSlice = createSlice({
    name: 'cartItem',
    initialState: { cartItems: [], loading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase('getCartItem', (state, action) => {
                return (state.cartItems = action.payload.data);
            })
            .addCase('addToCart', (state, action) => {
                return (state.cartItems = action.payload);
            })
            .addCase('updateCartItem', (state, action) => {
                return (state.cartItems = action.payload);
            })
            .addCase('deleteCartItem', (state, action) => {
                return (state.cartItems = action.payload);
            });
    },
});
const { reducer: cartItemReducer } = cartItemSlice;
export { cartItemReducer };

// catalog
export const getCatalog = createAsyncThunk('getCatalog', async (params, thunkAPI) => {
    try {
        const res = await catalogAPI.catalogApi(params);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const catalogSlice = createSlice({
    name: 'catalogs',
    initialState: {
        user: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase('getCatalog', (state, action) => {
                return (state.user = action.payload.data);
            })
            .addCase('createNewMenu', (state, action) => {
                return (state.user = action.payload);
            })
            .addCase('updateMenu', (state, action) => {
                return (state.user = action.payload);
            })
            .addCase('deleteMenu', (state, action) => {
                return (state.user = action.payload);
            });
    },
});
const { reducer: catalogsReducer } = catalogSlice;
export { catalogsReducer };

// menu
export const getMenu = createAsyncThunk('getMenu', async (params, thunkAPI) => {
    try {
        const res = await menuAPI.menuApi(params);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const createNewMenu = createAsyncThunk('createNewMenu', async (dataMenu, thunkAPI) => {
    try {
        const res = await menuAPI.createNewMenuApi(dataMenu);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});
export const updateMenu = createAsyncThunk('updateMenu', async (updateData, thunkAPI) => {
    try {
        const res = await menuAPI.updateMenuApi(updateData);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});
export const deleteMenu = createAsyncThunk('deleteMenu', async (id, thunkAPI) => {
    try {
        const res = await menuAPI.deleteMenuApi(id);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const menusSlice = createSlice({
    name: 'menus',
    initialState: {
        user: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase('getMenu', (state, action) => {
                return (state.user = action.payload.data);
            })
            .addCase('createNewMenu', (state, action) => {
                return (state.user = action.payload);
            })
            .addCase('updateMenu', (state, action) => {
                return (state.user = action.payload);
            })
            .addCase('deleteMenu', (state, action) => {
                return (state.user = action.payload);
            });
    },
});
const { reducer: menusReducer } = menusSlice;
export { menusReducer };

// get user
export const getUser = createAsyncThunk('getUser', async (params, thunkAPI) => {
    try {
        const res = await userAPI.userApi(params);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const createNewUser = createAsyncThunk('createNewUser', async (dataUser, thunkAPI) => {
    try {
        const res = await userAPI.createNewUserApi(dataUser);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});
export const updateUser = createAsyncThunk('updateUser', async (updateData, thunkAPI) => {
    try {
        const res = await userAPI.updateUserApi(updateData);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});
export const deleteUser = createAsyncThunk('deleteUser', async (id, thunkAPI) => {
    try {
        const res = await userAPI.deleteUserApi(id);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        user: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase('getUser', (state, action) => {
                return (state.user = action.payload.data);
            })
            .addCase('createNewUser', (state, action) => {
                return (state.user = action.payload);
            })
            .addCase('updateUser', (state, action) => {
                return (state.user = action.payload);
            })
            .addCase('deleteUser', (state, action) => {
                return (state.user = action.payload);
            });
    },
});
const { reducer: usersReducer } = usersSlice;
export { usersReducer };

// auth

export const getToken = createAsyncThunk('user/gettoken', async (loginInfo, thunkAPI) => {
    try {
        const url = `${process.env.REACT_APP_API_ENDPOINT}/gettoken`;
        const response = await axios.post(url, loginInfo);
        const res = response.data;
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const login = createAsyncThunk('user/login', async (token, thunkAPI) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    try {
        const url = `${process.env.REACT_APP_API_ENDPOINT}/login`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        error: null,
        currentUser: null,
    },
    reducers: {
        logout(state) {
            state.token = null;
            state.error = null;
            state.currentUser = null;
        },
        loginError(state, action) {
            state.token = null;
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getToken.fulfilled, (state, action) => {
            state.token = action.payload.token;
            state.error = null;
        });
        builder.addCase(getToken.rejected, (state, action) => {
            state.token = null;
            state.error = action.payload.error;
        });

        builder.addCase(login.fulfilled, (state, action) => {
            state.currentUser = action.payload.currentUser;
            state.error = null;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.currentUser = null;
            state.error = action.payload.errorMessage;
        });
    },
});

export const { logout } = authSlice.actions;
const { reducer: authReducer } = authSlice;
export { authReducer };

// Languages

export const languageSlice = createSlice({
    name: 'language',
    initialState: { language: 'vi' },
    reducers: {
        changeLanguage: (state, action) => {
            state.language = action.payload;
        },
    },
});
export const { changeLanguage } = languageSlice.actions;
const { reducer: languageReducer } = languageSlice;
export { languageReducer };

/////// Cart
