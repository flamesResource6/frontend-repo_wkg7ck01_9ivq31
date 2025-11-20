import Header from './components/Header'
import SettingsPanel from './components/SettingsPanel'
import ProductForm from './components/ProductForm'
import ProductTable from './components/ProductTable'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_35%),_radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.08),transparent_35%)] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto p-6 md:p-10 space-y-6">
        <Header />
        <SettingsPanel />
        <ProductForm onAdded={() => { /* table will reload after creation via local state update in table */ }} />
        <ProductTable />
      </div>
    </div>
  )
}

export default App
