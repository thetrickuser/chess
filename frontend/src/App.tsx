import './App.css'
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { Landing } from './Landing';
import { Game } from './Game';

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/game' element={<Game />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
