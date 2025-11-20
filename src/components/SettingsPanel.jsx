import { useEffect, useState } from 'react'

export default function SettingsPanel() {
  const [taxRate, setTaxRate] = useState(0.1)
  const [saving, setSaving] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/settings`)
        if (res.ok) {
          const data = await res.json()
          setTaxRate(Number(data.tax_rate ?? 0.1))
        }
      } catch {}
    }
    load()
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${baseUrl}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tax_rate: Number(taxRate) })
      })
      if (!res.ok) throw new Error('Failed to save')
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between gap-4">
        <label className="text-blue-100">Sales Tax Rate</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="0.001"
            min="0"
            value={taxRate}
            onChange={e => setTaxRate(e.target.value)}
            className="w-28 bg-slate-900/70 text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-blue-200/80 text-sm">(decimal, e.g., 0.1 = 10%)</span>
        </div>
      </div>
      <button onClick={save} className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2 disabled:opacity-60" disabled={saving}>
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  )
}
