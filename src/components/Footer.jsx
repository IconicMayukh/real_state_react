import React from 'react'
import { Link } from 'react-router-dom';
import { FaInstagram , FaFacebook , FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className='bg-gray-800 grid grid-cols-3 relative bottom-0 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1'>
      <div className='col-span-1 relative w-full h-full'>
        <img src={'https://i.pinimg.com/originals/fd/b1/63/fdb1630049dc534f5da136cd77e5ffa8.jpg'} fill="true" alt='' style={{objectFit: 'cover'}} className='w-full h-full'/>
      </div>

      <div className='bg-gray-800 col-span-2 pt-5 gap-3.5 px-5 text-white pb-4'>
        {/* moto */}
        <div className='uppercase my-4 text-center' style={{fontFamily: 'Varela Round , sans-serif'}}>
          <h2 className='font-bold text-2xl'>Rosewood-estates.com - FIND YOUR DREAM PROPERTY HERE</h2>
          <h2 className='mt-1 font-semibold'>One place to find best properties where-ever you want !</h2>
        </div>

        <div className='grid grid-cols-2'>
            {/* location */}
            <div className='pr-16 text-justify'>
            <h1 className='text-lg mb-3 font-semibold text-orange-300 uppercase'>About us</h1>
            <p className='font-normal mb-5'>Rosewood_estates is a full stack service provider for all real estate needs, with 15+ services including home loans, pay rent, packers and movers, legal assistance, property valuation, and expert advice. As the largest platform for buyers and sellers of property to connect in a transparent manner, Rosewood_estates has an active base of over 15 lakh property listings.</p>
            {/* <p className='font-normal mb-5'>Station Road , Kamakhyaguri
                <br /> Alipurduar
                <br /><FaPhoneAlt className='inline-block mr-2'/> 9876543210
            </p> */}
            </div>

            {/* working hour */}
            <div>
            <h1 className='text-lg mb-3 font-semibold text-orange-300 uppercase'>Get your dream properties in</h1>
            <ul className='grid grid-cols-3 xs:grid-cols-2 sm:grid-cols-2'>
                <li>Mumbai</li>
                <li>Delhi</li>
                <li>Bangalore</li>
                <li>Kolkata</li>
                <li>Chennai</li>
                <li>Hydrabad</li>
                <li>Pune</li>
                <li>Ahmedabad</li>
                <li>Kanpur</li>
                <li>Siliguri</li>
                <li>Noida</li>
                <li>Jaipur</li>
            </ul>
            <p className='text-base mt-3'>And many more cities across India!</p>

            <h1 className='text-lg mb-3 font-semibold text-orange-300 mt-6'>CONNECT WITH US</h1>
            <div className='flex justify-start items-center pl-4 gap-4'>
                <Link href={'#'}><FaInstagram className='text-xl'/></Link>
                <Link href={'#'}><FaFacebook className='text-xl'/></Link>
                <Link href={'#'}><FaTwitter className='text-xl'/></Link>
            </div>
            </div>

        </div>
        <p className='h-[2px] rounded-md w-full bg-gray-700 mt-6'></p>
        <p className='text-sm font-medium text-center mt-2'>Copyright © Rosewood_estates.com. All rights reserved</p>

      </div>
    </div>
  )
}

export default Footer
