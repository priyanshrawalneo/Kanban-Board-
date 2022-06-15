import { logoutUser } from "../../../redux/slices/authSlice";

const Logout = (dispatch) => {
        localStorage.removeItem('token')
        localStorage.removeItem('userData');
    dispatch(logoutUser())
    window.location='/login'
}
 
export default Logout;