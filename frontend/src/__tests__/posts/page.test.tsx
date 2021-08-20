import { render } from '@testing-library/react'
import Page from '../../pages/posts/[id]'

test('詳細ページ', () => {
  const { container } = render(
    <Page
      post={{
        id: 1,
        title: 'テストタイトル',
        content: 'テスト内容',
        created_at: '2021.01.01',
        updated_at: '2021.01.01',
        comments: [
          { id: 1, post_id: 1, content: 'テストコメント1', created_at: '2021.01.01', updated_at: '2021.01.01' },
          { id: 2, post_id: 1, content: 'テストコメント2', created_at: '2021.01.01', updated_at: '2021.01.01' },
          { id: 3, post_id: 1, content: 'テストコメント3', created_at: '2021.01.01', updated_at: '2021.01.01' },
        ],
      }}
    />
  )
  expect(container).toMatchSnapshot()
})
