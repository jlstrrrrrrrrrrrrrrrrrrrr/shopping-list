/**
 * List Invite Token Management API Route
 *
 * Handles creation and refresh of list invite tokens. Only list owners can
 * manage invite tokens. Implements token expiration and invalidation.
 *
 * @route POST /api/lists/invite
 */

import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getAuthenticatedUser } from '@/utils/auth-utils';
import { createAdminClient } from '@/utils/supabase/server';

const TOKEN_EXPIRES_IN_HOURS = 72;

/**
 * Handles POST requests for invite token management
 *
 * @param {NextRequest} req - Request object containing listId and optional refresh flag
 * @returns {Promise<NextResponse>} JSON response with invite token
 *
 * @throws Will return 401 if user is not authenticated
 * @throws Will return 400 if listId is missing
 * @throws Will return 403 if user is not the list owner
 *
 * @security Only list owners can create/refresh tokens
 */
export async function POST(req: NextRequest) {
  try {
    // Get authenticated user from the request
    const { user, error: authError } = await getAuthenticatedUser(req);
    const { listId, refresh = false } = await req.json();

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

    // Check if user has permission to create invites for this list
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from('list_members')
      .select('role')
      .eq('list_id', listId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership || membership.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only list owners can create invites' },
        { status: 403 }
      );
    }

    // Check for existing invite if not refreshing
    if (!refresh) {
      const { data: existingInvite } = await supabaseAdmin
        .from('list_invites')
        .select('invite_token')
        .eq('list_id', listId)
        .is('invalidated_at', null)
        .single();

      if (existingInvite?.invite_token) {
        return NextResponse.json(
          { inviteToken: existingInvite.invite_token },
          { status: 200 }
        );
      }
    }

    // If refreshing or no valid invite exists:
    // 1. Invalidate any existing invites
    await supabaseAdmin
      .from('list_invites')
      .update({ invalidated_at: new Date().toISOString() })
      .eq('list_id', listId)
      .is('invalidated_at', null);

    // 2. Create new invite
    const inviteToken = nanoid(10);
    const { error: createError } = await supabaseAdmin
      .from('list_invites')
      .insert([
        {
          invite_token: inviteToken,
          list_id: listId,
          created_by: user.id,
          invalidated_at: null
        }
      ]);

    if (createError) {
      return NextResponse.json(
        { error: 'Failed to create invite token' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        inviteToken,
        refreshed: refresh
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
