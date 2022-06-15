import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import NoMatch from "./utils/NoMatch";
import { useSelector } from "react-redux";
import LoadingSpinner from "./components/auth/utils/LoadingSpinner";

const Login = React.lazy(() => import("./components/auth/Login"));
const DesignLayout = React.lazy(() => import("./components/common/Layout"));
const Dashboard = React.lazy(() => import("./components/Dashboard/Dashboard"));
const ManageTasks = React.lazy(() =>
  import("./components/Dashboard/ManageTasks")
);

function App() {
  const user = useSelector((state) => state.user);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<DesignLayout user={user} />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-tasks"
            element={
              <ProtectedRoute>
                <ManageTasks user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login user={user} />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
