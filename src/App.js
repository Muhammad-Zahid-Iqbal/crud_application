import { Route, Routes } from "react-router-dom";
import Create from "./components/create/Create";
import Read from "./components/read/Read";

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Create/>}></Route>
      <Route path="/read" element={<Read/>}></Route>
    </Routes>
     
     
    </>
  );
}

export default App;
