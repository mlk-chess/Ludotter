import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

interface ErrorsSave {
    name: string;
    description: string;
    location: string;
    players: number;
    time: string;
    dateparty: string;
    zipcode: number;
}

export default function FormCreate() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [players, setPlayers] = useState(0);
    const [time, setTime] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isSave, setIsSave] = useState<boolean>(false);
    const [errorsSave, setErrorsSave] = useState<ErrorsSave>({} as ErrorsSave);
    const [zipcode, setZipcode] = useState(0);
    const [dateParty, setDateParty] = useState("");

    const router = useRouter();
    const user = useUser();

    // const handlePlayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = parseInt(e.target.value, 10);
    //     if (!isNaN(value) && value >= 1 && value <= 20) {
    //         setPlayers(value);
    //     } else {
    //         setPlayers(2);
    //     }
    // };

    const save = useCallback(async (e: any) => {
        e.preventDefault();

        setIsSave(true);

        let error = false;

        if (!error) {
            await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    description: description,
                    players: players,
                    time: time,
                    location: location,
                    zipcode: zipcode,
                    dateParty: dateParty,
                    owner: user?.id
                })
            })
                .then(response => response.json())
                .then((data) => {
                    router.push('/party');
                    if (data.statusCode === 201) {
                        setSuccess("Created.");
                        setError("");
                    } else {
                        setError(data.response.message)
                        console.error(data);
                        setSuccess("")
                    }

                }).catch((error) => {
                    console.log(error);
                });
        } else {
            setIsSave(false);
        }
    }, [name, location, dateParty, description, players, time, zipcode, user?.id]);

    return (
        <div className="py-8 px-10 mx-auto my-24 max-w-4xl rounded-lg lg:py-16 bg-white">
            <h2 className="mb-8 text-xl font-bold text-gray-900">Ajouter un évènement</h2>
            <form onSubmit={save}>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="w-full">
                        <label htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900">Nom</label>
                        <input onChange={(e) => setName(e.target.value)} type="text" name="name" id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                            placeholder="Le nom de votre évènement" required />
                        <p className="text-red-600">{errorsSave.name}</p>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="location"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Localisation</label>
                        <input onChange={(e) => setLocation(e.target.value)} type="text" name="location" id="city"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                            placeholder="La localisation de votre évènement" required />
                        <p className="text-red-600">{errorsSave.location}</p>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="description"
                            className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                        <textarea onChange={(e) => setDescription(e.target.value)} id="description" rows={6}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white"
                            placeholder="Description de l'évènement" required></textarea>
                        <p className="text-red-600">{errorsSave.description}</p>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="players"
                            className="block mb-2 text-sm font-medium text-gray-900">Nombre de joueurs</label>
                        <input
                            onChange={(e) => setPlayers(parseInt(e.target.value, 10))}
                            type="number"
                            // min={1}
                            // max={20}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                            placeholder="Nombre de joueurs requis pour l'évènement"
                            required
                        />
                        <p className="text-red-600">{errorsSave.players}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="time"
                            className="block mb-2 text-sm font-medium text-gray-900">Date de l'évènement</label>
                        <input
                            onChange={(e) => setTime(e.target.value)}
                            type="time"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                            placeholder="Entrez une date"
                            required
                        />
                        <p className="text-red-600">{errorsSave.time}</p>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="zipcode"
                            className="block mb-2 text-sm font-medium text-gray-900">Code postal</label>
                        <input
                            onChange={(e) => setZipcode(parseInt(e.target.value, 10))}
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                            placeholder="Entrez le code postal"
                            required
                        />
                        <p className="text-red-600">{errorsSave.zipcode}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="dateparty"
                            className="block mb-2 text-sm font-medium text-gray-900">Date de l'évènement</label>
                        <input
                            onChange={(e) => setDateParty(e.target.value)}
                            type="date"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                            placeholder="Entrez une date"
                            required
                        />
                        <p className="text-red-600">{errorsSave.dateparty}</p>
                    </div>

                </div>



                {isSave ?
                    <svg aria-hidden="true"
                        className="mt-4 inline w-8 h-8 text-gray-200 animate-spin fill-gray-600"
                        viewBox="0 0 100 101" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor" />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill" />
                    </svg>
                    :
                    <button type="submit"
                        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-custom-orange rounded-lg hover:bg-custom-hover-orange">
                        Créer
                    </button>
                }
            </form>
        </div>
    )
}
