import User from "../../models/Users";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import connect from "../../utils/db";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import CustomAPIError from "../app/api/errors";
import Joi from "joi";

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

        // Joi validation
        const schema = Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required(),
        });

        const { error } = schema.validate(credentials);
        if (error) {
          throw new CustomAPIError.BadRequestError(error.details[0].message);
        }

        // Find user by email
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new CustomAPIError.NotFoundError("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new CustomAPIError.BadRequestError("Invalid credentials");
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
    maxAge: 86400,
    signingKey: process.env.NEXTAUTH_SECRET,
    sign: async options => {
      const { secret, token, maxAge, user } = options;
      const issuedAt = Math.floor(Date.now() / 1000);
      const expiresAt = issuedAt + maxAge; // Using maxAge for consistency
      const jwtClaims = {
        name: user.name,
        email: user.email,
        sub: user.id.toString(),
        id: user.id.toString(),
        iat: issuedAt,
        exp: expiresAt,
        jti: crypto.randomBytes(16).toString("hex"),
      };
      const tokenPayload = jwt.sign(jwtClaims, secret, {
        algorithm: "HS256",
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
      if (user) {
        const issuedAt = Math.floor(Date.now() / 1000);
        const expiresAt = issuedAt + 86400;
        const u = user;
        return {
          ...token,
          id: u.id,
          iat: issuedAt,
          exp: expiresAt,
          jti: crypto.randomBytes(16).toString("hex"),
        };
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
