import { BrickWallFireIcon, Medal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

function Navbar() {
  return (
    <nav>
      <div className='container text-center py-4 px-12 border-b border-gray-600'>
        <div className="row flex justify-around items-center">
          <div className="col flex">
            <Image src="/utc.jpg" alt='logo' width={50} height={50} className='rounded-md' />
            <span className='text-2xl pt-3 ml-2 font-bold text-[#00F59B]'>Unity Tech Hub Kids</span>
          </div>
          <div className="col items-center">
            <ul className='flex gap-6'>
              <li>
                <a href="#">Ballina</a>
              </li>
              <li>
                <a href="#">Vecorite</a>
              </li>
              <li>
                <a href="#">Rruga Mesimore</a>
              </li>
              <li>
                <a href="#">Kontakti</a>
              </li>
            </ul>
          </div>
          <div className="col flex gap-4 items-center">
            <BrickWallFireIcon className='text-[#00F59B]'/>
            <Medal className='text-[#00F59B]'/>
            <Link href="/studentauth">
              <Button className='uppercase py-4 px-4 rounded-sm bg-[#00F59B]'>Fillo Falas</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar