import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loginWithEmailAndPassword } from '../../../../core/db/auth';
import jwt from 'jsonwebtoken';
import Validator from 'validator';
import isEmpty from 'is-empty';

const secretOrKey = process.env.JWT_SECRET;

const validateLoginInput = (data) => {
  const errors = {};
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export async function POST(req) {
  const json = await req.json();
  if (!json) {
    return NextResponse.json({}, { status: 500 });
  }

  const { errors, isValid } = validateLoginInput(json);
  if (!isValid) {
    return NextResponse.json(errors, { status: 400 });
  }

  const { email, password } = json;
  const result = await loginWithEmailAndPassword(email, password);
  if (result.error) {
    return NextResponse.json(result.error, { status: 400 });
  }

  const userData = result.payload;

  const token = jwt.sign(
    { id: userData.id },
    secretOrKey,
    { expiresIn: 31556926 } // 1 an în secunde
  );

  const cookieStore = await cookies();
  cookieStore.set('dopebase.session-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 31556926, // 1 an în secunde
  });

  return NextResponse.json(
    {
      success: true,
      token: `Bearer ${token}`,
      userData,
      errors: null,
    },
    { status: 200 }
  );
}
