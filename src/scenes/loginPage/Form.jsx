import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

// Validation schemas
const registerSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
  location: yup.string().required("Required"),
  occupation: yup.string().required("Required"),
  picture: yup.mixed().required("Required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [loginError, setLoginError] = useState(""); // State for invalid credentials error
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    formData.append("picturePath", values.picture.name);

    try {
      const response = await fetch("https://learnhive-server-1.onrender.com/auth/register", {
        method: "POST",
        body: formData,
      });
      const savedUser = await response.json();
      onSubmitProps.resetForm();

      if (savedUser) setPageType("login");
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const response = await fetch("https://learnhive-server-1.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      onSubmitProps.resetForm();

      if (response.ok) {
        dispatch(setLogin({ user: data.user, token: data.token }));
        navigate("/home");
      } else {
        setLoginError(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    setLoginError(""); // Clear any previous error
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={values.firstName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.firstName && errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={values.lastName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.lastName && errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  name="location"
                  value={values.location}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.location && errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  name="occupation"
                  value={values.occupation}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.occupation && errors.occupation)}
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${theme.palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${theme.palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}
            <TextField
              label="Email"
              name="email"
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              sx={{
                gridColumn: "span 4",
                borderColor: loginError ? "red" : "",
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
              sx={{
                gridColumn: "span 4",
                borderColor: loginError ? "red" : "",
              }}
            />
          </Box>
          {loginError && (
            <Typography color="red" sx={{ mt: "10px", fontSize: "14px" }}>
              {loginError}
            </Typography>
          )}
          <Button
            fullWidth
            type="submit"
            sx={{
              m: "2rem 0",
              p: "1rem",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.background.alt,
              "&:hover": { color: theme.palette.primary.main },
            }}
          >
            {isLogin ? "LOGIN" : "REGISTER"}
          </Button>
          <Typography
            onClick={() => setPageType(isLogin ? "register" : "login")}
            sx={{
              textDecoration: "underline",
              color: theme.palette.primary.main,
              "&:hover": { cursor: "pointer", color: theme.palette.primary.light },
            }}
          >
            {isLogin
              ? "Don't have an account? Sign Up here."
              : "Already have an account? Login here."}
          </Typography>
        </form>
      )}
    </Formik>
  );
};

export default Form;
