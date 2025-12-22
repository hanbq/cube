import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './components/home/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/a" element={<Home />} />
        <Route path="/b" element={<div>b</div>} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
