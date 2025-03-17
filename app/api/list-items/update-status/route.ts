/**
 * List Item Status Update API Route
 *
 * Handles updating the status of items in a shopping list.
 * Currently supports changing item status (e.g., open, completed).
 *
 * @route PATCH /api/list-items/update-status
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * Handles PATCH requests for updating item status
 *
 * @param {Request} req - Request object containing itemId and new status
 * @returns {Promise<NextResponse>} JSON response with update result
 *
 * @throws Will return 400 if required fields are missing
 * @throws Will return 500 for database errors
 *
 * @security This route should be updated to include authentication and
 * permission checks similar to other list-item routes
 */
export async function PATCH(req: Request) {
  try {
    const { itemId, status } = await req.json();
    const supabase = await createClient();

    // Validate required fields
    if (!itemId || !status) {
      return NextResponse.json(
        { error: 'Item ID and Status are required' },
        { status: 400 }
      );
    }

    // Update item status
    const { error } = await supabase
      .from('shopping_list_items')
      .update({ status })
      .eq('id', itemId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Item status successfully updated' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
