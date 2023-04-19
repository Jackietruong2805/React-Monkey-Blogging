import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const authContext = createContext();

function AuthProvider(props){
    const [userInfo, setUserInfo] = useState({});
    const value = {userInfo, setUserInfo};
    useEffect(() =>{
        onAuthStateChanged(auth, (user) =>{
            if(user){
                const docRef = query(collection(db, "users"), where("email", "==", user.email))
                onSnapshot(docRef, snapshot => {
                    snapshot.forEach(doc => {
                        setUserInfo({
                           ...user,
                           ...doc.data() 
                        })
                    })
                })
                setUserInfo(user);
            }else{
                setUserInfo(null);
            }
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