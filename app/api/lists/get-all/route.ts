/**
 * Lists Retrieval API Route
 *
 * Fetches all lists that the user is a member of, including:
 * - Basic list information
 * - Member information with profiles
 * - Invite tokens (if user has permission)
 *
 * Performs multiple queries to build a complete response with nested data.
 *
 * @route GET /api/lists/get-all
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { getAuthenticatedUser } from '@/utils/auth-utils';

/**
 * Handles GET requests for retrieving user's lists
 *
 * @param {NextRequest} req - Request object
 * @returns {Promise<NextResponse>} JSON response with lists and member data
 *
 * @throws Will return 401 if user is not authenticated
 * @throws Will return 500 if database queries fail
 *
 * @security Filters lists based on user's membership
 */
export async function GET(req: NextRequest) {
  try {
    // Extract the user from the request (JWT token)
    const { user, error: authError } = await getAuthenticatedUser(req);

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createAdminClient();

    // Step 1: Query the database for lists that the user is a member of
    const { data: listData, error: listError } = await supabaseAdmin
      .from('lists')
      .select(
        `
        id,
        name,
        created_by,
        created_at,
        invite_token,
        list_members!inner (
          user_id
        )
      `
      )
      .eq('list_members.user_id', user.id);

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    // Extract list_ids from the listData
    const listIds = listData.map((item) => item.id);

    // Step 2: Query all members of these lists
    const { data: memberData, error: memberError } = await supabaseAdmin
      .from('list_members')
      .select('user_id, list_id')
      .in('list_id', listIds);

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }
    // Extract user_ids for all members of the lists
    const userIds = Array.from(new Set(memberData.map((item) => item.user_id)));

    // Step 3: Fetch profiles for these user_ids
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', userIds);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    // Step 4: Combine list data with member profiles
    const listsWithMembers = listData.map((list) => {
      const listMembers = memberData
        .filter((item) => item.list_id === list.id)
        .map((item) => item.user_id);

      const membersProfiles = profiles.filter((profile) =>
        listMembers.includes(profile.id)
      );

      return {
        ...list,
        members: membersProfiles
      };
    });

    return NextResponse.json(listsWithMembers);
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
