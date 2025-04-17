import {createSlice} from "@reduxjs/toolkit"

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile:null,
        selectedUser:null,
       followingUser:[],
    },
    reducers:{
       
        setAuthUser:(state,action) => {
            state.user = action.payload;
        },
        setSuggestedUsers:(state,action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile:(state,action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser:(state,action) => {
            state.selectedUser = action.payload;
        },
        removesuggestedUsers:(state,action)=>{
            state.suggestedUsers = state.suggestedUsers.filter(user => user.id !== action.payload);
        }, 
        setFollowingUser:(state,action) => {
            state.followingUser = action.payload;
        },
    }
});
export const {
    setAuthUser, 
    setSuggestedUsers, 
    setUserProfile,
    setSelectedUser,
    removesuggestedUsers,
    setFollowingUser,
} = authSlice.actions;
export default authSlice.reducer;