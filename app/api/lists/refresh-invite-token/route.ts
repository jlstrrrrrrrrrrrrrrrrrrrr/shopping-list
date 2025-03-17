/**
 * Invite Token Refresh API Route
 *
 * Handles regeneration of list invite tokens. Creates a new token
 * and invalidates any existing ones. Only list owners can refresh tokens.
 *
 * @route POST /api/lists/refresh-invite-token
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { getAuthenticatedUser } from '@/utils/auth-utils';
import { nanoid } from 'nanoid';

/**
 * Handles POST requests for refreshing invite tokens
 *
 * @param {NextRequest} req - Request object containing listId
 * @returns {Promise<NextResponse>} JSON response with new invite token
 *
 * @throws Will return 401 if user is not authenticated
 * @throws Will return 400 if listId is missing
 * @throws Will return 403 if user is not the list owner
 * @throws Will return 500 if token update fails
 *
 * @security Only list owners can refresh tokens
 */
export async function POST(req: NextRequest) {
  try {
    // Get authenticated user from the request
    const { user, error: authError } = await getAuthenticatedUser(req);
    const { listId } = await req.json();

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!listId) {
      return NextResponse.json(
        { error: 'List ID is required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Check if user has permission to manage invites for this list
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from('list_members')
      .select('role')
      .eq('list_id', listId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership || membership.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only list owners can manage invite tokens' },
        { status: 403 }
      );
    }

    // Generate new invite token
    const newToken = nanoid(10);
    const { error: updateError } = await supabaseAdmin
      .from('lists')
      .update({ invite_token: newToken })
      .eq('id', listId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update invite token' },
        { status: 500 }
      );
    }

    return NextResponse.json({ inviteToken: newToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
