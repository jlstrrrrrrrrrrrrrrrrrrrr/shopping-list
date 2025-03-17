/**
 * Sign Up API Route
 *
 * Handles new user registration with the following steps:
 * 1. Creates auth user in Supabase
 * 2. Creates user profile in public schema
 * 3. Sends email verification
 *
 * @route POST /api/auth/sign-up
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

/**
 * Response type for the sign-up endpoint
 * @interface SignUpResponse
 * @property {boolean} success - Indicates if registration was successful
 * @property {string} message - User-friendly message about the operation result
 * @property {string} [error] - Error code for client-side handling
 */
interface SignUpResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Handles POST requests for user registration
 *
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse<SignUpResponse>>} JSON response with registration result
 *
 * @throws Will return 400 if required fields are missing
 * @throws Will return 409 if email already exists
 * @throws Will return 500 if profile creation fails
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<SignUpResponse>> {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  try {
    // Parse request and get origin for email redirect
    const body = await req.json();
    const headersList = await headers();
    const origin = headersList.get('origin');

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

    // Check for existing user to prevent duplicates
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const emailExists = existingUser.users.some((user) => user.email === email);

    if (emailExists) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email already registered',
          error: 'EMAIL_EXISTS'
        },
        { status: 409 }
      );
    }

    // Step 1: Create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          email_confirmed: false // Explicitly mark as unconfirmed
        }
      }
    });

    // Handle auth user creation errors
    if (signUpError || !authData.user) {
      console.error('Sign up error:', signUpError);
      return NextResponse.json(
        {
          success: false,
          message: signUpError?.message || 'Error creating user account',
          error: signUpError?.code || 'SIGNUP_ERROR'
        },
        { status: 400 }
      );
    }

    // Step 2: Create user profile
    const username = email.split('@')[0];
    const { error: profileError, data: profileData } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        username: username,
        created_at: new Date().toISOString()
      });

    // Handle profile creation errors and cleanup if necessary
    if (profileError) {
      console.error('Profile creation error details:', {
        error: profileError,
        user: authData.user,
        profileData
      });

      // Clean up by deleting the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

      return NextResponse.json(
        {
          success: false,
          message: `Failed to create user profile: ${profileError.message}`,
          error: 'PROFILE_CREATION_ERROR'
        },
        { status: 500 }
      );
    }

    // Step 3: Send confirmation email
    if (authData.user.identities?.length === 0) {
      const { error: emailError } =
        await supabaseAdmin.auth.admin.inviteUserByEmail(email);

      if (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Non-blocking error - registration still successful
      }
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Please check your email to verify your account'
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error during sign up:', error);
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
