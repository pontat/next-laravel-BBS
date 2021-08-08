import { ReactNode } from 'react'

type layoutType = {
  children: ReactNode
}

export default function layout({ children }: layoutType) {
  return (
    <div className="min-h-screen bg-gray-200">
      <header className="p-3 bg-white border-b-4 border-indigo-600">
        <h1 className="text-xl font-bold text-gray-800">掲示板</h1>
      </header>
      <main className="container mx-auto p-6">{children}</main>
    </div>
  )
}
