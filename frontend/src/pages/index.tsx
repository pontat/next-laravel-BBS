import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>掲示板</title>
        <meta name="description" content="Next.js×Laravel BBS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-200">
        <header className="p-3 bg-white border-b-4 border-indigo-600">
          <h1 className="text-xl font-bold text-gray-800">掲示板</h1>
        </header>
        <main className="container mx-auto p-6"></main>
      </div>
    </div>
  )
}
