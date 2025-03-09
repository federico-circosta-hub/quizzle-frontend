import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./ui/pages/admin/Login";
import AdminAppContainer from "./ui/pages/AdminAppContainer";
import App from "./App";
import useAuthRedirect from "./hooks/useAuthRedirect";
import Questions from "./ui/pages/admin/Questions";
import ChallengerQuestions from "./ui/pages/challenger/Questions";
import Scores from "./ui/pages/Scores";
import Challengers from "./ui/pages/admin/Challengers";
import ChallengerAppContainer from "./ui/pages/ChallengerAppContainer";

function AppRoutes() {
  useAuthRedirect();

  return (
    <App>
      <Routes>
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminAppContainer />}>
          <Route path="/admin/dashboard/questions" element={<Questions />} />
          <Route path="/admin/dashboard/scores" element={<Scores />} />
          <Route
            path="/admin/dashboard/challengers"
            element={<Challengers />}
          />
        </Route>

        <Route
          path="/challenger/:name/:id"
          element={<ChallengerAppContainer />}
        >
          <Route path="/challenger/:name/:id/scores" element={<Scores />} />
          <Route
            path="/challenger/:name/:id/questions"
            element={<ChallengerQuestions />}
          />
        </Route>
      </Routes>
    </App>
  );
}

export default AppRoutes;
