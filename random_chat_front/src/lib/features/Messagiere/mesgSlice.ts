import { friendWithRoom } from '@/app/Messenger/page'
import { RootState } from '@/lib/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// In your application's entrypoint
import {enableMapSet} from "immer"

enableMapSet()

// ...later

// Define a type for the slice state
interface FriendsWithRoomState {
    friend: friendWithRoom | null
}

// Initial state
const initialState: FriendsWithRoomState = {
    friend: null,

}

export const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setFriend: (state, action: PayloadAction<friendWithRoom>) => {
      state.friend = action.payload
      
    }
    
  }
})

export const { setFriend } = friendsSlice.actions

// Selector to access friends data in components
export const selectFriends = (state: RootState) => state.friends.friend
export default friendsSlice.reducer
