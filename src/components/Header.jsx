import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useLocation , useNavigate } from 'react-router'
import logo from "../assets/final_logo.png"

const Header = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [pagestate, setPagestate] = useState("Sign in")
    const auth = getAuth();

    useEffect(() => {
      onAuthStateChanged(auth,(user)=>{
        if(user) setPagestate("Profile");
        else setPagestate("Sign in");
      })
    }, [])

    function pathMatch(route) {
        if (route === location.pathname) return true;
        return false;
    }

    return (
        <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
            <header className='flex justify-between items-center px-3 max-w-6xl mx-auto pt-2  xs:flex-col'>
                <div>
                    <img src={logo} alt="rosewood_estate.com" className='h-14 cursor-pointer' 
                    onClick={()=> navigate('/')}/>
                </div>
                <div>
                    <ul className='flex gap-20'>
                        <li className={`cursor-pointer py-3 text-base font-semibold  border-b-[3px]  ${pathMatch('/') ? "border-b-red-500 text-black" : "border-b-transparent text-gray-500"}`} onClick={()=> navigate('/')}>Home</li>
                        <li className={`cursor-pointer py-3 text-base font-semibold  border-b-[3px]  ${pathMatch('/offers') ? "border-b-red-500 text-black" : "border-b-transparent text-gray-500"}`} onClick={()=> navigate('/offers')}>Offers</li>
                        <li className={`cursor-pointer py-3 text-base font-semibold  border-b-[3px]  ${pathMatch('/sign-in') || pathMatch('/profile') ? "border-b-red-500 text-black" : "border-b-transparent text-gray-500"}`} onClick={()=> navigate('/profile')}>{pagestate}</li>
                    </ul>
                </div>
            </header>
        </div>
    )
}

export default Header
