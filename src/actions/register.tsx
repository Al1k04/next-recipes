"use server";

import { RegisterFormData } from "@/types/form-data";
import { saltAndHashPassword } from "@/utils/password";
import { prisma } from "@/utils/prisma";

export async function registerUser(formData: RegisterFormData) {
  const { email, password, confirmPassword } = formData;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return { error: "A user with this email already exists." };
    }

    const pwHash = await saltAndHashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email,
        password: pwHash,
      },
    });
    return user;
  } catch (error) {
    console.log("Error registration:", error);
  }
}
