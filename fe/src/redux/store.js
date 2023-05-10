import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { authReducer, languageReducer, usersReducer, cartItemReducer, orderItemsReducer } from './slices';
import CryptoJS from 'crypto-js';
import createTransform from 'redux-persist/es/createTransform';

const encryptAuthToken = (token) => {
    if (!token || typeof token !== 'string') {
        return token;
    }
    const encryptedAuthToken = CryptoJS.AES.encrypt(token, process.env.REACT_APP_SECRET_KEY).toString();

    return encryptedAuthToken;
};

const decryptAuthToken = (encryptedAuthToken) => {
    if (!encryptedAuthToken || typeof encryptedAuthToken !== 'string') {
        return encryptedAuthToken;
    }
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedAuthToken, process.env.REACT_APP_SECRET_KEY);
    const decryptedAuthToken = decryptedBytes.toString(CryptoJS.enc.Utf8);

    return decryptedAuthToken;
};

const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['auth', 'language', 'orderItems'],
    transforms: [
        createTransform(
            (inboundState, key) => {
                if (key === 'auth' && inboundState) {
                    const { token, ...rest } = inboundState;
                    const encryptedAuthToken = encryptAuthToken(token);
                    return { token: encryptedAuthToken, ...rest };
                }
                return inboundState;
            },
            (outboundState, key) => {
                if (key === 'auth' && outboundState) {
                    const { token, ...rest } = outboundState;
                    const decryptedAuthToken = decryptAuthToken(token);
                    return { token: decryptedAuthToken, ...rest };
                }
                return outboundState;
            },
        ),
    ],
};

const reducers = combineReducers({
    auth: authReducer,
    users: usersReducer,
    language: languageReducer,
    cartItems: cartItemReducer,
    orderItems: orderItemsReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
