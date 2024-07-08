"use client"
import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import {User}  from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
    const {data:session}=useSession();

    const user:User=session?.user as User

  return (
    <nav className='p-4 md:p-6 shadow-md'>
        <div className='container flex justify-between mx-auto flex-col md:flex-row items-center'>
            <a href='#' className='text-xl font-bold mb-4 md:mb-0'>Mystery Messages</a>
            {
                session ? (
                        <>
                            <span className='mr-4'>Welcome {user.email || user.username}</span>
                            <Button className='w-full md:w-auto' onClick={()=>signOut()}>
                                Logout
                            </Button>
                        </>
                ) : (
                    <Link href={'/sign-in'}>
                        <Button className='w-full md:w-auto'>
                            Log In
                        </Button>
                    </Link>
                )
            }
            
        </div>
    </nav>
  )
}

export default Navbar