import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

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
    const [error, setError] = useState<any>([]);
    const [zipcode, setZipcode] = useState(0);
    const [dateParty, setDateParty] = useState("");
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState("0");
    const [owner, setOwner] = useState("");
    const [isLoader, setIsLoader] = useState<boolean>(true);
    const supabase = useSupabaseClient();

    const router = useRouter();
    const user = useUser();

    // Get all users
    useEffect(() => {

        const fetchuser = async () => {
            document.body.classList.add("bg-custom-light-blue");
            const { data: { session } } = await supabase.auth.getSession();
            fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/user/all`,
                {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + session?.access_token
                    },
                }
            )
                .then(response => {
                    return response.json()
                })
                .then((data) => {
                    setUsers(data.Users);
                    setOwner(data.Users[0].id);
                    setIsLoader(false);
                }).catch((error) => {
                    setError("Une erreur est survenue. Contactez un administrateur.");
                });
        }
        fetchuser();
    }, [isLoader]);

    const save = useCallback(async (e: any) => {
        e.preventDefault();
        const { data: { session } } = await supabase.auth.getSession();

        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/admin/save`, {
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
                owner: owner,
                status: parseInt(status, 10)
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
                // console.log(data);
                if (data.statusCode === 201) {
                    setSuccess("Fête créée avec succès ! Vous allez être redirigé vers la liste des fêtes.");
                    setError([]);

                    setTimeout(() => {
                        router.push("/admin/party");
                    }, 5000);
                } else {
                    setError(data.response.message)
                    setSuccess("")
                }

            }).catch((error) => {
                setError("Une erreur est survenue. Contactez un administrateur.");
            });

    }, [name, location, dateParty, owner, description, players, time, zipcode, user?.id, status]);

    return (
        <>
            {
                isLoader ?
                    <div role="status" className="py-8 px-10 mx-auto my-24 max-w-4xl rounded-lg lg:py-16 bg-white flex items-center justify-center">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>

                    :
                    <div className="py-8 px-10 mx-auto my-24 max-w-4xl rounded-lg lg:py-16 bg-white">
                        {success &&
                            <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                                <span className="font-medium">{success}</span>
                            </div>
                        }

                        {error && error.length > 0 &&
                            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                {error && error.map((err: any, index: number) => (
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
                                        min={1}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                                        placeholder="Nombre de joueurs requis pour l'évènement"
                                        required
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="time"
                                        className="block mb-2 text-sm font-medium text-gray-900">Heure de la fête</label>
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

                            <div className="sm:col-span-2">
                                <label htmlFor="owner"
                                    className="block mb-2 text-sm font-medium text-gray-900">Organisateur de l'évènement</label>
                                <select
                                    onChange={(event) => {
                                        const selectedValue = event.target.value;
                                        setOwner(selectedValue)
                                    }
                                    }
                                    value={owner}
                                    id="owner"
                                    name="owner"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                                    required
                                >
                                    <option value="">Choisissez un utilisateur</option>
                                    {users && users.map((user: any) => (
                                        <option key={user.id} value={user.id}>{user.firstname} {user.lastname}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" onChange={(e) => {
                                        setStatus(e.target.checked ? "1" : "0")
                                    }} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Publier</span>
                                </label>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <button type="submit"
                                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm">
                                    Créer
                                </button>
                                <button type="button"
                                    onClick={() => router.back()}
                                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-custom-pastel-purple rounded-lg hover:bg-custom-hover-pastel-purple">
                                    Retour
                                </button>
                            </div>
                        </form>
                    </div>
            }
        </>
    )
}
