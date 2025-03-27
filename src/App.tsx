import { Routes, Route } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle"
import { AuditForm } from '@/components/audit/audit-form'
import { AuditTable } from '@/components/audit/audit-table'
import { Logo } from '@/components/ui/logo'

function App() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4">
            <Logo />
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<AuditTable />} />
          <Route path="/new" element={<AuditForm />} />
          <Route path="/edit/:id" element={<AuditForm />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
