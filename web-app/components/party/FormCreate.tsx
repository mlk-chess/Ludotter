import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";


export default function FormCreate() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [players, setPlayers] = useState(0);
    const [time, setTime] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState<any>([]);
    const [isSave, setIsSave] = useState<boolean>(false);
    const [zipcode, setZipcode] = useState(0);
    const [dateParty, setDateParty] = useState("");
    const supabase = useSupabaseClient();
    const router = useRouter();
    const user = useUser();

    const save = useCallback(async (e: any) => {
        e.preventDefault();

        const { data: { session } } = await supabase.auth.getSession();
        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
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
            .then(response => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
                return response.json()
            })
            .then((data) => {
                if (data.statusCode === 201) {
                    setSuccess("Votre fête a bien été créée ! Un administrateur va la valider dans les plus brefs délais.");
                    setError([]);
                } else if (data.status === 400) {
                    data.response ? setError(data.response.message) : setError(data.message)
                    setSuccess("")
                } else if (data.status === 403) {
                    router.push("/login")
                } else {
                    setError("Une erreur est survenue lors de la création de votre fête. Veuillez contacter un administrateur.");
                }

            }).catch(() => {
                setError("Une erreur est survenue lors de la création de votre fête. Veuillez réessayer plus tard.");
            });

    }, [name, location, dateParty, description, players, time, zipcode, user?.id]);

    return (
        <div className="py-8 px-10 mx-auto my-24 max-w-4xl rounded-lg lg:py-16 bg-white">

            {success &&
                <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                    <span className="font-medium">{success}</span>
                </div>
            }

            {error && error.length > 0 &&
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    {error.length > 0 && error.map((err: any, index: number) => (
                        <>
                            <span key={index} className="font-medium">{err}</span>
                            <br></br>
                        </>
                    )
                    )}

                </div>
            }

            <h2 className="mb-8 text-xl font-bold text-gray-900">Ajouter un évènement</h2>
            <form onSubmit={save}>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="w-full">
                        <label htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900">Nom</label>
                        <input onChange={(e) => setName(e.target.value)} type="text" name="name" id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                            placeholder="Le nom de votre évènement" required />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="location"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Localisation</label>
                        <input onChange={(e) => setLocation(e.target.value)} type="text" name="location" id="city"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                            placeholder="La localisation de votre évènement" required />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="description"
                            className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                        <textarea onChange={(e) => setDescription(e.target.value)} id="description" rows={6}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white"
                            placeholder="Description de l'évènement" required></textarea>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="players"
                            className="block mb-2 text-sm font-medium text-gray-900">Nombre de joueurs</label>
                        <input
                            onChange={(e) => setPlayers(parseInt(e.target.value, 10))}
                            type="number"
                            min="1"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                            placeholder="Nombre de joueurs requis pour l'évènement"
                            required
                        />
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
                    </div>
                </div>

                <button type="submit"
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-custom-orange rounded-lg hover:bg-custom-hover-orange">
                    Créer
                </button>
            </form>
        </div>
    )
}
