/**
 * List Member Removal API Route
 *
 * Handles removal of members from a list by the list owner.
 * Only the list owner can remove other members.
 *
 * @route POST /api/lists/remove-member
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * Handles POST requests for removing list members
 *
 * @param {Request} req - Request object containing listId, userId, and ownerId
 * @returns {Promise<NextResponse>} JSON response with removal result
 *
 * @throws Will return 400 if required fields are missing
 * @throws Will return 403 if requester is not the list owner
 * @throws Will return 404 if list is not found
 * @throws Will return 400 if user is not a member
 *
 * @security Should be updated to use getAuthenticatedUser and createAdminClient
 */
export async function POST(req: Request) {
  try {
    const { listId, userId, ownerId } = await req.json(); // ownerId is the user who wants to remove someone
    const supabase = await createClient();

    if (!listId || !userId || !ownerId) {
      return NextResponse.json(
        { error: 'List ID, User ID, and Owner ID are required' },
        { status: 400 }
      );
    }

    // Check if the owner is the actual owner of the list
    const { data: listOwner, error: ownerError } = await supabase
      .from('lists')
      .select('created_by')
      .eq('id', listId)
      .single();

    if (ownerError || !listOwner) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    if (listOwner.created_by !== ownerId) {
      return NextResponse.json(
        { error: 'Only the owner can remove members' },
        { status: 403 }
      );
    }

    // Check if the user to be removed is a member of the list
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
    const { error: removeError } = await supabase
      .from('list_members')
      .delete()
      .eq('list_id', listId)
      .eq('user_id', userId);

    if (removeError) {
      return NextResponse.json(
        { error: 'Failed to remove the user from the list' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'User successfully removed from the list' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
