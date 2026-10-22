import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import DataTable from '../../../components/admin/DataTable'
import itineraryTemplateService from '../../../services/itineraryTemplateService'

export default function ItineraryTemplatesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('active')
  const [country, setCountry] = useState('')
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState('')
  const navigate = useNavigate()
  const load = useCallback(async () => {
    setLoading(true)
    try { const result = await itineraryTemplateService.list({ search, status, country, destination, days: days || undefined }); setItems(result.items || []) }
    catch (error) { toast.error(error?.response?.data?.message || 'Could not load itinerary templates') }
    finally { setLoading(false) }
  }, [search, status, country, destination, days])
  useEffect(() => { load() }, [load])
  const duplicate = async (id) => { try { await itineraryTemplateService.duplicate(id); toast.success('Template duplicated'); load() } catch (error) { toast.error(error?.response?.data?.message || 'Could not duplicate template') } }
  const archive = async (id) => { if (!window.confirm('Archive this template? It will no longer be available for new itineraries.')) return; try { await itineraryTemplateService.archive(id); toast.success('Template archived'); load() } catch (error) { toast.error(error?.response?.data?.message || 'Could not archive template') } }
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-black text-slate-900">Itinerary Templates</h1><p className="mt-1 text-sm text-slate-500">Reusable trip plans. Customer itineraries are saved as independent copies.</p></div><button onClick={() => navigate('/admin/itinerary-templates/new')} className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-black text-white">Create Template</button></div>
    <div className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-5"><label className="text-xs font-bold text-slate-500">Search<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, country, city" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-normal" /></label><label className="text-xs font-bold text-slate-500">Country<input value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-normal" /></label><label className="text-xs font-bold text-slate-500">Destination<input value={destination} onChange={(e) => setDestination(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-normal" /></label><label className="text-xs font-bold text-slate-500">Days<input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-normal" /></label><label className="text-xs font-bold text-slate-500">Status<select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-normal"><option value="active">Active</option><option value="archived">Archived</option><option value="">All</option></select></label></div>
    <DataTable loading={loading} rows={items} emptyText="No itinerary templates found" columns={[
      { key: 'name', label: 'Template' }, { key: 'route', label: 'Countries · Route', render: (row) => `${row.countries?.join(', ') || '—'} · ${(row.route?.length ? row.route : row.destinations)?.map((stop) => typeof stop === 'string' ? stop : `${stop.city}${stop.nights ? ` (${stop.nights}N)` : ''}`).join(' → ') || '—'}` },
      { key: 'duration', label: 'Duration', render: (row) => `${row.days} days / ${row.nights} nights` }, { key: 'version', label: 'Version', render: (row) => `v${row.version}` }, { key: 'status', label: 'Status' },
      { key: 'actions', label: 'Actions', render: (row) => <div className="flex flex-wrap gap-2"><button onClick={() => navigate(`/admin/itinerary-templates/${row._id}/edit`)} className="font-bold text-blue-700">Edit</button><button onClick={() => duplicate(row._id)} className="font-bold text-slate-700">Duplicate</button>{row.status !== 'archived' && <button onClick={() => archive(row._id)} className="font-bold text-red-600">Archive</button>}</div> },
    ]} />
  </div>
}
