/**
 * Sign In API Route
 *
 * Handles user authentication using email and password credentials.
 * Uses Supabase Auth for secure password verification and session management.
 *
 * @route POST /api/auth/sign-in
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * Response type for the sign-in endpoint
 * @interface SignInResponse
 * @property {boolean} success - Indicates if the authentication was successful
 * @property {string} message - User-friendly message about the operation result
 * @property {string} [error] - Error code for client-side handling
 */
interface SignInResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Handles POST requests for user authentication
 *
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse<SignInResponse>>} JSON response with authentication result
 *
 * @throws Will return 400 if credentials are missing
 * @throws Will return 401 if credentials are invalid
 * @throws Will return 500 for unexpected errors
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<SignInResponse>> {
  try {
    // Parse and validate request body
    const body = await req.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
          error: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    const { email, password } = body;
    const supabase = await createClient();

    // Attempt authentication with Supabase
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password
      }
    );

    // Handle authentication errors
    if (signInError) {
      console.error('Sign in error:', signInError);
      return NextResponse.json(
        {
          success: false,
          message: signInError.message || 'Invalid login credentials',
          error: signInError.code
        },
        { status: 401 }
      );
    }

    // Return success response with session
    return NextResponse.json(
      {
        success: true,
        message: 'Successfully signed in'
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error during sign in:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred',
        error: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}
