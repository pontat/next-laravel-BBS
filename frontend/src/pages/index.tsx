import Link from 'next/link'
import Pagination from '../components/pagination'

export default function Home() {
  return (
    <>
      <div className="flex">
        <Link href="/posts">
          <a className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white rounded shadow hover:shadow-md cursor-pointer">新規作成</a>
        </Link>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-3">
        {[1, 2, 3].map((post, index) => (
          <div className="bg-white shadow rounded overflow-hidden" key={index}>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900">掲示板のタイトル</h3>
            </div>
            <dl>
              <div className="px-4 py-2 bg-gray-100">
                <dd className="text-sm text-gray-900">内容が入ります。内容が入ります。内容が入ります。内容が入ります。</dd>
              </div>
              <div className="flex justify-between p-4 bg-white">
                <dt className="text-sm font-medium text-gray-500">2020.12.28</dt>
                <Link href="/posts/1">
                  <a className="text-sm text-indigo-600 hover:text-indigo-500">詳細</a>
                </Link>
              </div>
            </dl>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-center">
        <Pagination></Pagination>
      </div>
    </>
  )
}
