import { configureStore } from '@reduxjs/toolkit'
import { friendsSlice } from './features/Messagiere/mesgSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      friends: friendsSlice.reducer,
      // Add more reducers as needed
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: ['friends.friends'], // Specify the path to ignore
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']