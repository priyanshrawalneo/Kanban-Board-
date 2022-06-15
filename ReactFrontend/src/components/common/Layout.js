import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./Layout.module.css";
import { Button } from "@mui/material";
import { DashboardOutlined, OrderedListOutlined } from "@ant-design/icons";
import { Layout, Menu, PageHeader } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Logout from "../auth/utils/Logout";
const { Content, Sider } = Layout;
const DesignLayout = ({ user }) => {
  const location = useLocation();

  const [activeTab, changeActiveTab] = useState(
    location.pathname === "/" || location.pathname === ""
      ? "/dashboard"
      : location.pathname
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  };

  const items = [
    getItem("Dashboard", "/dashboard", <DashboardOutlined />),
    getItem("Manage Tasks", "/manage-tasks", <OrderedListOutlined />),
  ];

  return (
    <div>
      {user.username ? (
        <Layout
          style={{
            minHeight: "100vh",
          }}
        >
          <Sider>
            <div className={`logo ${styles.navLogo}`}>
              <h4>Kadbon Board</h4>
            </div>

            <Menu
              theme="dark"
              defaultSelectedKeys={["Dashboard"]}
              mode="inline"
              onClick={(e) => {
                changeActiveTab(e.key);
                navigate(e.key);
              }}
              selectedKeys={[activeTab]}
              items={items}
            ></Menu>
          </Sider>
          <Layout className="site-layout">
            <PageHeader
              style={{ backgroundColor: "#fff" }}
              title={
                <div className={styles.nameAndLogo}>
                  {/* <div id={styles.avatar}></div> */}
                  <img
                    id={styles.avatar}
                    src={`${process.env.REACT_APP_API_URL}/api/auth/getProfilePic?path=${user.profilePic}`}
                  ></img>
                  {/* <div id={styles.avatar}></div> */}
                  <span>{user.name}</span>{" "}
                </div>
              }
              extra={[
                <Button
                  key={"12"}
                  variant="contained"
                  //   disableElevation
                  onClick={() => Logout(dispatch)}
                >
                  Log out
                </Button>,
              ]}
            ></PageHeader>

            <Content
              style={{
                margin: "0 16px",
              }}
            >
              <div
                className="site-layout-background"
                style={{
                  padding: 24,
                  minHeight: 360,
                }}
              >
                {/* {
            getActiveContent(activeTab)
          } */}
                <Outlet />
              </div>
            </Content>
          </Layout>
        </Layout>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default DesignLayout;
