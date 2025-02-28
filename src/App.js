import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";
import './App.css';
import { Navbar } from "./components/Navbar";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { Signuppage } from "./Auth/Signup"
import  Login  from "./Auth/Login";
import NoteState from "./context/notes/NoteState";
import { AddNote } from "./components/AddNote";
import { Users } from "./components/Admin/Users";
import { Contacts } from "./components/Admin/Contacts";
import { EditUser } from "./components/Admin/EditUser";
import { AdminHome } from "./components/Admin/AdminHome";
import { Groups } from "./components/Admin/Groups";
import GroupContact from "./components/Admin/GroupContact";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  return (
    <>
      <NoteState>
        <Router>
            <ToastContainer position="top-right" autoClose={5000} />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/addnote" element={<AddNote />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signuppage />}></Route>
            <Route path="/group" element={<Groups />} />
            <Route path="/group/contact/:id" element={<GroupContact />} />

            {/* Admin Route */}
            <Route path="/admin" element={<AdminHome />} /> 
            <Route path="/admin/userlist" element={<Users />}></Route>
            <Route path="/admin/contact/:id" element={<Contacts />}></Route>
            <Route path="/admin/edituser/:id" element={<EditUser />} />

          </Routes>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
