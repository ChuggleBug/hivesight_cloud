import './App.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import AppHeader from './components/header';

function App() {

  return (
    <Router>
        <div className="flex flex-col h-screen w-screen">
          <AppHeader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>

  )
}

export default App
