/**
 * Password Reset Request API Route
 *
 * This endpoint handles the "forgot password" functionality by sending a password
 * reset email to the user's registered email address.
 *
 * @route POST /api/auth/forgot-password
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

/**
 * Response type for the forgot password endpoint
 * @interface ForgotPasswordResponse
 * @property {boolean} success - Indicates if the operation was successful
 * @property {string} message - User-friendly message about the operation result
 * @property {string} [error] - Error code for client-side handling
 */
interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Handles POST requests for password reset functionality
 *
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse<ForgotPasswordResponse>>} JSON response with operation result
 *
 * @throws Will return error response if email is missing or invalid
 * @throws Will return error response if user is not found
 * @throws Will return error response if password reset email fails to send
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<ForgotPasswordResponse>> {
  // Initialize Supabase clients - regular for user operations, admin for user management
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  try {
    // Parse request body and get origin for redirect URL
    const body = await req.json();
    const headersList = await headers();
    const origin = headersList.get('origin');

    // Validate required email field
    if (!body.email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is required',
          error: 'MISSING_EMAIL'
        },
        { status: 400 }
      );
    }

    const { email } = body;

    // Verify user exists before attempting password reset
    // This prevents leaking information about registered emails
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const emailExists = existingUser.users.some((user) => user.email === email);

    if (!emailExists) {
      return NextResponse.json(
        {
          success: false,
          message: 'No account found with this email',
          error: 'EMAIL_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Send password reset email through Supabase Auth
    // redirectTo ensures user is redirected to reset password page after clicking email link
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`
    });

    // Handle password reset email errors
    if (error) {
      console.error('Password reset error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send password reset email',
          error: 'RESET_ERROR'
        },
        { status: 500 }
      );
    }

    // Return success response if email was sent
    return NextResponse.json(
      {
        success: true,
        message: 'Check your email for a link to reset your password'
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error during password reset:', error);
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
