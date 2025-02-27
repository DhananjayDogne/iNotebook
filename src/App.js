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


function App() {
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/addnote" element={<AddNote />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signuppage />}></Route>

            {/* Admin Route */}
            <Route path="/admin/userlist" element={<Users />}></Route>
            <Route path="/admin/contact/:id" element={<Contacts />}></Route>

          </Routes>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
