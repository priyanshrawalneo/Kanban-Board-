import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { schemaObj, schema } from "../../auth/utils/taskFormSchema";
import Joi from "joi";
import axios from "axios";
import styles from "../styles/Dashboard.module.css";
import LoadingSpinner from "../../auth/utils/LoadingSpinner";

const defaultTaskValues = {
  name: "",
  stage: "",
  priority: "",
  deadline: new Date("2022-06-13T21:11:54"),
};

const CreateAndEditTask = ({ show, handleClose, type, editData, user }) => {
  const [myTask, changeMyTask] = useState({ ...defaultTaskValues });
  const [errors, changeErrors] = useState({});
  const [loading, changeLoading] = useState(false);

  useEffect(() => {
    editData.name && changeMyTask(editData);
  }, [editData]);

  const handleChange = ({ target: input }) => {
    const errorsClone = { ...errors };
    const singleSchema = { [input.name]: schema[input.name] };
    const myValue = { [input.name]: input.value };
    const validateInput = Joi.object(singleSchema);

    const { error } = validateInput.validate(myValue, { abortEarly: false });

    if (error) {
      errorsClone[input.name] = error.details[0].message.replaceAll(/\"/g, "");
      changeErrors(errorsClone);
    } else {
      delete errorsClone[input.name];
      changeErrors(errorsClone);
    }

    const task = { ...myTask };
    task[input.name] = input.value;
    changeMyTask(task);
    // changeErrors(errorsClone)
  };

  const handleCloseModal = () => {
    changeErrors({});
    changeMyTask({ ...defaultTaskValues });
    handleClose();
  };

  const handleSave = (type) => {
    console.log(type)
    changeLoading(true);
    const myTaskClone = { ...myTask };
    delete myTaskClone.id;
    delete myTaskClone.username;
    delete myTaskClone.action;
    const { error } = schemaObj.validate(myTaskClone, {
      abortEarly: false,
    });
    if (error) {
      console.log(error)
      const newErrorObj = {};
      error.details.forEach(
        (obj) => (newErrorObj[obj.path[0]] = obj.message.replaceAll(/\"/g, ""))
      );
      changeErrors(newErrorObj);
    } else {
      console.log(type);
      type === "new" && createNewTask();
      type === "edit" && editTask();
    }
  };

  const createNewTask = async () => {
    try {
      myTask.username = user.username;
      myTask.deadline = new Date(myTask.deadline).toDateString();
      const url = `${process.env.REACT_APP_API_URL}/api/dashboard/createTask`;
      const { data: res } = await axios.post(url, myTask);

      handleCloseModal();
      changeLoading(false);
    } catch (error) {
      changeLoading(false);
      console.log(error.message);
    }
  };
  const editTask = async () => {
    myTask.deadline = new Date(myTask.deadline).toDateString();
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/dashboard/editTask`;
      const { data: res } = await axios.post(url, {
        username: user.username,
        taskId: myTask.id,
        obj: myTask,
      });

      handleCloseModal();
      changeLoading(false);
    } catch (error) {
      changeLoading(false);
      console.log(error.message);
    }
  };

  const isDisabled = () => {
    return Boolean(myTask.name) &&
      (Boolean(myTask.stage) || myTask.stage == 0) &&
      Boolean(myTask.priority) &&
      Boolean(myTask.deadline)
      ? false
      : true;
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <Modal
        show={show}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {type === "create" ? "Create New Task" : "Edit Task"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.taskFormContainer}>
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
                  value={myTask.name}
                  onChange={handleChange}
                  helperText={errors.name}
                  //   variant="standard"
                />

                <FormControl style={{ marginBottom: "10px" }} fullWidth>
                  <InputLabel id="demo-simple-select-label">Stage</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="Stage"
                    name="stage"
                    value={myTask.stage}
                    onChange={handleChange}
                    // helperText={errors.stage}
                  >
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <FormControl style={{ marginBottom: "10px" }} fullWidth>
                <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  label="Priority"
                  name="priority"
                  value={myTask.priority}
                  onChange={handleChange}
                  // helperText={errors.priority}
                >
                  <MenuItem value={"High"}>High</MenuItem>
                  <MenuItem value={"Medium"}>Medium</MenuItem>
                  <MenuItem value={"Low"}>Low</MenuItem>
                </Select>
              </FormControl>
              <LocalizationProvider
                style={{ marginBottom: "10px" }}
                dateAdapter={AdapterDateFns}
              >
                <Stack spacing={3}>
                  <DesktopDatePicker
                    label="Date"
                    inputFormat="MM/dd/yyyy"
                    value={myTask.deadline}
                    onChange={(value) =>
                      handleChange({
                        target: { name: "deadline", value: value },
                      })
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>

              <Button
                className={styles.submitTaskButton}
                variant="contained"
                disableElevation
                onClick={() => handleSave(type === "create" ? "new" : "edit")}
                disabled={isDisabled()}
              >
                {type === "create" ? "Create task" : "Save"}
              </Button>
            </Box>
          </div>
        </Modal.Body>
        <Modal.Footer>
 
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateAndEditTask;
