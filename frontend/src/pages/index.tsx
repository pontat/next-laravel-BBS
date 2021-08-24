import { InferGetStaticPropsType, NextPage } from 'next'
import Link from 'next/link'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export type Post = {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export const getStaticProps = async () => {
  const posts: Post[] = await fetch(`${process.env.BACKEND_URL}/api/posts`).then((response) => response.json())
  return {
    props: {
      posts,
    },
    revalidate: 10,
  }
}

const Home: NextPage<Props> = (props) => {
  const posts = props.posts

  return (
    <>
      <div className="flex">
        <Link href="/posts">
          <a className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white rounded shadow hover:shadow-md">新規作成</a>
        </Link>
      </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-3">
        {posts.map((post) => (
          <div className="bg-white shadow rounded overflow-hidden" key={post.id}>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900">{post.title}</h3>
            </div>
            <dl>
              <div className="px-4 py-2 bg-gray-100" style={{ minHeight: '76px' }}>
                <dd className="text-sm text-gray-900">{post.content}</dd>
              </div>
              <div className="flex justify-between p-4 bg-white">
                <dt className="text-sm font-medium text-gray-500">{post.created_at}</dt>
                <Link href={`/posts/${post.id}`}>
                  <a className="text-sm text-indigo-600 hover:text-indigo-500">詳細</a>
                </Link>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </>
  )
}

export default Home
