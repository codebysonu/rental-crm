'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Building2, Users, DollarSign, Zap } from 'lucide-react'

export default function Home() {
  const [stats, setStats] = useState({
    properties: 0,
    tenants: 0,
    pendingPayments: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [propertiesRes, tenantsRes, paymentsRes] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('tenants').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('rent_payments').select('total_amount, amount_paid, payment_status')
      ])

      const pending = paymentsRes.data?.filter(p => p.payment_status === 'pending').length || 0
      const revenue = paymentsRes.data?.reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0) || 0

      setStats({
        properties: propertiesRes.count || 0,
        tenants: tenantsRes.count || 0,
        pendingPayments: pending,
        totalRevenue: revenue
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Rental CRM Dashboard</h1>
          <p className="text-gray-600">Manage your properties, tenants, and payments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Building2 className="w-8 h-8" />}
            title="Properties"
            value={stats.properties}
            color="bg-blue-500"
          />
          <StatCard
            icon={<Users className="w-8 h-8" />}
            title="Active Tenants"
            value={stats.tenants}
            color="bg-green-500"
          />
          <StatCard
            icon={<DollarSign className="w-8 h-8" />}
            title="Pending Payments"
            value={stats.pendingPayments}
            color="bg-orange-500"
          />
          <StatCard
            icon={<Zap className="w-8 h-8" />}
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            color="bg-purple-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton title="Add Property" href="/properties/new" />
            <ActionButton title="Add Tenant" href="/tenants/new" />
            <ActionButton title="Record Payment" href="/payments/new" />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Database Setup</h2>
          <p className="text-gray-600 mb-4">
            Make sure you've run the SQL script in your Supabase SQL Editor to create all tables.
          </p>
          <a
            href="https://hcktojhkqzbtrryqtaoz.supabase.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Open Supabase Dashboard
          </a>
        </div>
      </div>
    </main>
  )
}

function StatCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className={`${color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function ActionButton({ title, href }: any) {
  return (
    <a
      href={href}
      className="block bg-indigo-500 text-white text-center px-6 py-4 rounded-lg hover:bg-indigo-600 transition font-semibold"
    >
      {title}
    </a>
  )
}
