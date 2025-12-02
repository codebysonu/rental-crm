import Link from 'next/link'
import { Home, Building2, Users, DollarSign, Layers } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-md mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Rental CRM</h1>
              <p className="text-xs text-gray-500">Property Management</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link 
              href="/properties" 
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              <Building2 className="w-4 h-4" />
              Properties
            </Link>
            <Link 
              href="/units" 
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              <Layers className="w-4 h-4" />
              Units
            </Link>
            <Link 
              href="/tenants" 
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              <Users className="w-4 h-4" />
              Tenants
            </Link>
            <Link 
              href="/payments" 
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              <DollarSign className="w-4 h-4" />
              Payments
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Link 
              href="/" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Menu
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
