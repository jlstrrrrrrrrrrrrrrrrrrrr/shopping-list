/**
 * List Deletion API Route
 *
 * Handles deletion of shopping lists. Only the list creator can delete a list.
 * Cascading deletes will remove related records (members, items, etc.).
 *
 * @route DELETE /api/lists/delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { getAuthenticatedUser } from '@/utils/auth-utils';

/**
 * Handles DELETE requests for list deletion
 *
 * @param {NextRequest} req - Request object containing listId
 * @returns {Promise<NextResponse>} JSON response with deletion result
 *
 * @throws Will return 401 if user is not authenticated
 * @throws Will return 400 if listId is missing
 * @throws Will return 403 if user is not the list creator
 * @throws Will return 404 if list is not found
 */
export async function DELETE(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(req);

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabaseAdmin = createAdminClient();
    const { listId } = await req.json();

    if (!listId) {
      return NextResponse.json(
        { error: 'List ID is required' },
        { status: 400 }
      );
    }

    // Check if the list exists and is created by the user
    const { data: list, error: fetchError } = await supabaseAdmin
      .from('lists')
      .select('created_by')
      .eq('id', listId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    if (list.created_by !== user.id) {
      return NextResponse.json(
        { error: 'You are not authorized to delete this list' },
        { status: 403 }
      );
    }

    // Proceed with deletion
    const { error: deleteError } = await supabaseAdmin
      .from('lists')
      .delete()
      .eq('id', listId);

    if (deleteError) {
      console.error('Error deleting list:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Internal server error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
