// auth.api.js
// Axios library import kar rahe hain — HTTP requests bhejne ke liye use hoga
import axios from "axios"

// Axios ka ek pre-configured instance banate hain
// baseURL se backend ka address set ho jaata hai
// Locally: http://localhost:3000 | Production: Render ka URL (env se aayega)
// withCredentials: true ka matlab hai cookies automatically send hongi
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true
})

// Register function — naya user banaane ke liye POST request bhejta hai
export async function register({ username, email, password}) {

    try {
    // Backend ke register endpoint pe POST request
    const response = await api.post('/api/auth/register',{
        username, email, password
    })

    // Successful response data return karo
    return response.data
} catch (err) {
    // Error aaye toh console mein print karo aur throw karo
    console.error(err.response?.data || err.message)
    throw err
}

}

// Login function — existing user ko login karne ke liye POST request
export async function login({ email, password }) {

    try {

        // Backend ke login endpoint pe email aur password ke saath request bhejo
        const response = await api.post("/api/auth/login", {
        email,password
    })

    // Successful response data return karo
    return response.data

    } catch (err) {
    // Error aaye toh console mein print karo aur throw karo
    console.error(err.response?.data || err.message)
    throw err
}

    
}

// Logout function — user ko logout karne ke liye GET request
export async function logout() {

    try {

        // Backend ke logout endpoint ko call karo
        const response = await api.get("/api/auth/logout", {
 })

    // Response data return karo
    return response.data
    
    } catch (err) {
    // Error aaye toh console mein print karo aur throw karo
    console.error(err.response?.data || err.message)
    throw err
}
}

// getMe function — abhi logged in user ki details fetch karta hai
export async function getMe() {

    try {

        // Backend ke get-me endpoint pe request bhejo
        const response = await api.get("/api/auth/get-me", {
 })

    // User data return karo
    return response.data
    
    } catch (err) {
    // Error aaye toh log karo aur throw karo
    console.error(err.response?.data || err.message)
    throw err
}
}