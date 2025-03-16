import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, PenBox, Users, Trophy } from "lucide-react";
import {
  SignIn,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

function Header() {
  const { user } = useUser();
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Redirect to a search results page with the query as a parameter
    window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <>
      <nav className="py-4 px-4 border-b flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/">
            {/* <img src='/logo.png' className='h-20' alt='Hirrd Logo' /> */}
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text drop-shadow-lg">
              IdeaNest
            </h1>
          </Link>
          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" className="rounded-r-md">
              Search
            </Button>
          </form>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0 items-center">
          <Link to="/community-chat">
            <Button variant="outline" className="flex items-center gap-1">
              <Users size={18} />
              Community
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button variant="outline" className="flex items-center gap-1">
              <Trophy size={18} />
              Leaderboard
            </Button>
          </Link>
          <SignedOut>
            <Button variant="outline" onClick={() => setShowSignIn(true)}>
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Posts"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-posts"
                />
                <UserButton.Link
                  label="Saved Posts"
                  labelIcon={<Heart size={15} />}
                  href="/saved-posts"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>

        {/* Mobile Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex md:hidden mt-4 w-full"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" className="rounded-r-md">
            Search
          </Button>
        </form>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/select-role"
            fallbackRedirectUrl="/select-role"
          />
        </div>
      )}
    </>
  );
}

export default Header;