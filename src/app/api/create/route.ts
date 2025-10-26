import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateReadableId } from '@/lib/generateId';

const MAX_CHARACTERS = 50000;
const MAX_RETRIES = 5;

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    // Validate content
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content cannot be empty' },
        { status: 400 }
      );
    }

    if (content.length > MAX_CHARACTERS) {
      return NextResponse.json(
        { error: `Content exceeds maximum length of ${MAX_CHARACTERS} characters` },
        { status: 400 }
      );
    }

    // Generate unique readable ID with collision handling
    let slug: string;
    let attempts = 0;
    
    do {
      if (attempts >= MAX_RETRIES) {
        return NextResponse.json(
          { error: 'Unable to generate unique ID. Please try again.' },
          { status: 500 }
        );
      }
      
      slug = generateReadableId();
      attempts++;
      
      // Check if this slug already exists
      const docRef = doc(db, 'pastes', slug);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        break; // Found a unique slug
      }
    } while (true);

    // Create the paste document
    const pasteData = {
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    const docRef = doc(db, 'pastes', slug);
    await setDoc(docRef, pasteData);

    return NextResponse.json({ slug }, { status: 201 });
  } catch (error) {
    console.error('Error creating paste:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}