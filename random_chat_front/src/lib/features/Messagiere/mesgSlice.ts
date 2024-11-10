import { friendWithRoom } from '@/app/Messenger/page'
import { RootState } from '@/lib/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface FriendsWithRoomState {
    friends: friendWithRoom[];
}

// Initial state
const initialState: FriendsWithRoomState = {
    friends: []
}

export const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setFriend: (state, action: PayloadAction<friendWithRoom>) => {
        state.friends.push(action.payload)
    }
  }
})

export const { setFriend } = friendsSlice.actions

// Selector to access friends data in components
export const selectFriends = (state: RootState) => state.friends.friends
export default friendsSlice.reducer
