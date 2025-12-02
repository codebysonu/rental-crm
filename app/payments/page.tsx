'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DollarSign, Plus } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'


export default function PaymentsPage() {
  return (
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('rent_payments')
        .select('*, tenants(full_name), units(unit_number, properties(property_name))')
        .order('payment_month', { ascending: false })
        .limit(50)

      if (error) throw error
      setPayments(data || [])
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short' 
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'partial': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <Header />
    <div className="p-8">
      {/* existing content */}
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Payments</h1>
            <p className="text-gray-600">Track rent and bill payments</p>
          </div>
          <Link
            href="/payments/new"
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Record Payment
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments recorded</h3>
            <p className="text-gray-600 mb-6">Start tracking rent payments</p>
            <Link
              href="/payments/new"
              className="inline-block bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition"
            >
              Record Payment
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property/Unit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Electricity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.tenants?.full_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.units?.properties?.property_name || 'N/A'} - {payment.units?.unit_number || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.payment_month)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{Number(payment.rent_amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{Number(payment.electricity_bill).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{Number(payment.total_amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{Number(payment.amount_paid).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(payment.payment_status)}`}>
                          {payment.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
