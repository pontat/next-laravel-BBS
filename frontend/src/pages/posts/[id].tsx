import { useCallback, useState } from 'react'
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next'
import Link from 'next/link'
import type { Post } from '../index'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params?.id
  const post: Post = await fetch(`${process.env.BACKEND_URL}/api/posts/${id}`).then((response) => response.json())
  return {
    props: {
      post,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const Page: NextPage<Props> = (props) => {
  const post = props.post
  const [comments, setComments] = useState(props.post.comments)
  const [content, setContent] = useState('')

  const storeComment = async (): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
      }),
    })

    if (response.status === 200) {
      const storedComment = await response.json()
      setComments([...comments, storedComment])
      setContent('')
    } else {
      alert(response.statusText)
    }
  }

  return (
    <>
      <h3 className="text-lg font-bold leading-6 text-gray-900">詳細</h3>
      <div className="mt-5 shadow rounded overflow-hidden">
        <div className="p-4 bg-white space-y-6">
          <div>
            <div className="text-sm font-bold text-gray-900">タイトル</div>
            <div className="text-sm text-gray-900">{post.title}</div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">内容</div>
            <div className="text-sm text-gray-900 whitespace-pre-wrap">{post.content}</div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">投稿日</div>
            <div className="text-sm text-gray-900">{post.created_at}</div>
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
            <input
              type="text"
              id="comment"
              placeholder="コメントを入力"
              className="w-full p-3 bg-white text-sm border border-blueGray-300 rounded"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
        <div className="flex px-4 py-3 bg-gray-100">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white rounded shadow hover:shadow-md" onClick={storeComment}>
            コメントする
          </button>
        </div>
      </div>
      {comments.map((comment) => (
        <div className="mt-5 bg-white shadow rounded overflow-hidden" key={comment.id}>
          <div className="p-4 bg-white">
            <p className="text-sm text-gray-900">{comment.content}</p>
          </div>
          <div className="px-4 py-3 bg-gray-100">
            <p className="text-sm font-medium text-gray-500">{comment.created_at}</p>
          </div>
        </div>
      ))}
    </>
  )
}

export default Page
