import Navbar from "./components/Navbar";
import AuthPage from "./pages/Auth";
import Contests from "./pages/Contests";
import Problems from "./pages/Problems";
import Problem from "./pages/Problem";
import { Routes, Route } from "react-router-dom";
import Signin from "./pages/SignIn";
import Signup from "./pages/SignUp";
import Profile from "./pages/Profile";
import Description from "./pages/Description";
import MySubmissions from "./pages/MySubmissions";
import AllSubmissions from "./pages/AllSubmissions"
import Discussion from "./pages/Discussion";
import Submission from "./pages/Submission";
import Home from './pages/Home'
function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/auth" element={<AuthPage />} >
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/problems/:slug" element={<Problem />}>
          <Route index element={<Description />} />
          <Route path="mySubmissions" element={<MySubmissions />} />
          <Route path="allSubmissions" element={<AllSubmissions />} />
          <Route path="discussion" element={<Discussion />} />
        </Route>
        <Route path="/submission/:submissionId" element={<Submission />} />

      </Routes>
    </div>
  );
}

export default App;
