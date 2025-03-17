/**
 * List Item Deletion API Route
 *
 * Handles the deletion of items from a shopping list. Includes security checks
 * to ensure only the item creator can delete it.
 *
 * @route DELETE /api/list-items/delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { getAuthenticatedUser } from '@/utils/auth-utils';

/**
 * Handles DELETE requests for removing list items
 *
 * @param {NextRequest} req - Request object containing itemId
 * @returns {Promise<NextResponse>} JSON response with deletion result
 *
 * @throws Will return 401 if user is not authenticated
 * @throws Will return 400 if itemId is missing
 * @throws Will return 403 if user didn't create the item
 * @throws Will return 404 if item doesn't exist
 */
export async function DELETE(req: NextRequest) {
  try {
    // Authenticate user
    const { user, error: authError } = await getAuthenticatedUser(req);

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabaseAdmin = createAdminClient();
    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    // Verify item exists and check ownership
    const { data: listItem, error: fetchError } = await supabaseAdmin
      .from('list_items')
      .select('id, added_by')
      .eq('id', itemId)
      .single();

    if (fetchError || !listItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Verify ownership
    if (listItem.added_by !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this item' },
        { status: 403 }
      );
    }

    // Delete the item
    const { error } = await supabaseAdmin
      .from('list_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Item successfully deleted' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
