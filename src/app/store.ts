import { configureStore, ThunkAction, Action, combineReducers } from "@reduxjs/toolkit";
import listsReducer from "./listsSlice";
import draggingReducer from "./draggingSlice";
import advertisementReducer from "./advertisement";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    lists: listsReducer,
    dragging: draggingReducer,
    ad: advertisementReducer
  })
);

export const store = configureStore({
  reducer: persistedReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const persistor = persistStore(store);
