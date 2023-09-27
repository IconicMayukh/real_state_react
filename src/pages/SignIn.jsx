import React from 'react'
import { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

const SignIn = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const { email, password } = formData;
  function changeEmail(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(e){
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth,email,password);

      if(userCredential.user){
        // console.log(userCredential.user)
        navigate("/")
        toast.success("Signed in successfully!")
      }

    } catch (error) {
      console.log(error.message);
      toast.error("Invalid login credentials")
    }
  }

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign In</h1>
      <div className='flex flex-wrap justify-center lg:gap-20 gap-10 px-10 py-12 items-center '>
        <div className='md:w-[67%] lg:w-[50%] mb-6 md:mb-4'>
          <img src="https://c0.wallpaperflare.com/preview/205/953/174/registration-login-keyboard-hand.jpg" alt="key" className='w-full rounded-2xl' />
        </div>

        <div className='w-full md:w-[67%] lg:w-[40%] mx-4'>
          <form onSubmit={onSubmit} className='flex flex-col gap-5'>
            <input type="email" name="email" id="email" className='w-full rounded-md border border-gray-400 bg-white px-6 py-2 text-lg text-gray-700 placeholder:text-gray-400' value={email} onChange={changeEmail} placeholder='Email address' />

            <div className='relative'>
              <input type={showPassword ? "text" : "password"} name="password" id="password" className='w-full rounded-md border border-gray-400 bg-white px-6 py-2 text-lg text-gray-700 placeholder:text-gray-400' value={password} onChange={changeEmail} placeholder='Enter password' />


              {showPassword ? <AiFillEyeInvisible className='absolute right-4 top-[13.5px] text-xl cursor-pointer' onClick={() => setShowPassword((prevState) => !prevState)} /> : <AiFillEye className='absolute right-4 top-[13.5px] text-xl cursor-pointer' onClick={() => setShowPassword((prevState) => !prevState)} />}
            </div>
            <div className='flex justify-between mt-4 whitespace-nowrap sm:text-base lg:text-sm xs:flex-col gap-2'>
              <p>Don't have an account?
                <Link to={"/sign-up"} className='text-red-600 hover:text-red-700 pl-1.5'>Register</Link>
              </p>
              <p>
                <Link to={"/forgot-password"} className='text-blue-600 hover:text-blue-700'>Forgot Password?</Link>
              </p>
            </div>

            <button
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration=150 hover:shadow-lg" type="submit">
              Sign in
            </button>

            <div className="flex items-center my-1 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
              <p className="text-center font-semibold mx-4 text-gray-800">OR</p>
            </div>

            <OAuth/>
          </form>
        </div>
      </div>
    </section>
  )
}

export default SignIn