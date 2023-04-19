// app 直下の layout はルートレイアウトとして適用される
// page/_app.tsx の中に書くようなことを書くことができる

import '../styles/globals.css'
import NavBar from './components/nav-bar'
import Providers from "./providers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
