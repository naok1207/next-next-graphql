import NextAuth from "next-auth"
import Auth0Provider from "next-auth/providers/auth0";
import * as jwt from 'jsonwebtoken';

export const authOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      const payload = {
        sub: token.sub,
        iat: token.iat,
        name: token.name,
      }
      token.accessToken = jwt.sign(payload, process.env.NEXTAUTH_SECRET)
      return token
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      return session;
    },
  }
}
export default NextAuth(authOptions)
