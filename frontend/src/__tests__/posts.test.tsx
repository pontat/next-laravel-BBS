import { render } from '@testing-library/react'
import Posts from '../pages/posts'

test('新規作成ページ', () => {
  const { container } = render(<Posts />)
  expect(container).toMatchSnapshot()
})
