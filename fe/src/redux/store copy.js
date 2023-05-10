import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { authReducer, languageReducer, usersReducer } from './slices';

const persistCommonConfig = {
    storage: storage,
    stateReconciler: autoMergeLevel2,
};

const persistConfig = {
    ...persistCommonConfig,
    key: 'root',
    whitelist: ['auth', 'language'],
    transforms: [
        encryptTransform({
            secretKey: 'my-super-secret-key',
            onError: function (error) {
                // Handle the error.
            },
        }),
    ],
};

const Reducers = combineReducers({
    auth: authReducer,
    users: usersReducer,
    language: languageReducer,
});

const persistedReducer = persistReducer(persistConfig, Reducers);

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
