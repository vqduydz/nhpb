import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { currentUserReducer, usersReducer } from './slices';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistCommonConfig = {
    storage: storage,
    stateReconciler: autoMergeLevel2,
};

const persistConfig = {
    ...persistCommonConfig,
    key: 'currentUser',
    version: 1,
    whiteList: ['currentUser'],
    // blacklist: ['users'],
};
const reducers = combineReducers({
    users: usersReducer,
    currentUser: currentUserReducer,
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

export let persistor = persistStore({ ...store });
