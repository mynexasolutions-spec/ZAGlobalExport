const cloudName =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
  import.meta.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  '';

// IMPORTANT: This MUST be an unsigned upload preset created in your
// Cloudinary dashboard → Settings → Upload → Upload Presets → Add unsigned preset
// Name it "za_global_exports_unsigned" (or update VITE_CLOUDINARY_UPLOAD_PRESET in .env)
const uploadPreset =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'za_global_exports';

export const isCloudinaryConfigured = Boolean(cloudName);

/**
 * Upload a single image file to Cloudinary using unsigned upload.
 *
 * SETUP REQUIRED:
 *   1. Go to https://cloudinary.com/console → Settings → Upload → Upload Presets
 *   2. Click "Add upload preset"
 *   3. Set Signing Mode = "Unsigned"
 *   4. Set Folder = "za_global_exports" (optional)
 *   5. Save the preset name and set it in .env as VITE_CLOUDINARY_UPLOAD_PRESET
 *
 * @param {File} file - The file object to upload
 * @param {string} [folder='za_global_exports'] - Cloudinary folder
 * @returns {Promise<{ url: string, publicId: string, format: string, width: number, height: number }>}
 */
export async function uploadImageToCloudinary(file, folder = 'za_global_exports') {
  if (!cloudName) {
    throw new Error(
      'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME in your .env file.'
    );
  }

  if (!uploadPreset) {
    throw new Error(
      'Cloudinary upload preset is not configured. Set VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
    );
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    throw new Error(
      `Invalid image format: "${file.type}". Supported formats: JPG, PNG, WEBP, GIF, SVG.`
    );
  }

  // Validate file size (max 10MB)
  const MAX_SIZE_MB = 10;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is ${MAX_SIZE_MB}MB.`);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const cloudinaryError = data?.error?.message || 'Unknown Cloudinary error';

    // Provide helpful guidance for the most common error
    if (
      cloudinaryError.toLowerCase().includes('upload preset') ||
      cloudinaryError.toLowerCase().includes('not found') ||
      response.status === 400
    ) {
      throw new Error(
        `Cloudinary upload preset "${uploadPreset}" not found or is not set to "Unsigned".\n` +
        `Please go to cloudinary.com/console → Settings → Upload → Upload Presets → ` +
        `create an UNSIGNED preset named "${uploadPreset}", then set VITE_CLOUDINARY_UPLOAD_PRESET=${uploadPreset} in .env`
      );
    }

    throw new Error(`Cloudinary upload failed: ${cloudinaryError}`);
  }

  const secureUrl = data.secure_url || data.url;
  if (!secureUrl) {
    throw new Error('Cloudinary returned an empty URL. Upload may have failed silently.');
  }

  return {
    url: secureUrl,
    publicId: data.public_id,
    format: data.format,
    width: data.width,
    height: data.height,
  };
}

/**
 * Upload multiple files to Cloudinary concurrently.
 * @param {File[]} files - Array of File objects
 * @param {string} [folder]
 * @returns {Promise<Array<{ url: string, publicId: string }>>}
 */
export async function uploadMultipleImagesToCloudinary(files, folder = 'za_global_exports') {
  const uploadPromises = Array.from(files).map((file) =>
    uploadImageToCloudinary(file, folder)
  );
  return Promise.all(uploadPromises);
}
