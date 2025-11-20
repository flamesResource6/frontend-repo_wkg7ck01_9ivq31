import { useEffect, useMemo, useState } from 'react'

export default function ProductTable() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [products, setProducts] = useState([])
  const [taxRate, setTaxRate] = useState(0.1)

  const load = async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        fetch(`${baseUrl}/api/products`),
        fetch(`${baseUrl}/api/settings`)
      ])
      if (pRes.ok) {
        setProducts(await pRes.json())
      }
      if (sRes.ok) {
        const s = await sRes.json()
        setTaxRate(Number(s.tax_rate ?? 0.1))
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    try {
      await fetch(`${baseUrl}/api/products/${id}`, { method: 'DELETE' })
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (e) { console.error(e) }
  }

  const totals = useMemo(() => {
    const subtotal = products.reduce((acc, p) => acc + (p.price || 0), 0)
    const tax = subtotal * taxRate
    const total = subtotal + tax
    const costTotal = products.reduce((acc, p) => acc + (p.cost || 0), 0)
    const margin = subtotal - costTotal
    const marginPct = subtotal ? (margin / subtotal) * 100 : 0
    return { subtotal, tax, total, costTotal, margin, marginPct }
  }, [products, taxRate])

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-blue-200">
              <th className="py-2 px-2">Product</th>
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2">Cost</th>
              <th className="py-2 px-2">Price</th>
              <th className="py-2 px-2">Margin</th>
              <th className="py-2 px-2">Margin %</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-slate-700/60 text-blue-100">
                <td className="py-2 px-2">{p.name}</td>
                <td className="py-2 px-2">{p.category || '-'}</td>
                <td className="py-2 px-2">${p.cost.toFixed(2)}</td>
                <td className="py-2 px-2">${p.price.toFixed(2)}</td>
                <td className="py-2 px-2">${(p.margin_amount || (p.price - p.cost)).toFixed(2)}</td>
                <td className="py-2 px-2">{(p.margin_percent || ((p.price - p.cost) / (p.price || 1) * 100)).toFixed(1)}%</td>
                <td className="py-2 px-2">
                  <button onClick={() => remove(p.id)} className="text-red-300 hover:text-red-200">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-blue-300/80 py-6">No products yet. Add one above to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3 text-blue-100">
        <div className="bg-slate-900/60 rounded p-3">
          <div className="text-blue-300 text-sm">Subtotal</div>
          <div className="text-xl font-semibold">${totals.subtotal.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/60 rounded p-3">
          <div className="text-blue-300 text-sm">Cost Total</div>
          <div className="text-xl font-semibold">${totals.costTotal.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/60 rounded p-3">
          <div className="text-blue-300 text-sm">Tax</div>
          <div className="text-xl font-semibold">${totals.tax.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/60 rounded p-3">
          <div className="text-blue-300 text-sm">Margin</div>
          <div className="text-xl font-semibold">${totals.margin.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/60 rounded p-3">
          <div className="text-blue-300 text-sm">Margin %</div>
          <div className="text-xl font-semibold">{totals.marginPct.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  )
}
