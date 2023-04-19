import { gql } from 'graphql-request'
import { getSession } from '../../lib/getSession'
import { graphqlClient } from '../../lib/graphql-client'

const query = gql`
  query Post {
    posts {
      id
      title
      content
    }
  }
`

type Post = {
  id: string
  title: string
  content: string
}

type Res = {
  posts: Post[]
}

async function fetchPosts() {
  const session = await getSession()
  graphqlClient.setHeader('authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHw2M2Y0ZDMwNmFmOWUxMGZmODk4ZmNkNjkiLCJpYXQiOjE2NzczMDM4MzksIm5hbWUiOiJ1c2VyMSJ9.9CYaIH56ykXzNux2_5ICgywTn6UAmRgvtzETkCyb0sE`)
  console.log(session.user.accessToken)
  try {
    const { posts } = await graphqlClient.request<Res>(query)
    return posts
  } catch(err) {
    return []
  }
}

export default async function Page() {
  const posts = await fetchPosts()

  return (
    <main>
      <div className="m-10 text-center">
        <div>
          {posts.map((post: Post) => (
            <div key={post.id} className='border border-gray-400 p-4 m-4'>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
