import { Request, Response } from 'express';
import {
  RegisterRequestBody,
  RegisterResponseBody,
} from '../types/auth.types.js';
import { eq } from 'drizzle-orm';
import { users } from '../database/schema.js';
import { db } from '../database/mysql.database.js';
import bcrypt from 'bcrypt';

export const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response<RegisterResponseBody>,
) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  const saltRounds = 12;
  const isValidPassword = (password: string): boolean => {
    return (
      password.length >= 8 &&
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  if (
    [firstName, lastName, email, password, confirmPassword].some(
      (value) => !value,
    )
  ) {
    return res.status(422).json({
      message: 'All fields are required',
    });
  }

  if (password !== confirmPassword) {
    return res.status(422).json({
      message: 'Password must match password confirmation field',
    });
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser.length > 0) {
    return res.status(409).json({
      message: 'Email is already registered',
    });
  }

  if (!isValidPassword(password)) {
    return res.status(422).json({
      message: 'Password does not fulfill password requirements',
    });
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);

  await db.insert(users).values({
    firstName: firstName.toLowerCase(),
    lastName: lastName.toLowerCase(),
    email: email,
    passwordHash: passwordHash,
    isEmailVerified: true,
  });

  return res.status(201).json({
    message: 'Registration successful',
  });
};
