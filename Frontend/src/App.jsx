// React Router ka RouterProvider import kar rahe hain — routing manage karta hai
import { RouterProvider } from "react-router-dom"
// Humara defined router import kar rahe hain (saare routes yahan hain)
import { router } from "./app.routes.jsx"
// AuthProvider import kar rahe hain — poori app mein user authentication ka state manage karega
import { AuthProvider } from "./features/auth/auth.context.jsx"



// Main App component — yahan se poori application shuru hoti hai
function App() {


  return (
    // AuthProvider se wrap kar rahe hain taaki user state saari app mein available rahe
    <AuthProvider>
   <RouterProvider router={router}/>
    </AuthProvider>
  )
}

export default App
