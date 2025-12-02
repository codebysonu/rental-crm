'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Home, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'


export default function UnitsPage() {
  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <Header />
    <div className="p-8">
      {/* existing content */}
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUnits()
  }, [])

  const loadUnits = async () => {
    try {
      const { data, error } = await supabase
        .from('units')
        .select('*, properties(property_name)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUnits(data || [])
    } catch (error) {
      console.error('Error loading units:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteUnit = async (id: string) => {
    if (!confirm('Are you sure you want to delete this unit?')) return

    try {
      const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadUnits()
    } catch (error) {
      console.error('Error deleting unit:', error)
      alert('Failed to delete unit')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vacant': return 'bg-green-100 text-green-800'
      case 'occupied': return 'bg-blue-100 text-blue-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Units</h1>
            <p className="text-gray-600">Manage rental units within your properties</p>
          </div>
          <Link
            href="/units/new"
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Unit
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading units...</p>
          </div>
        ) : units.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No units yet</h3>
            <p className="text-gray-600 mb-6">Add units to your properties to start managing tenants</p>
            <Link
              href="/units/new"
              className="inline-block bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition"
            >
              Add Unit
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Floor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bedrooms</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Rent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {units.map((unit) => (
                  <tr key={unit.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {unit.properties?.property_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.unit_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.floor_number || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.bedrooms || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{Number(unit.monthly_rent).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(unit.status)}`}>
                        {unit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => deleteUnit(unit.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
