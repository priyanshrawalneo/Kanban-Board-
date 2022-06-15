import { Button, Card, Dropdown, Menu, Table, Space } from "antd";
import axios from "axios";
import React from 'react';

import { useEffect, useState } from "react";
import CreateAndEditTask from "./components/TaskForm";
import { EllipsisOutlined } from "@ant-design/icons";
import styles from './styles/Dashboard.module.css'



const ManageTasks = ({ user }) => {
  const dragMeRef = React.useRef();
  const [allTasks, changeAllTasks] = useState([]);
  const [loading, changeLoading] = useState(false);

  const [showTaskModal, changeShowTaskModal] = useState(false);
  const [formType, changeFormType] = useState("create");
  const [selectedTask, changeSelectedTask] = useState({});


 
  useEffect(() => {
    getAllTasks();
    // document.addEventListener('mousedown',onMouseDown);
    // return ()=>{
    //   document.removeEventListener('mousedown',onMouseDown)
    // }
   
}, []);



// const onMouseDown=(e)=>{
// console.log(e);

// }














  const handleCloseTaskModal = () => {
    changeShowTaskModal(false);
    changeSelectedTask({});
    getAllTasks();
  };


  const updateAllTasks=(data)=>{
      // data.forEach((obj)=>obj.action=obj)
      // console.log(data)
      changeAllTasks(data);
  }

  const getAllTasks = async () => {
    changeLoading(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/dashboard/getAllTasks`;
      const { data: res } = await axios.post(url, { username: user.username });
     
   
      updateAllTasks(res)
   
      changeLoading(false);
    } catch (error) {
      changeLoading(false);
      console.log(error.message);
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
    },

    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
    },

    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
    },
    {
      title: "Action",
      key: "action",
      render: (action) => (
        <>
          <Dropdown
            key="more"
            overlay={
              <Menu>
                {action.stage > 0 && (
                  <Menu.Item
                    onClick={() => handleTaskStageUpdate("back", action)}
                  >
                    Back
                  </Menu.Item>
                )}
                {action.stage < 3 && (
                  <Menu.Item
                    onClick={() =>
                      handleTaskStageUpdate("forward", action)
                    }
                  >
                    Forward
                  </Menu.Item>
                )}
                <Menu.Item onClick={() => handleTaskEdit(action)}>
                  Edit
                </Menu.Item>
                <Menu.Item onClick={() => handleTaskDelete(action.id)}>
                  Delete
                </Menu.Item>
              </Menu>
            }
          >
            <Button
              style={{
                border: "none",
                padding: 0,
              }}
            >
              <EllipsisOutlined
                style={{
                  fontSize: 20,
                  verticalAlign: "top",
                }}
              />
            </Button>
          </Dropdown>
        </>
      ),
    },
  ];

  const handleTaskStageUpdate = async (type, task) => {
    changeLoading(true);
    if (type === "back") {
      task.stage = task.stage - 1;
    }
    if (type === "forward") {
      task.stage = task.stage + 1;
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/api/dashboard/editTask`;
      const { data: res } = await axios.post(url, {
        username: user.username,
        taskId: task.id,
        obj:task,
      });
  
      updateAllTasks(res.filtered)
    
      changeLoading(false);
    } catch (error) {
      changeLoading(false);
      console.log(error.message);
    }
  };
  const handleTaskEdit = async (task) => {
     
    changeFormType("edit");
    changeSelectedTask(task);
    changeShowTaskModal(true);
  };

  const handleTaskDelete = async (taskId) => {

    try {
      const url = `${process.env.REACT_APP_API_URL}/api/dashboard/deleteTask`;
      const { data: res } = await axios.post(url, {
        username: user.username,
        taskId,
      });
  
      updateAllTasks(res.filtered)
 
      changeLoading(false);
    } catch (error) {
      changeLoading(false);
      console.log(error.message);
    }
  };

  const handleCreateNewTask = () => {
    changeFormType("create");
    changeSelectedTask({});
    changeShowTaskModal(true);
  };

  return (
    <>
      <Card>
      <Space style={{ }}>
     <h5>All Tasks</h5>
        </Space>
        <Space style={{ float: "right",marginBottom: "10px"  }}>
          <Button type="primary" onClick={handleCreateNewTask}>
            Create New Task
          </Button>
        </Space>
        <Table
          loading={loading}
          columns={columns}
          dataSource={allTasks}
          rowKey="Ids"
        />
      </Card>
      
      <CreateAndEditTask
        handleClose={handleCloseTaskModal}
        show={showTaskModal}
        type={formType}
        editData={selectedTask}
        user={user}
      />
    </>
  );
};

export default ManageTasks;
