import React from 'react'
import amazon from "../assets/amazonLogo.png"
import { IoLocationOutline } from "react-icons/io5";

const Navbar = () => {
  return (
    <>
    <div className='flex justify-between p-2 bg-[#131921] text-white'>
        <div className='flex'>
    <img src={amazon} alt="logo" className='w-32'/>
    <p className='mt-2'>.in</p>

        </div>

        <div><p>Delivery</p>
        <span><IoLocationOutline /></span><p>location</p></div>
        <div><input type="search" className='bg-white text-gray-800 p-2 w-full'  placeholder='Search Amazon.in' /></div>
        <div>EN</div>
        <div>Hello Sign in</div>
        <div>Return</div>
        <div>cart</div>

    </div>
    </>
  )
}

export default Navbar