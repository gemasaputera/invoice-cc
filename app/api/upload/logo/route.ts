import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { uploadLogo, deleteLogo, extractKeyFromUrl, isR2Configured } from '@/lib/storage/r2';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    // Check if R2 is configured
    if (!isR2Configured()) {
      return NextResponse.json(
        { error: 'Storage service not configured' },
        { status: 500 }
      );
    }

    // Get session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Additional server-side validation for image dimensions
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Skip dimension check for SVG files
      if (file.type !== 'image/svg+xml') {
        const metadata = await sharp(buffer).metadata();

        if (metadata.width && metadata.height) {
          const maxWidth = 400;
          const maxHeight = 200;

          if (metadata.width > maxWidth || metadata.height > maxHeight) {
            return NextResponse.json(
              {
                error: `Image dimensions must be ${maxWidth}x${maxHeight} pixels or smaller. Current: ${metadata.width}x${metadata.height}`
              },
              { status: 400 }
            );
          }
        }
      }
    } catch (imageError) {
      // If image processing fails, continue with upload but log the error
      console.warn('Could not validate image dimensions:', imageError);
    }

    // Get current user to check for existing logo
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { logoUrl: true }
    });

    // Delete existing logo if it exists
    if (currentUser?.logoUrl) {
      const existingKey = extractKeyFromUrl(currentUser.logoUrl);
      if (existingKey) {
        try {
          await deleteLogo(existingKey);
        } catch (deleteError) {
          console.warn('Failed to delete existing logo:', deleteError);
          // Continue with upload even if deletion fails
        }
      }
    }

    // Upload new logo
    const uploadResult = await uploadLogo(file, session.user.id);

    // Update user record with new logo URL
    await prisma.user.update({
      where: { id: session.user.id },
      data: { logoUrl: uploadResult.url }
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      message: 'Logo uploaded successfully'
    });

  } catch (error) {
    console.error('Logo upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload logo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check if R2 is configured
    if (!isR2Configured()) {
      return NextResponse.json(
        { error: 'Storage service not configured' },
        { status: 500 }
      );
    }

    // Get session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { logoUrl: true }
    });

    if (!currentUser?.logoUrl) {
      return NextResponse.json(
        { error: 'No logo to delete' },
        { status: 404 }
      );
    }

    // Delete file from R2
    const key = extractKeyFromUrl(currentUser.logoUrl);
    if (key) {
      await deleteLogo(key);
    }

    // Update user record to remove logo URL
    await prisma.user.update({
      where: { id: session.user.id },
      data: { logoUrl: null }
    });

    return NextResponse.json({
      success: true,
      message: 'Logo deleted successfully'
    });

  } catch (error) {
    console.error('Logo deletion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete logo' },
      { status: 500 }
    );
  }
}