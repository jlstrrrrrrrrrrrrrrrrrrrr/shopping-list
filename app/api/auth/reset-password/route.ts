/**
 * Password Reset API Route
 *
 * This endpoint handles the actual password update after a user clicks the reset
 * link in their email. It validates the new password, confirms it matches, and
 * updates it in Supabase Auth.
 *
 * @route POST /api/auth/reset-password
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * Response type for the reset password endpoint
 * @interface ResetPasswordResponse
 * @property {boolean} success - Indicates if the operation was successful
 * @property {string} message - User-friendly message about the operation result
 * @property {string} [error] - Error code for client-side handling
 */
interface ResetPasswordResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Handles POST requests for password update functionality
 *
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse<ResetPasswordResponse>>} JSON response with operation result
 *
 * @throws Will return error response if passwords are missing
 * @throws Will return error response if passwords don't match
 * @throws Will return error response if password is same as current
 * @throws Will return error response if update fails
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<ResetPasswordResponse>> {
  // Initialize Supabase client for auth operations
  const supabase = await createClient();

  try {
    // Parse and validate request body
    const body = await req.json();

    // Check for required fields
    if (!body.password || !body.confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password and confirm password are required',
          error: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    const { password, confirmPassword } = body;

    // Verify password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Passwords do not match',
          error: 'PASSWORD_MISMATCH'
        },
        { status: 400 }
      );
    }

    // Attempt to update the user's password
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('Password update error:', error);

      // Handle case where new password is same as current password
      if (error.code === 'same_password') {
        return NextResponse.json(
          {
            success: false,
            message:
              'New password must be different from your current password',
            error: 'SAME_PASSWORD'
          },
          { status: 422 }
        );
      }

      // Handle other update errors
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update password',
          error: 'UPDATE_ERROR'
        },
        { status: 500 }
      );
    }

    // Return success response if password was updated
    return NextResponse.json(
      {
        success: true,
        message: 'Password updated successfully'
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
