import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { useNavigate } from 'react-router';

const OAuth = () => {

  const navigate = useNavigate();

  async function onGoogleClick(){
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth,provider)

      const user = result.user
      console.log(user)

      const docref = doc(db,"users",user.uid)
      const docSnap = await getDoc(docref)
      if(!docSnap.exists()){
        await setDoc(docref, {
          name : user.displayName,
          email : user.email,
          timestamp : serverTimestamp()
        })
      }
      navigate("/")
      toast.success("Signed in successfully!")

    } catch (error) {
      console.log(error.message)
      toast.error("Could not authorise with Google")
    }
  }

  return (
    <button onClick={onGoogleClick} type='button' className='flex items-center justify-center w-full bg-red-600 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-700 transition duration-150 ease-in-out rounded gap-3'>
        <FcGoogle className='bg-white rounded-full text-xl'/>
        Continue with Google
    </button>
  )
}

export default OAuth
