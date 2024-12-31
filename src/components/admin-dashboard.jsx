"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  HelpCircle,
  Bell,
  Menu,
  Search,
  X,
  Loader
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/utils/auth'

export default function AdminDashboard({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className="h-screen flex-1 flex items-center justify-center">
      <Loader className="size-7 animate-spin text-muted-foreground" />
    </div>
  }

  const logOut = () => {
    router.push('/auth');
    localStorage.removeItem('oriviaa_auth')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? "" : "hidden"}`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={toggleSidebar}></div>
        <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-64 bg-white">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <span className="text-2xl font-bold text-gray-800">Admin</span>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Close menu">
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ul className="px-2 py-4 space-y-2">
              <li>
                <Link href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  <LayoutDashboard className="w-5 h-5 mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  <ShoppingBag className="w-5 h-5 mr-3" />
                  Orders
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  <Users className="w-5 h-5 mr-3" />
                  Customers
                </Link>
              </li>
              <li>
                <Link href="/product" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  <FileText className="w-5 h-5 mr-3" />
                  Products
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          <div className="p-4 border-t">
            <Button onClick={logOut} variant="outline" className="w-full">
              <HelpCircle className="w-4 h-4 mr-2" />
              Login screen
            </Button>
          </div>
        </nav>
      </div>

      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="flex items-center justify-center h-16 border-b">
          <span className="text-2xl font-bold text-gray-800">Oriviaa Admin</span>
        </div>
        <nav className="flex-grow">
          <ul className="px-4 py-4 space-y-2">
            <li>
              <Link href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <ShoppingBag className="w-5 h-5 mr-3" />
                Orders
              </Link>
            </li>
            <li>
              <Link href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <Users className="w-5 h-5 mr-3" />
                Customers
              </Link>
            </li>
            <li>
              <Link href="/product" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <FileText className="w-5 h-5 mr-3" />
                Products
              </Link>
            </li>
            <li>
              <Link href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Button onClick={logOut} variant="outline" className="w-full">
            <HelpCircle className="w-4 h-4 mr-2" />
            Login screen
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={toggleSidebar} aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-full md:w-[300px]"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <img
                    src="/placeholder.svg?height=32&width=32"
                    alt="User"
                    className="rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
}