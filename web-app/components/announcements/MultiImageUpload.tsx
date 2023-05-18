import React, { ChangeEvent } from 'react';

interface ImagePreview {
    id: string;
    file: File;
    previewUrl: string;
}

interface Props {
    selectedImages: ImagePreview[];
    setSelectedImages: React.Dispatch<React.SetStateAction<ImagePreview[]>>;
}

const MultiImageUpload: React.FC<Props> = ({ selectedImages, setSelectedImages }) => {
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const imagePreviews: ImagePreview[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = () => {
                const previewUrl = reader.result as string;
                const imagePreview: ImagePreview = {
                    id: Date.now().toString(),
                    file,
                    previewUrl,
                };
                imagePreviews.push(imagePreview);

                if (imagePreviews.length === files.length) {
                    setSelectedImages((prevImages) => [...prevImages, ...imagePreviews]);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (id: string) => {
        setSelectedImages((prevImages) =>
            prevImages.filter((image) => image.id !== id)
        );
    };

    return (
        <div>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
            />
            <div className="mt-4 grid gap-4 grid-cols-2 md:grid-cols-4">
                {selectedImages.map((image) => (
                    <div key={image.id} className="relative">
                        <img
                            src={image.previewUrl}
                            alt="Preview"
                            className="w-full h-auto"
                        />
                        <button
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded"
                            onClick={() => handleRemoveImage(image.id)}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultiImageUpload;
