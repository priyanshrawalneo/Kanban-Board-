import React from 'react';
import { Modal } from "react-bootstrap";
import Box from "@mui/material/Box";
import { TextField, Button } from "@mui/material";
import styles from "./styles/Signup.module.css";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { schema, schemaObj } from "./utils/SignupSchema";
import "react-phone-number-input/style.css";
import Joi from "joi";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";



const defaultRegisterValues = {
  name: "",
  username: "",
  email: "",
  contact_number: "",
  password: "",
};
const Signup = ({ show, handleClose, history }) => {
  const [registerUser, changeRegisterUser] = useState({
    ...defaultRegisterValues,
  });

  const [profilePic, changeProfilePic] = useState(null);
  const [errors, changeErrors] = useState({});
  const profilePicRef = React.useRef();

  const dispatch = useDispatch();

  // profile picture upload validation 
  const handleProfilePicChange = ({ currentTarget: input }) => {
    const isValid = input.files[0].type.indexOf("image");
    const errorsClone = { ...errors };
    delete errorsClone.profilePicError;
    if (isValid === 0) {
      changeErrors(errorsClone);
      return changeProfilePic(input.files[0]);
    } else {
      profilePicRef.current.value = "";
      errorsClone.profilePicError = true;
      changeErrors(errorsClone);
    }
    changeErrors(errorsClone);
  };


  // form fileds onchange 

  const handleChange = ({ target: input }) => {
    const errorsClone = { ...errors };
    if (input.name !== "contact_number") {
      const singleSchema = { [input.name]: schema[input.name] };
      const myValue = { [input.name]: input.value };
      const validateInput = Joi.object(singleSchema);

      const { error } = validateInput.validate(myValue, { abortEarly: false });
      console.log(error);
      if (error) {
        errorsClone[input.name] = error.details[0].message.replaceAll(
          /\"/g,
          ""
        );
        changeErrors(errorsClone);
      } else {
        delete errorsClone[input.name];
        changeErrors(errorsClone);
      }
    }

    const user = { ...registerUser };
    user[input.name] = input.value;
    changeRegisterUser(user);
    // changeErrors(errorsClone)
  };

  const handleSignup = async () => {
    const registerUserClone = { ...registerUser };
    delete registerUserClone.contact_number;
    const { error } = schemaObj.validate(registerUserClone, {
      abortEarly: false,
    });

    if (error || !profilePic) {
      const newErrorObj = {};
      if (!profilePic) {
        newErrorObj.profilePicError = true;
      }
      if (error) {
        error.details.forEach(
          (obj) =>
            (newErrorObj[obj.path[0]] = obj.message.replaceAll(/\"/g, ""))
        );
      }

      changeErrors(newErrorObj);
    } else {
      const formData = new FormData();

      formData.append("name", registerUser.name);
      formData.append("username", registerUser.username);
      formData.append("email", registerUser.email);
      formData.append("contact_no", registerUser.contact_number);
      formData.append("password", registerUser.password);
      formData.append("profilePic", profilePic);

      const headers = { "Content-Type": "multipart/form-data" };

      try {
        const url = `${process.env.REACT_APP_API_URL}/api/auth/register`;
        const { data: res } = await axios.post(url, formData, { headers });
        dispatch(loginUser({ token: res.token, userData: res.data }));
        localStorage.setItem("token", res.token);
        localStorage.setItem("userData", JSON.stringify(res.data));
        window.location = "/";
      } catch (error) {
        console.log(error.message);
        error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500 &&
          changeErrors({
            username: error.response.data.message,
            email: error.response.data.message,
          });
      }
    }
  };

  const handleCloseModal = () => {
    changeRegisterUser({ ...defaultRegisterValues });
    changeErrors({});
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create New Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.signUpFormContainer}>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { marginBottom: "15px", width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                error={Boolean(errors.name)}
                name="name"
                label="Name"
                value={registerUser.name}
                onChange={handleChange}
                helperText={errors.name}
                //   variant="standard"
              />

              <TextField
                error={Boolean(errors.username)}
                name="username"
                label="User name"
                value={registerUser.username}
                onChange={handleChange}
                helperText={errors.username}
                //   variant="standard"
              />
            </div>

            <TextField
              error={Boolean(errors.email)}
              name="email"
              label="Email"
              value={registerUser.email}
              onChange={handleChange}
              helperText={errors.email}
              //   variant="standard"
            />

            <TextField
              error={Boolean(errors.password)}
              name="password"
              label="Password"
              type="password"
              value={registerUser?.password}
              onChange={handleChange}
              helperText={errors.password}
              //   variant="standard"
            />

            <PhoneInput
              defaultCountry="IN"
              name="contact_number"
              placeholder="Phone no "
              country={"in"}
              value={registerUser.contact_number}
              onChange={(phone) =>
                handleChange({
                  target: { value: phone, name: "contact_number" },
                })
              }
            />

            <input
              className={`form-control w-100 mt-3  ${
                errors.profilePicError && styles.redBorder
              } `}
              type="file"
              onChange={handleProfilePicChange}
              accept="image/*"
              placeholder="Choose profile picture"
              ref={profilePicRef}
            ></input>
            <Button
              className={styles.submitSignupbutton}
              variant="contained"
              disableElevation
              onClick={handleSignup}
              disabled={Object.keys(errors).length > 0}
            >
              Create new account
            </Button>
          </Box>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button> */}
      </Modal.Footer>
    </Modal>
  );
};

export default Signup;
