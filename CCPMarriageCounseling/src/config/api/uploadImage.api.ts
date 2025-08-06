const CLOUDINARY_URL = process.env.EXPO_PUBLIC_API_UPLOAD_IMAGE || "";
const UPLOAD_PRESET = "nguyen";

// Hàm thủ công để lấy MIME type từ phần mở rộng
const getMimeType = (uri: string): string => {
  const extension = uri.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'application/octet-stream'; 
  }
};

export const uploadImageToCloudinary = async (localUri: string): Promise<string | null> => {
  try {
    const fileType = getMimeType(localUri);
    const fileName = localUri.split("/").pop() || `image.${fileType.split("/")[1]}`;

    const formData = new FormData();
    formData.append("file", {
      uri: localUri,
      name: fileName,
      type: fileType,
    } as any);

    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      console.error("Upload failed:", data);
      return null;
    }
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};

const uploadImageApi = {
  uploadImageToCloudinary,
};

export default uploadImageApi;
