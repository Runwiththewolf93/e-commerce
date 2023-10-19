import User from "../../models/Users";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import connect from "../../utils/db";
import jwt from "jsonwebtoken";
import CustomAPIError from "../app/api/errors";
import Joi from "joi";
import axios from "axios";

export const authOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 3 * 24 * 60 * 60,
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
          redirect: Joi.string().valid("true", "false").optional(),
          callbackUrl: Joi.string().optional(),
          csrfToken: Joi.string().optional(),
          json: Joi.string().valid("true", "false").optional(),
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
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        console.log("This shouldn't trigger after login");
        const userIdString = user.id.toString();

        const { data: customJwt } = await axios.post(
          "http://localhost:3000/api/jwt",
          {
            userId: userIdString,
          }
        );
        const { customJwt: customJwtString } = customJwt;

        const decodedJwt = jwt.verify(customJwtString, process.env.JWT_SECRET);

        return {
          ...token,
          ...decodedJwt,
          customJwt: customJwtString,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        customJwt: token.customJwt,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
