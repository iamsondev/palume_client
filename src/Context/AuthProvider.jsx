import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import { auth } from '../firebase/firebase.init';
import { createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';


const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

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

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth,googleProvider)
  }

  const signInWithGithub=()=>{
    setLoading(true);
    return signInWithPopup(auth, githubProvider)
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
    signInWithGoogle,
    signInWithGithub,
    LogOut
   }

  
  return <AuthContext value={authInfo}>
           {children}
      </AuthContext>
};

export default AuthProvider;