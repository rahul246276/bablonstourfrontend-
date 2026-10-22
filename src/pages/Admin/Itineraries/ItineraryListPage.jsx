import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import DataTable from '../../../components/admin/DataTable'
import itineraryService from '../../../services/itineraryService'

export default function ItineraryListPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const load = useCallback(async () => {
    setLoading(true)
    try { const result = await itineraryService.list({ search, limit: 100 }); setItems(result.items || []) }
    catch (error) { toast.error(error?.response?.data?.message || 'Could not load itineraries') }
    finally { setLoading(false) }
  }, [search])
  useEffect(() => { load() }, [load])
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-black text-slate-900">Itineraries</h1><p className="mt-1 text-sm text-slate-500">Saved customer plans, including itineraries created without an enquiry.</p></div><button onClick={() => navigate('/admin/itineraries/new')} className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-black text-white">New itinerary</button></div>
    <div className="flex gap-2"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer, destination, package" className="w-full max-w-lg rounded-lg border px-3 py-2 text-sm" /><button onClick={load} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white">Search</button></div>
    <DataTable loading={loading} rows={items} emptyText="No saved itineraries found" columns={[
      { key: 'title', label: 'Itinerary' }, { key: 'customerName', label: 'Customer' }, { key: 'destinations', label: 'Route', render: (row) => row.destinations?.join(' → ') || '—' },
      { key: 'duration', label: 'Duration', render: (row) => `${row.days} days / ${row.nights} nights` }, { key: 'price', label: 'Total', render: (row) => `${row.pricing?.currency || 'INR'} ${Number(row.pricing?.totalPrice ?? row.pricing?.totalCost ?? 0).toLocaleString()}` },
      { key: 'updatedAt', label: 'Last saved', render: (row) => row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : '—' },
      { key: 'actions', label: 'Action', render: (row) => <button onClick={() => navigate(`/admin/itineraries/${row._id}/edit`)} className="font-bold text-blue-700">Open / edit</button> },
    ]} />
  </div>
}
