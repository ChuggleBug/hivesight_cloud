import './App.css'

import Home from './pages/Home.jsx'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AppHeader from './components/header';


function App() {
  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen w-screen">
        <AppHeader />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        </div>
      </Router>
      {/* <AppHeader></AppHeader>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
