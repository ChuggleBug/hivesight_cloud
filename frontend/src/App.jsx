import './App.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Video from './pages/Video.jsx'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import AppHeader from './components/header';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen w-screen">
        <AppHeader />
        <div className="flex-1 pt-15">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/video" element={<Video />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}


export default App
