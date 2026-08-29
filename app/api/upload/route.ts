import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

import { getAdminSessionBusiness } from "@/lib/admin/session";

// =========================================================
// IMAGE UPLOAD
// POST /api/upload
//
// Uploads a single image to Cloudinary and returns a public
// HTTPS URL. Only authenticated admins/sellers can upload.
// The business is derived from the authenticated session;
// the client can never choose another seller's business.
//
// Cloudinary credentials must be provided via environment
// variables (server-side only). They are never exposed to
// the browser.
// =========================================================

// Allowed image formats.
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

// Maximum file size (5 MB).
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    // -----------------------------------------------------
    // AUTHENTICATION
    // Only signed-in sellers/admins may upload.
    // -----------------------------------------------------

    const session =
      await getAdminSessionBusiness();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    // -----------------------------------------------------
    // CREDENTIALS GATE
    // Refuse the request if Cloudinary is not configured.
    // -----------------------------------------------------

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          error:
            "Image upload is not configured. Please set the Cloudinary environment variables.",
        },
        { status: 500 }
      );
    }

    // -----------------------------------------------------
    // PARSE MULTIPART BODY
    // -----------------------------------------------------

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No image file provided.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------------
    // VALIDATE FILE TYPE & SIZE
    // -----------------------------------------------------

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Use JPG, PNG, or WebP.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        {
          error:
            "Image is too large. Maximum size is 5 MB.",
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          error: "The selected file is empty.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------------
    // UPLOAD TO CLOUDINARY
    // -----------------------------------------------------

    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    const field = String(
      formData.get("field") || "image"
    ).replace(/[^a-z0-9_-]/gi, "");

    const result = await new Promise<
      cloudinary.UploadApiResponse
    >((resolve, reject) => {
      const stream =
        cloudinary.v2.uploader.upload_stream(
          {
            folder: `stores/${session.businessId}`,
            public_id: `${field}-${Date.now()}`,
            overwrite: true,
            resource_type: "image",
            transformation: [
              {
                width: 1200,
                crop: "limit",
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          },
          (error, result) => {
            if (error || !result) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

      stream.end(buffer);
    });

    // -----------------------------------------------------
    // RETURN PUBLIC URL
    // -----------------------------------------------------

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload image.",
      },
      { status: 500 }
    );
  }
}
