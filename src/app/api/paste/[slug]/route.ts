import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { isValidReadableId } from '@/lib/generateId';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Validate slug format
    if (!slug || !isValidReadableId(slug)) {
      return NextResponse.json(
        { error: 'Invalid paste ID format' },
        { status: 400 }
      );
    }

    // Fetch the paste from Firestore
    const docRef = doc(db, 'pastes', slug);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    const pasteData = docSnap.data();

    // Check if paste has expired (fallback if TTL policy isn't active)
    if (pasteData.expireAt) {
      const expireTime = new Date(pasteData.expireAt);
      const now = new Date();

      if (now > expireTime) {
        return NextResponse.json(
          { error: 'Paste expired' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      content: pasteData.content,
      createdAt: pasteData.createdAt,
    });
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}