import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';

const ForgotPassword = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  function changeEmail(e) {
    setEmail(e.target.value)
  }

  async function onSubmit(e){
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth,email)
      toast.success(`An email is sent to ${email} for reseting password`)
      navigate("/");
    } catch (error) {
      console.log(error.message)
      toast.error("Could not send reset password email!")
    }
  }

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Forgot Password</h1>
      <div className='flex flex-wrap justify-center lg:gap-20 gap-10 px-10 py-12 items-center '>
        <div className='md:w-[67%] lg:w-[50%] mb-6 md:mb-4'>
          <img src="https://plus.unsplash.com/premium_photo-1681487746049-c39357159f69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="key" className='w-full rounded-2xl' />
        </div>

        <div className='w-full md:w-[67%] lg:w-[40%] mx-4'>
          <form onSubmit={onSubmit} className='flex flex-col gap-5'>
            <input type="email" name="email" id="email" className='w-full rounded-md border border-gray-400 bg-white px-6 py-2 text-lg text-gray-700 placeholder:text-gray-400' value={email} onChange={changeEmail} placeholder='Email address' />

            <div className='flex justify-between whitespace-nowrap sm:text-base lg:text-sm xs:flex-col gap-2'>
              <p>Don't have an account?
                <Link to={"/sign-up"} className='text-red-600 hover:text-red-700 pl-1.5'>Register</Link>
              </p>
              <p>
                <Link to={"/sign-in"} className='text-blue-600 hover:text-blue-700'>Sign in instead</Link>
              </p>
            </div>

            <button
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration=150 hover:shadow-lg" type="submit">
              Reset password
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

export default ForgotPassword