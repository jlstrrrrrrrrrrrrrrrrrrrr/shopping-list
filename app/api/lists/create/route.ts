/**
 * List Creation API Route
 *
 * Handles creation of new shopping lists. Creates three related records:
 * 1. The list itself
 * 2. A list membership record for the creator (as owner)
 * 3. An initial invite token for sharing
 *
 * @route POST /api/lists/create
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { List } from '@/types';
import { ZodIssue } from 'zod';
import { getAuthenticatedUser } from '@/utils/auth-utils';
import { nanoid } from 'nanoid';

/**
 * Handles POST requests for list creation
 *
 * @param {NextRequest} req - Request object containing list name
 * @returns {Promise<NextResponse>} JSON response with created list or error
 *
 * @throws Will return 401 if user is not authenticated
 * @throws Will return 400 if list name is missing
 * @throws Will return 500 if database operations fail
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<List | { error: string } | { error: ZodIssue[] }>> {
  try {
    // Extract the user from the request (JWT token)
    const { user, error: authError } = await getAuthenticatedUser(req);
    const body = await req.json();

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!body.name) {
      return NextResponse.json(
        { error: 'List name is required' },
        { status: 400 }
      );
    }

    const { name } = body;

    // Use admin client
    const supabaseAdmin = createAdminClient();

    // Create the list
    const { data: list, error: createError } = await supabaseAdmin
      .from('lists')
      .insert([
        {
          name,
          created_by: user.id
        }
      ])
      .select()
      .single();

    if (createError) {
      return NextResponse.json(
        { error: 'Failed to create list' },
        { status: 500 }
      );
    }

    // Add creator as owner
    const { error: memberError } = await supabaseAdmin
      .from('list_members')
      .insert([
        {
          list_id: list.id,
          user_id: user.id,
          role: 'owner'
        }
      ]);

    if (memberError) {
      return NextResponse.json(
        { error: 'Failed to set list ownership' },
        { status: 500 }
      );
    }

    // Create default invite token
    const { error: inviteError } = await supabaseAdmin
      .from('list_invites')
      .insert([
        {
          list_id: list.id,
          invite_token: nanoid(10),
          created_by: user.id
        }
      ]);

    if (inviteError) {
      return NextResponse.json(
        { error: 'Failed to create invite token' },
        { status: 500 }
      );
    }

    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
