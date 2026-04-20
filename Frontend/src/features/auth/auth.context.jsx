// React ke useState aur useEffect hooks import kar rahe hain
import { useState, useEffect } from "react";
// Backend se current user ka data fetch karne ki function import kar rahe hain
import { getMe } from "./services/auth.api";   
// Auth context import kar rahe hain jisme user state share hogi
import { AuthContext } from "./auth.context.js";

// AuthProvider component — poori app mein user state provide karta hai
export const AuthProvider = ({ children }) => {

    // user state — abhi logged in user kaun hai (null means logged out)
    const [user, setUser] = useState(null);
    // loading state — jab tak data aa nahi jaata, loading true rahega
    const [loading, setLoading] = useState(true);

    // Component mount hone par user data fetch karte hain
    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                // Backend se current user ki details lo
                const data = await getMe();
                // User mila toh set karo, warna null
                setUser(data.user ?? null);
            } catch {
                // Error aaye toh user null set karo (not logged in)
                setUser(null);
            } finally {
                // Data aa gaya (chahe error ho ya nahi), loading band karo
                setLoading(false);
            }
        };
        getAndSetUser();
    }, []);


    return (
        // AuthContext ke through user, setUser, loading, setLoading provide karte hain
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>

    );

};
