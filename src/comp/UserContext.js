import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";


// This creates a new context 
// a shared state container — and gives it a name: UserContext.
// Think of it like opening a new “global channel” in your app.
// Any component that wants to subscribe or talk to this channel can now use:
// useContext(UserContext)
export const UserContext = createContext();

export function UserProvider({ children }) {

    //this is the global variables
    const [name, setName] = useState(null)
    const [email , setEmail] = useState(null)

    //in load we try to get the username from local storage if it exists

    useEffect(() => {

        const token = localStorage.getItem("authToken")
        if (token) {
            const decoded_token = jwtDecode(token);
            const name = decoded_token.name; // This must match your backend JWT
            const email = decoded_token.sub
            setName(name); // update context
            setEmail(email)
        }


    }, [])

    return (

        //You're wrapping your app (or part of it) with a special component called a Provider.
        //That provider gives access to the data you define inside value={...} 
        // to any child component below it in the React tree.

        <UserContext.Provider value={{ name, setName , email , setEmail}} >
            {children}
            {/* these are the children that can acces the global var */}
        </UserContext.Provider>






    );


}