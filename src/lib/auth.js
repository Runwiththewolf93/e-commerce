import User from "../../models/Users";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import connect from "../../utils/db";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const authOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect();
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Find user by email
        const user = await User.findOne({ email: credentials.email }).catch(
          err => console.log("Error during User.findOne:", err)
        );

        const isPasswordValid = user
          ? await bcrypt.compare(credentials.password, user.password)
          : false;

        // Check if the user exists and the password is correct
        if (!user || !isPasswordValid) {
          return null;
        }

        // Return user info
        return {
          id: user._id,
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  jwt: {
    signingKey: process.env.NEXTAUTH_SECRET,
    sign: async options => {
      const { secret, token, maxAge, user } = options;
      const jwtClaims = {
        name: user.name,
        email: user.email,
        sub: user.id.toString(),
        id: user.id.toString(),
        iat: Math.floor(Date.now() / 1000),
        jti: crypto.randomBytes(16).toString("hex"),
      };
      const tokenPayload = jwt.sign(jwtClaims, secret, {
        algorithm: "HS256",
        expiresIn: "1d",
      });
      return tokenPayload;
    },
  },
  callbacks: {
    session: async ({ session, token }) => {
      const customJwtToken = jwt.sign(
        { id: token.id, name: token.name, email: token.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return {
        ...session,
        customJwt: customJwtToken,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    jwt: async ({ token, user }) => {
      console.log("🚀 ~ file: auth.js:85 ~ jwt: ~ token:", token);
      if (user) {
        const u = user;
        return {
          ...token,
          id: u.id,
        };
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
