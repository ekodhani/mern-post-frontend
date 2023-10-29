import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function Register() {
  const initValues = {
    username: "",
    password: "",
  };
  const validateSchema = Yup.object().shape({
    username: Yup.string().min(8).max(16).required("Username cannot be empty!"),
    password: Yup.string().min(8).max(16).required("Password cannot be empty!"),
  });
  const onSubmitData = (data) => {
    axios.post("http://localhost:8001/auth", data).then(() => {
      console.log(data);
      alert("Success to Register!");
    });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initValues}
        validationSchema={validateSchema}
        onSubmit={onSubmitData}
      >
        <Form className="formContainer">
          <label>Username</label>
          <Field
            id="inputCreatePost"
            type="text"
            name="username"
            placeholder="Enter username here"
            autoComplete="off"
          />
          <ErrorMessage name="username" component="span" />
          <label>Password</label>
          <Field
            id="inputCreatePost"
            type="password"
            name="password"
            placeholder="Enter password here"
            autoComplete="off"
          />
          <ErrorMessage name="password" component="span" />

          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Register;
