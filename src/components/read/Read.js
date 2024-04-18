import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Grid, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Modal from "@mui/material/Modal";
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Read = () => {
  const [userData, setUserData] = useState();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userModalId, setUserModalId] = useState(null);
  const [rowData, setRowData] = useState(null);


  console.log("userModalId", userModalId);
  console.log("userData", userData);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    if (selectedUserId) {
      try {
        await axios.delete(
          `https://6620886e3bf790e070afed2d.mockapi.io/crud/${selectedUserId}`
        );
        GetData(); // Refresh data after successful deletion
        setOpen(false); // Close the dialog
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleCloseModal = () => setOpen(false);
  const handleOpen = (id) => {
    setUserModalId(id);
    const rowToEdit = userData?.find((row) => row.id === id);
    setRowData(rowToEdit);
    setOpenModal(true);
};
  const columns = [
    {
      field: "index",
      headerName: "#",
      width: 80,
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: true,
    },
    {
      field: "age",
      headerName: "Age",
      width: 100,
      editable: true,
    },
    {
      field: "education",
      headerName: "Education",
      width: 150,
    },

    {
      field: "update",
      headerName: "Update",
      width: 80,
      renderCell: (params) => (
        <EditIcon
          onClick={() => {
            handleOpen(params.row.id);
            setOpenModal(true);
          }}
          style={{ cursor: "pointer", color: "green" }}
        />
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 200,
      renderCell: (params) => (
        <DeleteIcon
          onClick={() => {
            setSelectedUserId(params.row.id);
            setOpen(true);
          }}
          style={{ cursor: "pointer", color: "red" }}
        />
      ),
    },
  ];

  const GetData = async () => {
    await axios
      .get("https://6620886e3bf790e070afed2d.mockapi.io/crud")
      .then((response) => {
        console.log("response", response?.data);
        const processedData = response?.data?.map((row, index) => ({
          ...row,
          index: index + 1,
          // id: row?.userid
        }));
        setUserData(processedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    GetData();
  }, []);

  const handleUpdate = (values) => {
     axios.put(
        `https://6620886e3bf790e070afed2d.mockapi.io/crud/${userModalId}`, values 
      )
    .then(()=>{
        navigate('/read')
        setOpenModal(false);
        GetData();
    })
  };

  if (!userData) {
    return null; // or loading indicator
  }
  return (
    <Box sx={{ background: "grey" }}>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={handleClose}>No</Button>
        </DialogActions>
      </Dialog>
      <Grid
        container
        fullWidth
        p={2}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item sm={8} xs={12} margin={"auto"} alignItems={"center"}>
          <h2
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "2rem",
              background: "lightblue",
            }}
          >
            User Data
          </h2>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 1,
              background: "#fff",
            }}
          >
            <Button variant="contained" onClick={() => navigate("/")}>
              Create User Data
            </Button>
          </Box>
          <DataGrid
            sx={{ background: "white" }}
            rows={userData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
          />
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
            <CloseIcon sx={{float:"right", cursor:"pointer"}} onClick={() =>setOpenModal(false)}/>

            <Grid
              container
              fullWidth
              p={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item sm={12} xs={12} margin={"auto"} alignItems={"center"}>
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
                  initialValues={{
                    name: rowData?.name,
                    age: rowData?.age,
                    education: rowData?.education,
                  }}
                  // validationSchema={validationSchema}
                  onSubmit={(values) => handleUpdate(values)}
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
                        Update
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Grid>
            </Grid>
            </Box>
            
          </Modal>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Read;
