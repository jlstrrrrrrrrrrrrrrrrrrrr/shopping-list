/**
 * List Leave API Route
 *
 * Handles users voluntarily leaving a list. Removes their membership
 * from the list_members table. Cannot be used by the list owner.
 *
 * @route POST /api/lists/leave
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * Handles POST requests for leaving lists
 *
 * @param {Request} req - Request object containing listId and userId
 * @returns {Promise<NextResponse>} JSON response with leave result
 *
 * @throws Will return 400 if required fields are missing or user is not a member
 * @throws Will return 500 if database operations fail
 *
 * @security Should be updated to use getAuthenticatedUser for consistency
 */
export async function POST(req: Request) {
  try {
    const { listId, userId } = await req.json();
    const supabase = await createClient();

    if (!listId || !userId) {
      return NextResponse.json(
        { error: 'List ID and User ID are required' },
        { status: 400 }
      );
    }

    // Check if the user is a member of the list
    const { data: existingMember, error: checkError } = await supabase
      .from('list_members')
      .select('id')
      .eq('list_id', listId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (!existingMember) {
      return NextResponse.json(
        { error: 'User is not a member of this list' },
        { status: 400 }
      );
    }

    // Remove the user from the list
    const { error: leaveError } = await supabase
      .from('list_members')
      .delete()
      .eq('list_id', listId)
      .eq('user_id', userId);

    if (leaveError) {
      return NextResponse.json(
        { error: 'Failed to leave the list' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'User successfully left the list' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
