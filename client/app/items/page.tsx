import { gql } from 'graphql-request'
import { getSession } from '../../lib/getSession'
import { graphqlClient } from '../../lib/graphql-client'
import { headers, cookies } from 'next/headers'

async function fetchItems() {
  const session = await getSession()
  const res = await fetch(`${process.env.API_URL}/items`, {
    headers: {
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHw2M2Y0ZDMwNmFmOWUxMGZmODk4ZmNkNjkiLCJpYXQiOjE2NzczMDM4MzksIm5hbWUiOiJ1c2VyMSJ9.9CYaIH56ykXzNux2_5ICgywTn6UAmRgvtzETkCyb0sE`
    }
  })
  const items = await res.json()
  return Object.values(items)
}

export default async function Page() {
  const items = await fetchItems()

  if (!items) return <div></div>

  return (
    <main>
      <div className="m-10 text-center">
        <div>
          {items.map((item) => (
            <div key={item.id}>
              <p>id: {item.id}</p>
              <p>name: {item.name}</p>
              <p>price: {item.price}</p>
              <p>description: {item.description}</p>
              <img src={item.image} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
