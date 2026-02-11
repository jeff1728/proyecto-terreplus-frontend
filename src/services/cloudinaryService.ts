import { Platform } from 'react-native';

const CLOUD_NAME = "dnhdkn090";
const UPLOAD_PRESET = "my_default";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const cloudinaryService = {
    uploadImage: async (imageUri: string): Promise<string> => {
        const formData = new FormData();

        if (Platform.OS === 'web') {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            formData.append('file', blob);
            formData.append('upload_preset', UPLOAD_PRESET);
        } else {
            const filename = imageUri.split('/').pop() || 'upload.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append('file', {
                uri: imageUri,
                name: filename,
                type: type,
            } as any);
            formData.append('upload_preset', UPLOAD_PRESET);
        }

        try {
            const response = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: formData,
                headers: {

                },
            });

            const data = await response.json();

            if (data.secure_url) {
                return data.secure_url;
            } else {
                throw new Error(data.error?.message || 'Error uploading image');
            }
        } catch (error) {
            console.error('Cloudinary Upload Error:', error);
            throw error;
        }
    }
};
