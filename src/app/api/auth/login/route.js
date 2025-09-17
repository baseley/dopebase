import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loginWithEmailAndPassword } from '../../../../core/db/auth';
import jwt from 'jsonwebtoken';
import Validator from 'validator';
import isEmpty from 'is-empty';

const secretOrKey = process.env.JWT_SECRET;

const validateLoginInput = (data) => {
  const errors = {};

  const email = !isEmpty(data.email) ? data.email : '';
  const password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export async function POST(req) {
  try {
    if (!secretOrKey) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    const json = await req.json();

    const { errors, isValid } = validateLoginInput(json);
    if (!isValid) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { email, password } = json;
    const result = await loginWithEmailAndPassword(email, password);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const userData = result.payload;

    const token = jwt.sign(
      { id: userData.id },
      secretOrKey,
      { expiresIn: 31556926 } // 1 year
    );

    const cookieStore = cookies(); // no await here
    cookieStore.set('dopebase.session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 31556926, // 1 year
    });

    return NextResponse.json({
      success: true,
      token: `Bearer ${token}`,
      userData,
    }, { status: 200 });

  } catch (err) {
    console.error('Login Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
