import { render } from '@testing-library/react'
import Home from '../pages/index'

test('一覧ページ', () => {
  const { container } = render(
    <Home
      posts={[
        {
          id: 1,
          title: 'テストタイトル1',
          content: 'テスト内容1',
          created_at: '2021.01.01',
          updated_at: '2021.01.01',
        },
        {
          id: 2,
          title: 'テストタイトル2',
          content: 'テスト内容2',
          created_at: '2021.01.01',
          updated_at: '2021.01.01',
        },
        {
          id: 3,
          title: 'テストタイトル3',
          content: 'テスト内容3',
          created_at: '2021.01.01',
          updated_at: '2021.01.01',
        },
      ]}
    />
  )
  expect(container).toMatchSnapshot()
})
