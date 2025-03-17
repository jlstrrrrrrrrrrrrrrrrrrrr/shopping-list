/**
 * List Join API Route
 *
 * Handles users joining lists via invite tokens. Validates the token
 * and creates a new list membership if valid.
 *
 * @route POST /api/lists/join
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { getAuthenticatedUser } from '@/utils/auth-utils';

/**
 * Handles POST requests for joining lists
 *
 * @param {NextRequest} req - Request object containing inviteToken
 * @returns {Promise<NextResponse>} JSON response with join result
 *
 * @throws Will return 401 if user is not authenticated
 * @throws Will return 400 if token is missing or user is already a member
 * @throws Will return 404 if token is invalid or expired
 */
export async function POST(req: NextRequest) {
  try {
    // Extract the user from the request (JWT token)
    const { user, error: authError } = await getAuthenticatedUser(req);
    const { inviteToken } = await req.json();

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!inviteToken) {
      return NextResponse.json(
        { error: 'Invite token is required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Find the list with the matching invite token
    const { data: list, error: listError } = await supabaseAdmin
      .from('lists')
      .select('id')
      .eq('invite_token', inviteToken)
      .single();

    if (listError || !list) {
      return NextResponse.json(
        { error: 'Invalid or expired invite token' },
        { status: 404 }
      );
    }

    // Check if the user is already a member
    const { data: existingMember, error: checkError } = await supabaseAdmin
      .from('list_members')
      .select('id')
      .eq('list_id', list.id)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already a member of this list' },
        { status: 400 }
      );
    }

    // Add user to shopping list
    const { error: joinError } = await supabaseAdmin
      .from('list_members')
      .insert([{ list_id: list.id, user_id: user.id, role: 'member' }]);

    if (joinError) {
      return NextResponse.json(
        { error: 'Failed to join the list' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Successfully joined the list' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
