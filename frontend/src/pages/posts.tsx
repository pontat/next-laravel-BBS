import { useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Posts: NextPage<{}> = () => {
  const router = useRouter()
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')

  const storePost = async (): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
      }),
    })

    response.status === 200 ? router.push('/') : alert(response.statusText)
  }

  return (
    <>
      <h3 className="text-lg font-bold leading-6 text-gray-900">新規作成</h3>
      <div className="mt-5 shadow rounded overflow-hidden">
        <div className="p-4 bg-white space-y-6">
          <div>
            <label htmlFor="title" className="text-sm font-bold text-gray-900">
              タイトル
            </label>
            <input
              type="text"
              id="title"
              placeholder="タイトルを入力"
              className="w-full p-3 bg-white text-sm border border-blueGray-300 rounded"
              onChange={(e) => setTitle(e.target.value)}
            />
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
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="flex justify-between px-4 py-3 bg-gray-100">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white rounded shadow hover:shadow-md" onClick={storePost}>
            投稿する
          </button>
          <Link href="/">
            <a className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-sm font-bold text-white rounded shadow hover:shadow-md cursor-pointer">戻る</a>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Posts
