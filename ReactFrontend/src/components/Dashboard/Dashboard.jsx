import React from "react";
import { useEffect, useState } from "react";
import { Row, Col, Card, Alert, Statistic } from "antd";
import axios from "axios";

const Dashboard = ({ user }) => {
  const [summary, changeSummary] = useState([]);

  useEffect(() => {
    console.log("times");
    getTaskSummary();
  }, []);

  const getTaskSummary = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/dashboard/summary`;
      const { data: res } = await axios.post(url, { username: user.username });

      changeSummary(res);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Row>
        <Alert
          style={{ marginBottom: "10px", width: "100%" }}
          message="Summary"
          type="info"
          // closable
          // onClose={onClose}
        />
      </Row>

      <Row gutter={8}>
        {summary.map((obj) => (
          <Col key={obj.title} span={6}>
            <Card>
              <Statistic
                // loading={this.state.loading}
                title={obj.title}
                value={obj.value}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default React.memo(Dashboard);
