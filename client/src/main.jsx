import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import { Toaster } from "react-hot-toast";



import App from './App.jsx'

createRoot(document.getElementById('root')).render(
     <BrowserRouter>
  <StrictMode>
    <App />
        <Toaster position="top-right" reverseOrder={false} />

  </StrictMode>
 </BrowserRouter>
)
