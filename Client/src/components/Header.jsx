import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { BriefcaseBusiness, Heart, PenBox } from 'lucide-react'
import {
  SignIn,
  SignedIn,
  SignedOut,
  UserButton,
  useUser
} from '@clerk/clerk-react'

function Header () {
  const { user } = useUser()
  const [showSignIn, setShowSignIn] = useState(false)
  const [search, setSearch] = useSearchParams()

  useEffect(() => {
    if (search.get('sign-in')) {
      setShowSignIn(true)
    }
  }, [search])

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false)
      setSearch({})
    }
  }

  return (
    <>
      <nav className='py-4 flex justify-between items-center'>
        <Link>
          {/* <img src='/logo.png' className='h-20' alt='Hirrd Logo' /> */}
          <h1 className='text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text drop-shadow-lg'>
            IdeaNest
          </h1>
        </Link>

        <div className='flex gap-8'>
          <SignedOut>
            <Button variant='outline' onClick={() => setShowSignIn(true)}>
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === 'student' && (
              <Link to='/create-post'>
                <Button variant='destructive' className='rounded-full'>
                  <PenBox size={20} className='mr-2' />
                  Create Idea
                </Button>
              </Link>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10'
                }
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label='My Posts'
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href='/my-posts'
                />
                <UserButton.Link
                  label='Saved Posts'
                  labelIcon={<Heart size={15} />}
                  href='/saved-posts'
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl='/select-role'
            fallbackRedirectUrl='/select-role'
          />
        </div>
      )}
    </>
  )
}

export default Header
