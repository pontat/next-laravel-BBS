export type Post = {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
  comments: Comment[]
}

type Comment = {
  id: number
  post_id: number
  content: string
  created_at: string
  updated_at: string
}
