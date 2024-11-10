import { configureStore } from '@reduxjs/toolkit'
import { friendsSlice } from './features/Messagiere/mesgSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add reducers here
      // Example:
      friends: friendsSlice.reducer,
      // messages: messagesSlice.reducer,
      // // Add more reducers as needed
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']