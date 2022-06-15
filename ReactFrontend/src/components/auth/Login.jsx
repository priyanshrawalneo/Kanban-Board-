import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import styles from "./styles/Login.module.css";
import Signup from "./Signup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./utils/LoadingSpinner";

const usernameError = "Username cannot be blank";
const passwordError = "Password cannot be blank";

const Login = (props) => {
  const [loginUserData, changeLoginUserData] = useState({
    username: "",
    password: "",
  });
  const [errors, changeErrors] = useState({});

  //   signup modal state
  const [showSignupModal, changeShowSignupModal] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  let navigate = useNavigate();

  useEffect(() => {
    if (user.username) {
      return navigate("/");
    }
  });

  // handle onchange of login form fields

  const handleChange = ({ target: input }) => {
    const errorsClone = { ...errors };
    const user = { ...loginUserData };
    if (input.name === "username") {
      !input.value
        ? (errorsClone.username = usernameError)
        : delete errorsClone.username;
    }
    if (input.name === "password") {
      !input.value
        ? (errorsClone.password = passwordError)
        : delete errorsClone.password;
    }
    user[input.name] = input.value;
    changeLoginUserData(user);
    changeErrors(errorsClone);
  };

  //   handle login form submission
  const handleLogin = async () => {
    const errorsClone = { ...errors };
    loginUserData.username.length === 0 &&
      (errorsClone.username = usernameError);
    loginUserData.password.length === 0 &&
      (errorsClone.password = passwordError);
    changeErrors(errorsClone);
    if (
      loginUserData.username.length > 0 &&
      loginUserData.password.length > 0
    ) {
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/auth/login`;
        const { data: res } = await axios.post(url, loginUserData);

        dispatch(loginUser({ token: res.token, userData: res.data }));
        localStorage.setItem("token", res.token);
        localStorage.setItem("userData", JSON.stringify(res.data));
        window.location = "/";
        // history.location.push('/');
      } catch (error) {
        console.log(error.message);
        error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500 &&
          changeErrors({
            username: error.response.data.message,
          });
      }
    }
  };

  //  handle signup form visibility

  const handleCloseSignupModal = () => {
    changeShowSignupModal(false);
  };
  if (user.username) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContainer1}>
        <div className={styles.loginContainer1Heading}>
          <h2>Kanban Board</h2>
        </div>

        <div className={styles.loginContainer1Form}>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { marginBottom: "15px", width: "100%" },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleLogin}
          >
            <TextField
              error={Boolean(errors.username)}
              name="username"
              label="User name"
              value={loginUserData?.username}
              onChange={handleChange}
              helperText={errors.username}
              //   variant="standard"
            />

            <TextField
              error={Boolean(errors.password)}
              name="password"
              label="Password"
              type="password"
              value={loginUserData?.password}
              onChange={handleChange}
              helperText={errors.password}
              //   variant="standard"
            />
            <Button
              className={styles.submitLoginButton}
              variant="contained"
              //   disableElevation
              onClick={handleLogin}
            >
              Log In
            </Button>
          </Box>
          <div className={styles.aroundForgotPassword}>
            <span>Forgotten Password?</span>
          </div>
          <hr></hr>
          <div className={styles.signUpModalButton}>
            <Button
              onClick={() => changeShowSignupModal(true)}
              variant="outlined"
            >
              Signup
            </Button>
          </div>
        </div>
      </div>
      <Signup show={showSignupModal} handleClose={handleCloseSignupModal} />
    </div>
  );
};

export default Login;
