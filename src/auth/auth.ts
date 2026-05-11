import bcryptjs from "bcryptjs";
import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
// import { signInSchema } from "./lib/zod";
import { signInSchema } from "@/schema/zod";
// Your own logic for dealing with plaintext password strings; be careful!
import { getUserFromDb } from "@/utils/user";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/utils/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const { email, password } =
            await signInSchema.parseAsync(credentials);

          const user = await getUserFromDb(email);

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcryptjs.compare(
            password,
            user.password,
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
