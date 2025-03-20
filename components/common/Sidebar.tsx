"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, Compass, PlusSquare, Heart, User, Menu, X } from "lucide-react"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile bottom navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 z-50">
        <div className="flex justify-around items-center h-16">
          <Link href="/" className="flex flex-col items-center justify-center">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/explore" className="flex flex-col items-center justify-center">
            <Compass className="w-6 h-6" />
            <span className="text-xs mt-1">Explore</span>
          </Link>
          <Link href="/create" className="flex flex-col items-center justify-center">
            <PlusSquare className="w-6 h-6" />
            <span className="text-xs mt-1">Create</span>
          </Link>
          <Link href="/activity" className="flex flex-col items-center justify-center">
            <Heart className="w-6 h-6" />
            <span className="text-xs mt-1">Activity</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center justify-center">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-base-100 border-r border-base-300 h-screen sticky top-0">
        <div className="p-4 border-b border-base-300">
          <h1 className="text-2xl font-bold">ReelsPro</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/" className="flex items-center p-3 rounded-lg hover:bg-base-200">
                <Home className="w-6 h-6 mr-3" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/explore" className="flex items-center p-3 rounded-lg hover:bg-base-200">
                <Compass className="w-6 h-6 mr-3" />
                <span>Explore</span>
              </Link>
            </li>
            <li>
              <Link href="/reels" className="flex items-center p-3 rounded-lg bg-base-300">
                <PlusSquare className="w-6 h-6 mr-3" />
                <span>Reels</span>
              </Link>
            </li>
            <li>
              <Link href="/activity" className="flex items-center p-3 rounded-lg hover:bg-base-200">
                <Heart className="w-6 h-6 mr-3" />
                <span>Activity</span>
              </Link>
            </li>
            <li>
              <Link href="/profile" className="flex items-center p-3 rounded-lg hover:bg-base-200">
                <User className="w-6 h-6 mr-3" />
                <span>Profile</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-base-300">
          <button className="btn btn-outline w-full">Log Out</button>
        </div>
      </div>

      {/* Mobile menu button */}
      <button className="lg:hidden fixed top-4 left-4 z-50 btn btn-circle btn-sm" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-base-100 z-40 p-4 pt-16">
          <nav>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="flex items-center p-3 rounded-lg hover:bg-base-200"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-6 h-6 mr-3" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="flex items-center p-3 rounded-lg hover:bg-base-200"
                  onClick={() => setIsOpen(false)}
                >
                  <Compass className="w-6 h-6 mr-3" />
                  <span>Explore</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/reels"
                  className="flex items-center p-3 rounded-lg bg-base-300"
                  onClick={() => setIsOpen(false)}
                >
                  <PlusSquare className="w-6 h-6 mr-3" />
                  <span>Reels</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/activity"
                  className="flex items-center p-3 rounded-lg hover:bg-base-200"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="w-6 h-6 mr-3" />
                  <span>Activity</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="flex items-center p-3 rounded-lg hover:bg-base-200"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-6 h-6 mr-3" />
                  <span>Profile</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}

