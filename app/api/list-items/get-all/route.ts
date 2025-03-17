/**
 * List Items Retrieval API Route
 *
 * Fetches all items for a specific shopping list. Includes security checks
 * to ensure only list members can view items. Returns items sorted by creation date.
 *
 * @route GET /api/list-items/get-all
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { getAuthenticatedUser } from '@/utils/auth-utils';

/**
 * Handles GET requests for retrieving list items
 *
 * @param {NextRequest} req - Request object containing listId as query parameter
 * @returns {Promise<NextResponse>} JSON response with list items
 *
 * @throws Will return 401 if user is not authenticated
 * @throws Will return 400 if listId is missing
 * @throws Will return 403 if user is not a list member
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const { user, error: authError } = await getAuthenticatedUser(req);

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || 'Unauthorized' },
        { status: 401 }
      );
    }

    const listId = req.nextUrl.searchParams.get('listId');

    if (!listId) {
      return NextResponse.json(
        { error: 'List ID is required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Verify list membership
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from('list_members')
      .select('id')
      .eq('list_id', listId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'Access denied. You are not a member of this list.' },
        { status: 403 }
      );
    }

    // Fetch items with selected fields
    const { data, error } = await supabaseAdmin
      .from('list_items')
      .select('id, name, description, status, created_at, added_by')
      .eq('list_id', listId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
