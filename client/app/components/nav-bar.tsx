import Link from 'next/link'

export default function NavBar() {
  return (
    <header className="bg-gray-800 p-4">
      <nav className="space-x-4">
        <Link
          href="/"
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          Home
        </Link>
        <Link
          href={`${process.env.API_URL}/graphql`}
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          Graphql
        </Link>
        <Link
          href="/posts"
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          Posts
        </Link>
        <Link
          href="/items"
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          items
        </Link>
        <Link
          href="/date"
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          date
        </Link>
        <Link
          href="/api/auth/signin"
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          SignIn
        </Link>
        <Link
          href="/api/auth/signout"
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          SignOut
        </Link>
      </nav>
    </header>
  )
}
