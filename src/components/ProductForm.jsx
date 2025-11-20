import { useState } from 'react'

function IngredientRow({ idx, item, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <input className="col-span-3 bg-slate-900/70 text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingredient" value={item.name} onChange={e=>onChange(idx,{...item,name:e.target.value})} />
      <input className="col-span-2 bg-slate-900/70 text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Unit (g/ml/pc)" value={item.unit} onChange={e=>onChange(idx,{...item,unit:e.target.value})} />
      <input className="col-span-2 bg-slate-900/70 text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" type="number" step="0.0001" min="0" placeholder="Unit Cost" value={item.unit_cost} onChange={e=>onChange(idx,{...item,unit_cost:e.target.value})} />
      <input className="col-span-2 bg-slate-900/70 text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" type="number" step="0.0001" min="0" placeholder="Qty" value={item.quantity} onChange={e=>onChange(idx,{...item,quantity:e.target.value})} />
      <div className="col-span-2 text-right text-blue-200">${(((+item.unit_cost||0) * (+item.quantity||0))).toFixed(2)}</div>
      <button type="button" onClick={()=>onRemove(idx)} className="col-span-1 text-red-300 hover:text-red-200">Remove</button>
    </div>
  )
}

export default function ProductForm({ onAdded }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [form, setForm] = useState({ name: '', price: '', category: '' })
  const [ingredients, setIngredients] = useState([
    { name: '', unit: '', unit_cost: '', quantity: '' }
  ])
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const changeIngredient = (idx, next) => {
    setIngredients(prev => prev.map((it,i)=> i===idx ? next : it))
  }
  const addIngredient = () => setIngredients(prev => [...prev, { name: '', unit: '', unit_cost: '', quantity: '' }])
  const removeIngredient = (idx) => setIngredients(prev => prev.filter((_,i)=>i!==idx))

  const computedCost = ingredients.reduce((acc, it) => acc + ((+it.unit_cost||0) * (+it.quantity||0)), 0)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price || 0),
        category: form.category.trim() || undefined,
        ingredients: ingredients
          .filter(i => i.name.trim())
          .map(i => ({
            name: i.name.trim(),
            unit: i.unit || undefined,
            unit_cost: Number(i.unit_cost || 0),
            quantity: Number(i.quantity || 0)
          }))
      }
      const res = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        onAdded?.(data)
        setForm({ name: '', price: '', category: '' })
        setIngredients([{ name: '', unit: '', unit_cost: '', quantity: '' }])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Product name (e.g., Latte 12oz)" className="bg-slate-900/70 text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="bg-slate-900/70 text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="number" step="0.01" min="0" name="price" value={form.price} onChange={handleChange} placeholder="Sales Price" className="bg-slate-900/70 text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        <div className="bg-slate-900/60 rounded px-3 py-2 border border-slate-700 flex items-center justify-between"><span className="text-blue-300">Computed Cost</span><span className="font-semibold">${computedCost.toFixed(2)}</span></div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-blue-200">Ingredients</div>
          <button type="button" onClick={addIngredient} className="text-emerald-300 hover:text-emerald-200">+ Add Ingredient</button>
        </div>
        <div className="space-y-2">
          {ingredients.map((item, idx) => (
            <IngredientRow key={idx} idx={idx} item={item} onChange={changeIngredient} onRemove={removeIngredient} />
          ))}
        </div>
      </div>

      <button type="submit" className="mt-1 w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded px-3 py-2 disabled:opacity-60" disabled={loading}>
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  )
}
