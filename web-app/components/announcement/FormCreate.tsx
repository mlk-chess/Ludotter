import React, {useCallback, useEffect, useRef, useState} from "react";
import MultiImageUpload from "@/components/announcement/MultiImageUpload";
import {useRouter} from "next/router";

interface ImagePreview {
    id: string;
    file: File;
    previewUrl: string;
}

interface Category {
    id: number;
    name: string;
    createdAt: string;
}

interface Error {
    name: string;
    price: string;
    description: string;
    selectImages: string;
    type: string;
    city: string;
}

export default function FormCreate() {
    const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [selectCategories, setSelectCategories] = useState<string[]>([]);
    const [type, setType] = useState("location");
    const [price, setPrice] = useState("");
    const [city, setCity] = useState("");
    const [description, setDescription] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isSave, setIsSave] = useState<boolean>(false);
    const [errorsSave, setErrorsSave] = useState<Error>({} as Error);
    const [showListCategories, setShowListCategories] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const convertImageToBase64 = ({file}: { file: any }) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value, checked} = event.target;
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

        setIsSave(true);
        let error = false

        if (selectedImages.length === 0) {
            setErrorsSave((prevState) => ({
                ...prevState,
                selectImages: "Veuillez sélectionner au moins une image."
            }));
            error = true
        }

        if (selectedImages.length > 4) {
            setErrorsSave((prevState) => ({
                ...prevState,
                selectImages: "Veuillez sélectionner au maximum 4 images."
            }));
            error = true
        }

        if (name === "") {
            setErrorsSave((prevState) => ({
                ...prevState,
                name: "Veuillez saisir un nom."
            }));
            error = true
        }

        if (price === "") {
            setErrorsSave((prevState) => ({
                ...prevState,
                price: "Veuillez saisir un prix."
            }));
            error = true
        }

        if (description === "") {
            setErrorsSave((prevState) => ({
                ...prevState,
                description: "Veuillez saisir une description."
            }));
            error = true
        }

        if (type === "") {
            setErrorsSave((prevState) => ({
                ...prevState,
                type: "Veuillez saisir un type."
            }));
            error = true
        }

        if (city === "") {
            setErrorsSave((prevState) => ({
                ...prevState,
                city: "Veuillez saisir une ville."
            }));
            error = true
        }

        if (!error) {
            const selectedImagesBase64 = await Promise.all(
                selectedImages.map(async (image) => ({
                    name: image.file.name,
                    base64: await convertImageToBase64({file: image.file}),
                }))
            );

            await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/announcement/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                    router.push('/announcement');
                    if (data.statusCode === 201) {
                        setSuccess("Created.");
                        setError("");
                    } else {
                        setError(data.response.message)
                        setSuccess("")
                    }

                }).catch((error) => {
                    console.log(error);

                });
        } else {
            setIsSave(false);
        }
    }, [name, price, description, selectedImages, type, city, selectCategories, errorsSave]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowListCategories(false);
        }
    };

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
                        <p className="text-red-600">{errorsSave.name}</p>
                    </div>
                    <div className="w-full relative">
                        <label htmlFor="categories"
                               className="block mb-2 text-sm font-medium text-gray-900">Catégories</label>

                        <div ref={dropdownRef}>
                            <button id="categories" onClick={() => setShowListCategories(!showListCategories)}
                                    className="w-full relative bg-gray-50 border border-gray-300 text-gray-900 focus:ring-1 focus:outline-none focus:ring-custom-pastel-purple rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
                                    type="button">Sélectionner une ou plusieurs catégories <svg
                                className="absolute right-5 w-4 h-4"
                                stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M19 9l-7 7-7-7"></path>
                            </svg></button>
                            <div id="dropdownCategories"
                                 className={"z-10 bg-white rounded-lg shadow w-full p-2.5 overflow-y-auto max-h-72" + (showListCategories ? " absolute" : " hidden")}>
                                {categories.map((item, index) => (
                                    <div className="flex items-ce nter mb-4" key={index}>
                                        <input onChange={handleCheckboxChange} id={`${item.name}-checkbox`}
                                               type="checkbox"
                                               value={item.id}
                                               className="w-4 h-4 text-custom-pastel-purple bg-gray-100 border-gray-300 rounded focus:ring-custom-pastel-purple"/>
                                        <label htmlFor={`${item.name}-checkbox`}
                                               className="ml-2 text-sm font-medium text-gray-900">{item.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            {selectCategories.map((id, index) => {
                                const category = categories.find(item => item.id === parseInt(id));
                                const name = category ? category.name : "";

                                return (
                                    <span key={index}
                                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-400 text-white mr-2">
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
                                <input defaultChecked onChange={(e) => setType(e.target.value)} id="location"
                                       type="radio"
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
                        <p className="text-red-600">{errorsSave.type}</p>
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
                        <p className="text-red-600">{errorsSave.price}</p>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="city"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ville</label>
                        <input onChange={(e) => setCity(e.target.value)} type="text" name="city" id="city"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                               placeholder="La ville de votre annonce" required/>
                        <p className="text-red-600">{errorsSave.city}</p>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="description"
                               className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                        <textarea onChange={(e) => setDescription(e.target.value)} id="description" rows={6}
                                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white"
                                  placeholder="Description de l'annonce" required></textarea>
                        <p className="text-red-600">{errorsSave.description}</p>
                    </div>
                </div>
                <MultiImageUpload selectedImages={selectedImages} setSelectedImages={setSelectedImages}/>
                <p className="text-red-600">{errorsSave.selectImages}</p>

                {isSave ?
                    <svg aria-hidden="true"
                         className="mt-4 inline w-8 h-8 text-gray-200 animate-spin fill-gray-600"
                         viewBox="0 0 100 101" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                    :
                    <button type="submit"
                            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-custom-orange rounded-lg hover:bg-custom-hover-orange">
                        Poster
                    </button>
                }
            </form>
        </div>
    )
}
