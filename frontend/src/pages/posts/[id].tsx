import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Link from 'next/link'

type Props = {
  post: Post
}

type Post = {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const id = params?.id
  const post = await fetch(`${process.env.BACKEND_URL}/api/posts/${id}`).then((response) => response.json())
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

const Post: NextPage<Props> = (props) => {
  const post = props.post

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

export default Post