import React,{ useContext,useState, useEffect } from 'react'
import { auth } from '../config/firebase';

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);


    function signup(data){
       return auth.createUserWithEmailAndPassword(data.email,data.password)
            .then(async (res)=>{
                let user = res.user;
                await user.updateProfile({
                    displayName: data.name,
                    photoURL: `https://ui-avatars.com/api/?background=random&name=${data.name.replace(/\s/g,"+")}`
                }).then(()=>{
                    user.sendEmailVerification()
                    setCurrentUser(auth.currentUser);
                })
                
            })
    }

    function login(email,password){
        return auth.signInWithEmailAndPassword(email,password)
    }
    function updateProfile(name) {
        return currentUser.updateProfile({
            displayName: name,
        }).then(()=>{
            setCurrentUser(auth.currentUser);
        })
    }
    function logout() {
        return auth.signOut( )
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    useEffect(()=>{
        const unsubcribe =  auth.onAuthStateChanged(user=>{
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubcribe;
    },[])

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            { !loading && children }
        </AuthContext.Provider>
    )
}
