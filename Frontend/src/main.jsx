// React ka StrictMode import kar rahe hain — development mein extra warnings dikhata hai
import { StrictMode } from 'react'
// Root element mein React app render karne ke liye createRoot import kar rahe hain
import { createRoot } from 'react-dom/client'
// Global CSS styles import kar rahe hain
import "./style.css"
// Main App component import kar rahe hain
import App from './App.jsx'

// HTML mein 'root' ID wale element mein poori React app render kar rahe hain
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
