import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Secure Bridge Connect',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Secure Bridge Connect</h1>
      </div>
    </main>
  )
} 