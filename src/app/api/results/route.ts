import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import { Result } from '@/models/Result';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'timestamp';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    const search = searchParams.get('search') || '';

    // Build query
    const query: any = {};
    if (search) {
      // Allow searching by userId (employee ID)
      query.userId = { $regex: search, $options: 'i' };
    }

    const sortOption: any = {};
    sortOption[sortBy] = sortOrder;

    // Execute query
    const results = await Result.find(query).sort(sortOption).lean();

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Failed to fetch results:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch results' }, { status: 500 });
  }
}
