'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'


export default function NewUnitPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState<any[]>([])
  const [formData, setFormData] = useState({
    property_id: '',
    unit_number: '',
    floor_number: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    monthly_rent: '',
    status: 'vacant'
  })

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('property_name')

      if (error) throw error
      setProperties(data || [])
    } catch (error) {
      console.error('Error loading properties:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToInsert = {
        property_id: formData.property_id,
        unit_number: formData.unit_number,
        floor_number: formData.floor_number ? parseInt(formData.floor_number) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        square_feet: formData.square_feet ? parseFloat(formData.square_feet) : null,
        monthly_rent: parseFloat(formData.monthly_rent),
        status: formData.status
      }

      const { error } = await supabase
        .from('units')
        .insert([dataToInsert])

      if (error) throw error

      alert('Unit added successfully!')
      router.push('/units')
    } catch (error: any) {
      console.error('Error adding unit:', error)
      if (error.message?.includes('duplicate')) {
        alert('This unit number already exists for this property')
      } else {
        alert('Failed to add unit')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <Header />
    <div className="p-8">
      {/* existing content */}
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Unit</h1>
          <p className="text-gray-600">Add a rental unit to a property</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Property *
              </label>
              <select
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Choose a property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.property_name} - {property.address}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Number *
                </label>
                <input
                  type="text"
                  name="unit_number"
                  value={formData.unit_number}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 101, A1, Ground Floor"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor Number
                </label>
                <input
                  type="number"
                  name="floor_number"
                  value={formData.floor_number}
                  onChange={handleChange}
                  placeholder="e.g., 1, 2, 3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  placeholder="e.g., 1.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet
                </label>
                <input
                  type="number"
                  name="square_feet"
                  value={formData.square_feet}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="e.g., 850"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  name="monthly_rent"
                  value={formData.monthly_rent}
                  onChange={handleChange}
                  required
                  step="0.01"
                  placeholder="e.g., 15000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="vacant">Vacant</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Unit'}
              </button>
              <Link
                href="/units"
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
