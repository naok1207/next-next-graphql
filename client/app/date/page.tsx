import { gql } from 'graphql-request'
import { getSession } from '../../lib/getSession'
import { graphqlClient } from '../../lib/graphql-client'

const query = gql`
  query date {
    date
  }
`

async function fetchPosts() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const session = await getSession()
    graphqlClient.setHeader('authorization', `Bearer ${session.accessToken}`)
    const { date } = await graphqlClient.request(query)
    return date
  } catch (err) {
    return `${err}`
  }
}

export default async function Page() {
  const date = await fetchPosts()

  return (
    <main>
      <div className="m-10 text-center">
        <div>
          <p>{ date }</p>
        </div>
      </div>
    </main>
  )
}
