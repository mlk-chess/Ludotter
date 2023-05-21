import React, {useCallback, useEffect, useState} from "react";
import MultiImageUpload from "@/components/announcement/MultiImageUpload";

interface ImagePreview {
    id: string;
    file: File;
    previewUrl: string;
}

export default function FormCreate() {
    const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [selectCategories, setSelectCategories] = useState([]);
    const [type, setType] = useState("location");
    const [price, setPrice] = useState("");
    const [city, setCity] = useState("");
    const [description, setDescription] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectCategories((prevCheckedBoxes) => [...prevCheckedBoxes, value]);
        } else {
            setSelectCategories((prevCheckedBoxes) =>
                prevCheckedBoxes.filter((item) => item !== value)
            );
        }
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        value = value.replace(/[^0-9.,]/g, '');
        value = value.replace(/,/g, '.');
        value = value.replace(/\.(?=.*\.)/g, '');
        const parts = value.split('.');
        if (parts.length === 2) {
            parts[1] = parts[1].slice(0, 2);
            value = parts.join('.');
        }
        setPrice(value);
    };

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/category`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then((data) => {
                setCategories(data)
            }).catch((error) => {
            console.log(error);
        });
    }, []);

    const save = useCallback(async (e: any) => {
        e.preventDefault();

        const selectedImagesBase64 = await Promise.all(
            selectedImages.map(async (image) => ({
                name: image.file.name,
                base64: await convertImageToBase64(image.file),
            }))
        );

        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/announcement/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: formData
            body: JSON.stringify({
                name: name,
                price: price,
                description: description,
                selectImages: selectedImagesBase64,
                type: type,
                city: city,
                selectCategories: selectCategories
            })
        })
            .then(response => response.json())
            .then((data) => {

                if (data.statusCode === 201) {
                    setSuccess("Created.")
                    setError("")
                } else {
                    setError(data.response.message)
                    setSuccess("")
                }

            }).catch((error) => {
                console.log(error);

            });


    }, [name, price, description, selectedImages, type, city, selectCategories]);

    return (
        <div className="py-8 px-10 mx-auto my-24 max-w-4xl rounded-lg lg:py-16 bg-white">
            <h2 className="mb-8 text-xl font-bold text-gray-900">Ajouter une annonce</h2>
            <form onSubmit={save}>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="w-full">
                        <label htmlFor="name"
                               className="block mb-2 text-sm font-medium text-gray-900">Nom</label>
                        <input onChange={(e) => setName(e.target.value)} type="text" name="name" id="name"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                               placeholder="Le nom de votre annonce" required/>
                    </div>
                    <div className="w-full relative">
                        <label htmlFor="categories"
                               className="block mb-2 text-sm font-medium text-gray-900">Catégories</label>

                        <button id="categories" data-dropdown-toggle="dropdownCategories"
                                className="w-full relative bg-gray-50 border border-gray-300 text-gray-900 focus:ring-1 focus:outline-none focus:ring-custom-pastel-purple rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
                                type="button">Sélectionner une ou plusieurs catégories <svg
                            className="absolute right-5 w-4 h-4"
                            aria-hidden="true" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M19 9l-7 7-7-7"></path>
                        </svg></button>
                        <div id="dropdownCategories"
                             className="z-10 hidden bg-white rounded-lg shadow w-full p-2.5 overflow-y-auto max-h-72">
                            {categories.map((item, index) => (
                                <div className="flex items-ce nter mb-4" key={index}>
                                    <input onChange={handleCheckboxChange} id={`${item.name}-checkbox`} type="checkbox" value={item.id}
                                           className="w-4 h-4 text-custom-pastel-purple bg-gray-100 border-gray-300 rounded focus:ring-custom-pastel-purple"/>
                                    <label htmlFor={`${item.name}-checkbox`}
                                           className="ml-2 text-sm font-medium text-gray-900">{item.name}</label>
                                </div>
                            ))}
                        </div>
                        <div>
                            {selectCategories.map((id, index) => {
                                const category = categories.find(item => item.id == id);
                                const name = category ? category.name : "";

                                return (
                                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-400 text-white mr-2">
                                        {name}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-full">
                        <label htmlFor="brand"
                               className="block mb-2 text-sm font-medium text-gray-900">Type de l'annonce</label>

                        <div className="flex pt-3">
                            <div className="flex items-between mr-4">
                                <input defaultChecked onChange={(e) => setType(e.target.value)} id="location" type="radio"
                                       value="location" name="inline-radio-group-type" required
                                       className="w-4 h-4 text-custom-pastel-purple bg-gray-100 border-gray-300 focus:ring-custom-pastel-purple focus:ring-2"/>
                                <label htmlFor="location"
                                       className="ml-2 text-sm font-medium text-gray-900">Location</label>
                            </div>
                            <div className="flex items-center mr-4">
                                <input onChange={(e) => setType(e.target.value)} id="sale" type="radio" value="sale"
                                       name="inline-radio-group-type" required
                                       className="w-4 h-4 text-custom-pastel-purple bg-gray-100 border-gray-300 focus:ring-custom-pastel-purple focus:ring-2"/>
                                <label htmlFor="sale"
                                       className="ml-2 text-sm font-medium text-gray-900">Vente</label>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <label htmlFor="price"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prix</label>
                        <div className="flex">
                            <input onChange={handlePriceChange} type="text" name="price" id="price"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-none rounded-l-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                                   placeholder="Votre prix" required value={price}/>
                            <span
                                className="whitespace-nowrap inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md">
                                {type === "location" ? "€ / jour" : "€"}
                            </span>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="city"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ville</label>
                        <input onChange={(e) => setCity(e.target.value)} type="text" name="city" id="city"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                               placeholder="La ville de votre annonce" required/>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="description"
                               className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                        <textarea onChange={(e) => setDescription(e.target.value)} id="description" rows={6}
                                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white"
                                  placeholder="Description de l'annonce" required></textarea>
                    </div>
                </div>
                <MultiImageUpload selectedImages={selectedImages} setSelectedImages={setSelectedImages}/>
                <button type="submit"
                        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-custom-orange rounded-lg hover:bg-custom-hover-orange">
                    Poster
                </button>
            </form>
        </div>
    )
}
