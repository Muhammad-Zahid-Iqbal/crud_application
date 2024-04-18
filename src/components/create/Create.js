import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TextField, Button, Grid, Box, Paper } from "@mui/material";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  age: Yup.number()
    .required("Age is required")
    .positive("Age must be a positive number")
    .integer("Age must be an integer"),
  education: Yup.string().required("Education is required"),
});

const initialValues = {
  name: "",
  age: "",
  education: "",
};

const Create = () => {
  const navigate = useNavigate();

  const handleSubmit = (values, { resetForm }) => {
    axios
      .post("https://6620886e3bf790e070afed2d.mockapi.io/crud", values)
      .then(() => {
        navigate("/read");
      });
    resetForm();
  };

  return (
    <Box sx={{ background: "lightgrey" }}>
      <Grid
        container
        fullWidth
        p={2}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item sm={4} xs={12} margin={"auto"} alignItems={"center"}>
          <Paper sx={{ p: 4 }}>
            <h2
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "2rem",
                background: "lightblue",
                marginBottom: "25px",
              }}
            >
              Insert User Data
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <div>
                    <Field
                      fullWidth
                      as={TextField}
                      sx={{ pb: 2 }}
                      type="text"
                      id="name"
                      name="name"
                      label="Name"
                      error={touched.name && Boolean(errors.name)}
                      helperText={<ErrorMessage name="name" />}
                    />
                  </div>

                  <div>
                    <Field
                      fullWidth
                      sx={{ pb: 2 }}
                      as={TextField}
                      type="number"
                      id="age"
                      name="age"
                      label="Age"
                      error={touched.age && Boolean(errors.age)}
                      helperText={<ErrorMessage name="age" />}
                    />
                  </div>

                  <div>
                    <Field
                      fullWidth
                      sx={{ pb: 2 }}
                      as={TextField}
                      type="text"
                      id="education"
                      name="education"
                      label="Education"
                      error={touched.education && Boolean(errors.education)}
                      helperText={<ErrorMessage name="education" />}
                    />
                  </div>

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Create;
