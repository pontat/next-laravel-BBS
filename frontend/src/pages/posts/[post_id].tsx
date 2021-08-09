import Link from 'next/link'

export default function Posts() {
  return (
    <>
      <h3 className="text-lg font-bold leading-6 text-gray-900">詳細</h3>
      <div className="mt-5 shadow rounded overflow-hidden">
        <div className="p-4 bg-white space-y-6">
          <div>
            <label htmlFor="title" className="text-sm font-bold text-gray-900">
              タイトル
            </label>
            <input type="text" id="title" placeholder="タイトルを入力" className="w-full p-3 bg-white text-sm border border-blueGray-300 rounded" disabled />
          </div>
          <div>
            <label htmlFor="content" className="text-sm font-bold text-gray-900">
              内容
            </label>
            <textarea
              id="content"
              rows={5}
              placeholder="内容を入力"
              className="w-full p-3 bg-white text-sm border border-blueGray-300 rounded"
              disabled
            ></textarea>
          </div>
        </div>
        <div className="flex px-4 py-3 bg-gray-100">
          <Link href="/">
            <a className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-sm font-bold text-white rounded shadow hover:shadow-md cursor-pointer">戻る</a>
          </Link>
        </div>
      </div>
      <div className="mt-5 shadow rounded overflow-hidden">
        <div className="p-4 bg-white space-y-6">
          <div>
            <label htmlFor="comment" className="text-sm font-bold text-gray-900">
              コメント
            </label>
            <input type="text" id="comment" placeholder="コメントを入力" className="w-full p-3 bg-white text-sm border border-blueGray-300 rounded" />
          </div>
        </div>
        <div className="flex px-4 py-3 bg-gray-100">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white rounded shadow hover:shadow-md">コメントする</button>
        </div>
      </div>
      <div className="mt-5 bg-white shadow rounded overflow-hidden">
        <div className="p-4 bg-white">
          <p className="text-sm text-gray-900">内容が入ります。内容が入ります。内容が入ります。内容が入ります。</p>
        </div>
        <div className="px-4 py-3 bg-gray-100">
          <p className="text-sm font-medium text-gray-500">2020.12.28</p>
        </div>
      </div>
    </>
  )
}
