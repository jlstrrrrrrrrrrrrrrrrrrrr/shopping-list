/**
 * List Item Creation API Route
 *
 * Handles the creation of new items in a shopping list. Includes security checks
 * to ensure the user has permission to add items to the specified list.
 *
 * @route POST /api/list-items/add
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { getAuthenticatedUser } from '@/utils/auth-utils';

/**
 * Handles POST requests for creating new list items
 *
 * @param {NextRequest} req - Request object containing listId, name, and optional description
 * @returns {Promise<NextResponse>} JSON response with creation result
 *
 * @throws Will return 401 if user is not authenticated
 * @throws Will return 400 if required fields are missing
 * @throws Will return 403 if user is not a list member
 * @throws Will return 500 for database errors
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const { user, error: authError } = await getAuthenticatedUser(req);
    const body = await req.json();

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate required fields
    const { listId, name, description } = body;

    if (!listId || !name) {
      return NextResponse.json(
        { error: 'List ID and Item Name are required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Verify list membership for security
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from('list_members')
      .select('id, role')
      .eq('list_id', listId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'Access denied. You are not a member of this list.' },
        { status: 403 }
      );
    }

    // Create new list item
    const { error } = await supabaseAdmin.from('list_items').insert([
      {
        list_id: listId,
        name,
        description,
        status: 'open',
        added_by: user.id
      }
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Item successfully added' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
