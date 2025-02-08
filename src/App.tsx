
import { IpoChecker } from "./components/Home";
import { LoginForm } from "./components/Login"
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
        <Routes>
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/ipo-status" element= {<IpoChecker/>} />
        </Routes>
    </>
  )
}

export default App
