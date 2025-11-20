import { useState } from 'react'

export default function ProductForm({ onAdded }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [form, setForm] = useState({ name: '', cost: '', price: '', category: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        name: form.name.trim(),
        cost: Number(form.cost || 0),
        price: Number(form.price || 0),
        category: form.category.trim() || undefined
      }
      const res = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        onAdded?.(data)
        setForm({ name: '', cost: '', price: '', category: '' })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Product name" className="bg-slate-900/70 text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="bg-slate-900/70 text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="number" step="0.01" min="0" name="cost" value={form.cost} onChange={handleChange} placeholder="Cost" className="bg-slate-900/70 text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        <input type="number" step="0.01" min="0" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="bg-slate-900/70 text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
      <button type="submit" className="mt-3 w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded px-3 py-2 disabled:opacity-60" disabled={loading}>
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  )
}
