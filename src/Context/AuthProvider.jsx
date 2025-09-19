import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import { auth } from '../firebase/firebase.init';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';



const AuthProvider = ({children}) => {
  const [user, setUser]= useState(null);
  const [loading, setLoading] = useState(true);

  const createUser =(email, password)=> {
    setLoading(true);
    return  createUserWithEmailAndPassword(auth, email, password)
  }

  const signIn =(email, password)=> {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password)

  }

  const LogOut=()=> {
    setLoading(true);
     return signOut(auth);
  }

  useEffect(()=>{
    const unSubscribe = onAuthStateChanged(auth, currentUser=>{
      setUser(currentUser)
      setLoading(false)
    })

    return ()=> {
      unSubscribe();
    }

  },[])
  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    LogOut
   }

  
  return <AuthContext value={authInfo}>
           {children}
      </AuthContext>
};

export default AuthProvider;