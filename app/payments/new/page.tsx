'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'


export default function NewPaymentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tenants, setTenants] = useState<any[]>([])
  const [selectedTenant, setSelectedTenant] = useState<any>(null)
  const [formData, setFormData] = useState({
    tenant_id: '',
    unit_id: '',
    payment_month: '',
    rent_amount: '',
    electricity_bill: '0',
    water_bill: '0',
    maintenance_charges: '0',
    other_charges: '0',
    amount_paid: '',
    payment_status: 'pending',
    payment_date: '',
    payment_method: 'cash',
    transaction_reference: '',
    notes: '',
    due_date: ''
  })

  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*, units(id, unit_number, monthly_rent, properties(property_name))')
        .eq('status', 'active')

      if (error) throw error
      setTenants(data || [])
    } catch (error) {
      console.error('Error loading tenants:', error)
    }
  }

  const handleTenantChange = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId)
    setSelectedTenant(tenant)
    
    if (tenant && tenant.units) {
      setFormData(prev => ({
        ...prev,
        tenant_id: tenantId,
        unit_id: tenant.units.id,
        rent_amount: tenant.units.monthly_rent.toString()
      }))
    }
  }

  const calculateTotal = () => {
    const rent = parseFloat(formData.rent_amount) || 0
    const electricity = parseFloat(formData.electricity_bill) || 0
    const water = parseFloat(formData.water_bill) || 0
    const maintenance = parseFloat(formData.maintenance_charges) || 0
    const other = parseFloat(formData.other_charges) || 0
    return rent + electricity + water + maintenance + other
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const total = calculateTotal()
      const amountPaid = parseFloat(formData.amount_paid) || 0
      
      let status = 'pending'
      if (amountPaid >= total) status = 'paid'
      else if (amountPaid > 0) status = 'partial'

      const dataToInsert = {
        tenant_id: formData.tenant_id,
        unit_id: formData.unit_id,
        payment_month: formData.payment_month,
        rent_amount: parseFloat(formData.rent_amount),
        electricity_bill: parseFloat(formData.electricity_bill),
        water_bill: parseFloat(formData.water_bill),
        maintenance_charges: parseFloat(formData.maintenance_charges),
        other_charges: parseFloat(formData.other_charges),
        total_amount: total,
        amount_paid: amountPaid,
        payment_status: status,
        payment_date: formData.payment_date || null,
        payment_method: formData.payment_method,
        transaction_reference: formData.transaction_reference || null,
        notes: formData.notes || null,
        due_date: formData.due_date
      }

      const { error } = await supabase
        .from('rent_payments')
        .insert([dataToInsert])

      if (error) throw error

      alert('Payment recorded successfully!')
      router.push('/payments')
    } catch (error) {
      console.error('Error recording payment:', error)
      alert('Failed to record payment')
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Record Payment</h1>
          <p className="text-gray-600">Record rent and bill payment</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Tenant *
              </label>
              <select
                value={formData.tenant_id}
                onChange={(e) => handleTenantChange(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Choose a tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.full_name} - {tenant.units?.properties?.property_name} Unit {tenant.units?.unit_number}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Month *
                </label>
                <input
                  type="date"
                  name="payment_month"
                  value={formData.payment_month}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rent Amount (₹) *
                </label>
                <input
                  type="number"
                  name="rent_amount"
                  value={formData.rent_amount}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Electricity Bill (₹)
                </label>
                <input
                  type="number"
                  name="electricity_bill"
                  value={formData.electricity_bill}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Bill (₹)
                </label>
                <input
                  type="number"
                  name="water_bill"
                  value={formData.water_bill}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Charges (₹)
                </label>
                <input
                  type="number"
                  name="maintenance_charges"
                  value={formData.maintenance_charges}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Charges (₹)
              </label>
              <input
                type="number"
                name="other_charges"
                value={formData.other_charges}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-indigo-600">₹{calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Paid (₹)
                </label>
                <input
                  type="number"
                  name="amount_paid"
                  value={formData.amount_paid}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  name="payment_date"
                  value={formData.payment_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="cheque">Cheque</option>
                  <option value="card">Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Reference
                </label>
                <input
                  type="text"
                  name="transaction_reference"
                  value={formData.transaction_reference}
                  onChange={handleChange}
                  placeholder="UTR/Cheque No."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
              >
                {loading ? 'Recording...' : 'Record Payment'}
              </button>
              <Link
                href="/payments"
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
