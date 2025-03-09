import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import adminReducer from "./adminSlice";
import { quizzleApi } from "./api";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, adminReducer);

export const store = configureStore({
  reducer: {
    quizzle: persistedReducer,
    [quizzleApi.reducerPath]: quizzleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(quizzleApi.middleware),
});

export const persistor = persistStore(store);
