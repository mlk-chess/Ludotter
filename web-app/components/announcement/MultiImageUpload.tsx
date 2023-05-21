import React, {ChangeEvent, useEffect} from 'react';

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
    useEffect(() => {
        const fileInput = document.getElementById('multi-image-upload') as HTMLInputElement | null;
        if (fileInput) {
            fileInput.value = '';
        }
    }, [selectedImages]);

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

    const handleButtonClick = () => {
        document.getElementById("multi-image-upload")?.click();
    };

    return (
        <div className="mt-10">
            <p className="text-sm font-medium pb-2 text-gray-900">Ajoute jusqu'à 4 photos</p>
            <div className="border-dashed rounded border-2 border-gray-300 px-3 flex flex-col">
                <div className="my-4 grid gap-4 grid-cols-2 md:grid-cols-4">
                    {selectedImages.map((image) => (
                        <div key={image.id} className="relative">
                            <img
                                src={image.previewUrl}
                                alt="Preview"
                                className="w-full rounded h-32 object-cover"
                            />
                            <button
                                className="absolute top-2 right-2 py-0.5 px-3 bg-white text-black font-semibold rounded hover:bg-gray-200"
                                onClick={() => handleRemoveImage(image.id)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                    {(selectedImages.length > 0 && selectedImages.length < 4) &&
                        <div className="h-full flex items-center ml-10">
                            <button onClick={handleButtonClick} type="button" className="text-custom-dark bg-custom-white border-2 border-custom-highlight-orange hover:bg-custom-light-orange focus:outline-none font-medium rounded-lg text-sm lg:text-base py-2 px-4 md:py-2 text-center mr-0 w-fit h-fit">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                     stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                                </svg>
                            </button>
                        </div>
                    }
                </div>
                {selectedImages.length === 0 &&
                    <button onClick={handleButtonClick} type="button" className="w-fit mx-auto text-custom-dark bg-custom-white border-2 border-custom-highlight-orange hover:bg-custom-light-orange focus:outline-none font-medium rounded-lg text-sm lg:text-base py-2 px-4 mt-10 mb-14 text-center">Ajoute des photos</button>
                }
                {selectedImages.length > 3  &&
                    <div className="w-full flex justify-center mt-10">
                        <p className="full">Vous ne pouvez pas ajouter plus d'images</p>
                    </div>
                }
            </div>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="multi-image-upload"
            />
        </div>
    );
};

export default MultiImageUpload;
