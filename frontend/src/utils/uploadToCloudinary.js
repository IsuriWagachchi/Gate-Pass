export const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my_unsigned_preset'); // Your upload preset
    formData.append('cloud_name', 'dfu7wn8rq'); // Your cloud name

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dfu7wn8rq/image/upload', // Your cloud name in URL
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url; // Return the secure URL of uploaded image
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null; // Return null if upload fails
  }
};