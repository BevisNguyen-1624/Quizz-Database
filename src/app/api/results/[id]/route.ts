import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import { Result } from '@/models/Result';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Id is required' }, { status: 400 });
    }

    const deletedItem = await Result.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return NextResponse.json({ success: false, error: 'Result not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedItem });
  } catch (error) {
    console.error('Failed to delete result:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete result' }, { status: 500 });
  }
}
