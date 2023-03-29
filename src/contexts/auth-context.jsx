import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase-config";
import { useNavigate } from "react-router-dom";

const authContext = createContext();

function AuthProvider(props){
    const [userInfo, setUserInfo] = useState({});
    const value = {userInfo, setUserInfo}
    useEffect(() =>{
        onAuthStateChanged(auth, (user) =>{
            setUserInfo(user);
        });
    }, []);
    return <authContext.Provider value={value} {...props}></authContext.Provider>
}

function useAuth(){
    const context = useContext(authContext);
    if(typeof context === "undefined") throw new Error("useAuth must be used within AuthProvider");
    return context;
}

export{
    AuthProvider,
    useAuth
}