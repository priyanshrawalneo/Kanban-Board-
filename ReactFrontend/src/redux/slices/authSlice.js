import { createSlice } from '@reduxjs/toolkit'


const isPresent = JSON.parse(localStorage.getItem('userData'));

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    user:isPresent?isPresent:{}
  },
  reducers: {
    loginUser: (state,action) => {
      state.user=action.payload
    },
    logoutUser: state => {
      state.user={}
    }
  }
})

export const { loginUser,logoutUser } = authSlice.actions
export default authSlice;