import React, { useEffect, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";

function CreatePost() {
  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, []);

  const initValues = {
    title: "",
    postText: "",
    username: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title cannot be empty!"),
    postText: Yup.string().required("Post text cannot be empty!"),
  });

  const onSubmitForm = (data) => {
    axios
      .post("http://localhost:8001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        console.log(response.data);
        alert("New Post is created successfully!");
        history.push("/");
      });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initValues}
        onSubmit={onSubmitForm}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title</label>
          <Field
            id="inputCreatePost"
            name="title"
            placeholder="Please enter title here"
            autoComplete="off"
          />
          <ErrorMessage name="title" component="span" />
          <label>Post</label>
          <Field
            id="inputCreatePost"
            name="postText"
            placeholder="Please enter post text here"
            autoComplete="off"
          />
          <ErrorMessage name="postText" component="span" />

          <button type="submit">Create Post</button>
          <button type="reset">Clear Text</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
