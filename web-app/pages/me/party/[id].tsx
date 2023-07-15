import Head from 'next/head'
import React, { useCallback, useEffect, useState } from "react";
import HomeLayout from "@/components/layouts/Home";
import { useRouter } from "next/router";
import { Button } from "flowbite-react";
import Modal from '@/components/Modal';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

interface Party {
    name: string;
    description: string;
    id: string;
    status: number;
    zipcode: string;
    location: string;
    dateParty: string;
    owner: string;
    time: string;
    players: number;
}

interface Profiles {
    name: string;
    firstname: string;
    pseudo: string;
    email: string;
    phone: string;
    id: string;
    status: number;
}

interface PartyProfiles {
    partyId: string;
    profileId: string;
    status: number;
}


export default function Party() {
    const [Party, setParty] = useState<Party[]>([]);
    const [participants, setParticipants] = useState<Profiles[]>([]);
    const [partyProfile, setPartyProfiles] = useState<PartyProfiles[]>([]);
    const [idParty, setIdParty] = useState<string>('');
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [updateModal, setUpdateModal] = useState<boolean>(false);
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [description, setDescription] = useState("");
    const [players, setPlayers] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [zipcode, setZipcode] = useState<string>("");
    const [isLoadParty, setIsLoadParty] = useState<boolean>(true);

    const router = useRouter();
    const supabase = useSupabaseClient()
    const user = useUser();

    useEffect(() => {
        document.body.classList.add("bg-custom-light-orange");
    }, []);

    useEffect(() => {
        if (!router.isReady) return;

        const { id } = router.query;
        if (typeof id === 'string') {
            setIdParty(id)
            getParty(id);
        }
    }, [router.isReady]);

    const getParty = useCallback((id: string) => {

        fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/${id}`, {
            method: 'GET',
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setIsLoadParty(false);
                setParty(data.party)
                setName(data.party[0].name)
                setDate(data.party[0].dateParty)
                setTime(data.party[0].time)
                setDescription(data.party[0].description)
                setPlayers(data.party[0].players)
                setLocation(data.party[0].location)
                setZipcode(data.party[0].zipcode)

            }).catch((error) => {
                console.log(error);

            });
    }, [])

    const fetchParticipants = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/participants/${idParty}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            },
        })
            .then(response => response.json())
            .then((data) => {
                setIsLoad(true);
                setParticipants(data.profiles);
                setPartyProfiles(data.partyProfiles);
            }).catch((error) => {
                setError(error);
            });
        setIsLoad(false);
    }

    useEffect(() => {
        fetchParticipants();
    }, [idParty]);

    const update = useCallback(async (e: any) => {
        e.preventDefault();

        const { data: { session } } = await supabase.auth.getSession();
        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/${idParty}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            },
            body: JSON.stringify({
                name: name,
                time: time,
                description: description,
                dateParty: date,
                players: parseInt(players),
                location: location,
                zipcode: zipcode,
                owner: user?.id
            })
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                if (data.statusCode === 200) {
                    getParty(idParty);
                    setUpdateModal(false)
                    setError("")
                    setSuccess("Votre fête a bien été modifiée.")
                } else {
                    setSuccess("")
                    setError(data.response.message)
                }
            }).catch((error) => {
                console.log(error);
            });

    }, [idParty, time, date, players, description, name, location, zipcode, user?.id]);


    const deleteParty = useCallback(async (e: any) => {
        e.preventDefault();

        const { data: { session } } = await supabase.auth.getSession();
        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/${idParty}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            },
        })
            .then(response => response.json())
            .then((data) => {
                router.push('/me/party');
            }).catch((error) => {
                setError("Une erreur est survenue, veuillez réessayer plus tard");
            });
    }, [idParty]);


    return (
        <>
            <Head>
                <title>Ludotter</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <HomeLayout>
                <section>
                    {isLoadParty ?
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                        </div>
                        :
                        <div className="container mx-auto pt-10 h-screen">
                            {
                                success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                                    <span className="block sm:inline"> {success}</span>
                                </div>
                            }

                            {Party.length === 0 ?
                                <div className="flex justify-center items-center h-screen">
                                    <img src="/lost.svg" alt="lost" />
                                </div>

                                :

                                <div className="grid grid-cols-1 md:grid-cols-12 h-4/6">
                                    <div className="md:col-span-5 my-10">

                                        <div className="py-8 px-10 mx-auto  max-w-4xl rounded-lg lg:py-14 bg-white">
                                            <h2 className="mb-3 text-xl font-bold text-gray-900">Les Ludotters</h2>
                                            <hr></hr>
                                            {participants && participants.length === 0 &&
                                                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                                                    <span className="block sm:inline">Aucun participant pour le moment.</span>
                                                </div>
                                            }

                                            {
                                                isLoad ?
                                                    <div className="flex justify-center items-center h-screen">
                                                        <div role="status">
                                                            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                            </svg>
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>

                                                    :
                                                    participants && participants.length > 0 && participants.map((item, index) => {
                                                        return (
                                                            <>
                                                                <ul key={index} role="list" className="w-full mt-5 font-medium rounded px-5 py-2 bg-custom-pastel-blue">
                                                                    <li className="py-3 sm:py-4">
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                                    {item.pseudo}
                                                                                </p>
                                                                            </div>

                                                                            {partyProfile && partyProfile.map((itemPartyProfile, indexPartyProfile) => {
                                                                                if (itemPartyProfile.profileId === item.id) {
                                                                                    if (itemPartyProfile.status === 0) {
                                                                                        return (
                                                                                            <div key={indexPartyProfile} className="flex-shrink-0">
                                                                                                <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                                                                                    <span className="w-2 h-2 mr-1 bg-yellow-500 rounded-full"></span>
                                                                                                    En attente
                                                                                                </span>
                                                                                            </div>
                                                                                        )
                                                                                    } else if (itemPartyProfile.status === 1) {
                                                                                        return (
                                                                                            <div key={indexPartyProfile} className="flex-shrink-0">
                                                                                                <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                                                                                    <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                                                                                                    Confirmé
                                                                                                </span>
                                                                                            </div>

                                                                                        )
                                                                                    } else if (itemPartyProfile.status === -1) {
                                                                                        return (
                                                                                            <div key={indexPartyProfile} className="flex-shrink-0">
                                                                                                <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                                                                                                    <span className="w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
                                                                                                    Refusé
                                                                                                </span>
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                }
                                                                            })}

                                                                            {user?.id === Party[0].owner && (
                                                                                <div className="flex-shrink-0">
                                                                                    <svg
                                                                                        onClick={async () => {
                                                                                            const { data: { session } } = await supabase.auth.getSession();
                                                                                            fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/confirm`, {
                                                                                                method: 'PATCH',
                                                                                                headers: {
                                                                                                    'Content-Type': 'application/json',
                                                                                                    'Authorization': 'Bearer ' + session?.access_token
                                                                                                },
                                                                                                body: JSON.stringify({
                                                                                                    partyId: idParty,
                                                                                                    profileId: item.id,
                                                                                                })
                                                                                            })
                                                                                                .then(response => response.json())
                                                                                                .then((data) => {
                                                                                                    setIsLoad(true);
                                                                                                    if (data.status === 400) {
                                                                                                        setError(data.response.message);
                                                                                                    }
                                                                                                }).catch((error) => {
                                                                                                    setError(error);
                                                                                                });
                                                                                            setIsLoad(false);
                                                                                        }}
                                                                                        className="w-5 h-5 text-gray-800 dark:text-white stroke-green-500 cursor-pointer" stroke="currentColor" stroke-width="1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5" />
                                                                                    </svg>


                                                                                </div>
                                                                            )}

                                                                            {user?.id === Party[0].owner && (
                                                                                <div className="flex-shrink-0">
                                                                                    <svg
                                                                                        onClick={async () => {
                                                                                            const { data: { session } } = await supabase.auth.getSession();

                                                                                            fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/refuse`, {
                                                                                                method: 'PATCH',
                                                                                                headers: {
                                                                                                    'Content-Type': 'application/json',
                                                                                                    'Authorization': 'Bearer ' + session?.access_token
                                                                                                },
                                                                                                body: JSON.stringify({
                                                                                                    partyId: idParty,
                                                                                                    profileId: item.id,
                                                                                                })
                                                                                            })
                                                                                                .then(response => response.json())
                                                                                                .then((data) => {
                                                                                                    setIsLoad(true);
                                                                                                    if (data.status === 400) {
                                                                                                        setError(data.response.message);
                                                                                                    }
                                                                                                }).catch((error) => {
                                                                                                    setError(error);
                                                                                                });
                                                                                            setIsLoad(false);
                                                                                        }}
                                                                                        className="w-4 h-4 text-gray-800 dark:text-white stroke-red-500 cursor-pointer" stroke="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />

                                                                                    </svg>
                                                                                </div>
                                                                            )}

                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </>
                                                        );
                                                    })}
                                        </div>
                                    </div>
                                    <div className="md:col-span-7 md:col-start-7 my-10">
                                        <div className="py-8 px-10 mx-auto  max-w-4xl rounded-lg lg:py-14 bg-white">

                                            <h2 className="mb-10 text-xl font-bold text-gray-900">{Party[0]?.name}</h2>
                                            <div className="flex mb-5 justify-between">
                                                <span className="bg-custom-pastel-purple rounded font-medium px-3 py-1 leading-[100%] inline-block">Où ?</span>
                                                <span className="px-3 py-1 leading-[100%] inline-block">{Party[0]?.location} {Party[0]?.zipcode}</span>
                                            </div>
                                            <div className="flex mb-5 justify-between">
                                                <span className="bg-custom-highlight-orange rounded font-medium px-3 py-1 leading-[100%] inline-block">Quand ?</span>
                                                <span className="px-3 py-1 leading-[100%] inline-block">{Party[0]?.dateParty} {Party[0]?.time}</span>
                                            </div>
                                            <div className="flex mb-5 justify-between ">
                                                <span className="bg-custom-pastel-blue rounded font-medium px-3 py-1 leading-[100%] inline-block">Pour quoi ?</span>
                                                <span className="px-3 py-1 leading-[100%] inline-block">{Party[0]?.description} </span>
                                            </div>

                                            <div className="mt-10 flex">

                                                {Party[0]?.status == -1 || Party[0]?.status == -2 ? (
                                                    "La fête a été annulée."
                                                ) :
                                                    <>
                                                        <button onClick={() => setDeleteModal(true)} className="px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white bg-custom-orange rounded-lg hover:bg-custom-hover-orange">
                                                            Annuler l'évènement
                                                        </button>
                                                        <button onClick={() => setUpdateModal(true)} className="mx-2 px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white bg-custom-orange rounded-lg hover:bg-custom-hover-orange">
                                                            Modifier l'évènement
                                                        </button>
                                                    </>
                                                }


                                            </div>
                                        </div>



                                        {deleteModal ? (
                                            <>
                                                <Modal setShowModal={setDeleteModal} title="">
                                                    <div className="text-center">

                                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                            Voulez-vous vraiment annuler cet évènement ?
                                                        </h3>

                                                        <div className="flex justify-center gap-4">
                                                            <Button color="failure" onClick={deleteParty}>
                                                                Oui, je suis sûr
                                                            </Button>
                                                            <Button
                                                                color="gray"
                                                                onClick={() => setDeleteModal(false)}
                                                            >
                                                                Non, annuler
                                                            </Button>
                                                        </div>
                                                    </div>

                                                </Modal>
                                            </>
                                        ) : null}


                                        {updateModal ? (
                                            <>
                                                <Modal setShowModal={setUpdateModal} title="">
                                                    <form onSubmit={update}>

                                                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                                            <span className="block sm:inline"> {error}</span>
                                                        </div>}

                                                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                                            <div className="w-full">
                                                                <label htmlFor="name"
                                                                    className="block mb-2 text-sm font-medium text-gray-900">Nom</label>
                                                                <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name"
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:bg-white block w-full p-2.5"
                                                                    placeholder="Le nom de votre évènement" required />
                                                            </div>


                                                            <div className="w-full">
                                                                <label htmlFor="players"
                                                                    className="block mb-2 text-sm font-medium text-gray-900">Nombre de joueurs</label>
                                                                <input value={players} onChange={(e) => setPlayers(e.target.value)} type="number" name="players" id="players"
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:bg-white block w-full p-2.5"
                                                                    required />
                                                            </div>


                                                            <div className="w-full">
                                                                <label htmlFor="date"
                                                                    className="block mb-2 text-sm font-medium text-gray-900">Date</label>
                                                                <input value={date} onChange={(e) => setDate(e.target.value)} type="date" name="date" id="date"
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:bg-white block w-full p-2.5"
                                                                    required />
                                                            </div>

                                                            <div className="w-full">
                                                                <label htmlFor="time"
                                                                    className="block mb-2 text-sm font-medium text-gray-900">Heure de début</label>
                                                                <input value={time} onChange={(e) => setTime(e.target.value)} type="time" name="time" id="time"
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:bg-white block w-full p-2.5"
                                                                    required />
                                                            </div>

                                                            <div className="w-full">
                                                                <label htmlFor="location"
                                                                    className="block mb-2 text-sm font-medium text-gray-900">Localisation</label>
                                                                <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" name="location" id="city"
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:bg-white block w-full p-2.5"
                                                                    placeholder="La localisation de votre évènement" required />
                                                            </div>
                                                            <div className="w-full">
                                                                <label htmlFor="zipcode"
                                                                    className="block mb-2 text-sm font-medium text-gray-900">Code postal</label>
                                                                <input value={zipcode} onChange={(e) => setZipcode(e.target.value)} type="text" name="zipcode" id="zipcode"
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:bg-white block w-full p-2.5"
                                                                    placeholder="Le code postal de votre évènement" required />
                                                            </div>


                                                            <div className="sm:col-span-2">
                                                                <label htmlFor="description"
                                                                    className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                                                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} id="description" rows={6}
                                                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:bg-white"
                                                                    placeholder="Description de l'évènement" required></textarea>
                                                            </div>
                                                        </div>

                                                        <button type="submit" className="px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white bg-custom-orange rounded-lg hover:bg-custom-hover-orange">
                                                            Modifier l'évènement
                                                        </button>
                                                    </form>

                                                </Modal>
                                            </>
                                        ) : null}

                                    </div>
                                </div>
                            }

                        </div>
                    }
                </section>
            </HomeLayout>
        </>
    )
}