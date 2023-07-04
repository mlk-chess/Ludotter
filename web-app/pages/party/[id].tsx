import Head from 'next/head'
import React, { useCallback, useEffect, useState } from "react";
import HomeLayout from "@/components/layouts/Home";
import { useRouter } from "next/router";
import { Button, Modal } from "flowbite-react";
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
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [idParty, setIdParty] = useState<string>('');
    const [error, setError] = useState("");
    const [users, setUsers] = useState<Profiles[]>([]);
    const [success, setSuccess] = useState("");
    const [info, setInfo] = useState("");
    const router = useRouter();
    const supabase = useSupabaseClient();


    const user = useUser();

    useEffect(() => {
        document.body.classList.add("bg-custom-light-orange");
    });

    useEffect(() => {

        const getParty = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!router.isReady) return;

            const { id } = router.query;
            if (typeof id === 'string') {
                setIdParty(id);

                fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + session?.access_token
                    },
                })
                    .then(response => response.json())
                    .then((data) => {
                        setParty(data.party)
                    }).catch((error) => {
                        setError(error);
                    });
            }
        }
        getParty();
    }, [router.isReady]);

    // Get all users
    useEffect(() => {
        const getAllUsers = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/user/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.access_token
                },
            })
                .then(response => response.json())
                .then((data) => {
                    setUsers(data.Users)
                }).catch((error) => {
                    console.log(error);
                });
        }
        getAllUsers();
    }, []);


    const deleteParty = useCallback(async (e: any) => {
        e.preventDefault();

        const { data: { session } } = await supabase.auth.getSession();

        setIsDelete(true);

        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            },
            body: JSON.stringify({
                id: idParty,
            })
        })
            .then(response => response.json())
            .then(() => {
                router.push('/Party');
            }).catch((error) => {
                setError(error);
            });
    }, [idParty]);

    // Reload if Participant is updated
    useEffect(() => {
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
                    setParticipants(data.profiles);
                    setPartyProfiles(data.partyProfiles);
                }).catch((error) => {
                    setError(error);
                });
        }
        fetchParticipants();
    }, [idParty, participants, partyProfile]);


    const joinParty = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            },
            body: JSON.stringify({
                partyId: idParty,
                profileId: user?.id,
            })
        })
            .then(response => response.json())
            .then((data) => {
                if (data.status === 400) {
                    setError(data.response.message);
                } else {
                    setSuccess(" Fête rejointe avec succès, l'organisateur doit vous confirmer.");
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                    setInfo("");
                    setError("");

                    setTimeout(() => {
                        setSuccess("");
                    }, 5000);
                }
            }).catch((error) => {
                setError(error);
            });
    }, [idParty, router, user?.id]);

    const leaveParty = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/leave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            },
            body: JSON.stringify({
                partyId: idParty,
                profileId: user?.id,
            })
        })
            .then(response => response.json())
            .then((data) => {
                if (data.status === 400) {
                    setError(data.response.message);
                } else {
                    setInfo(" Vous avez quitté la fête.");
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                    setSuccess("");
                    setError("");

                    setTimeout(() => {
                        setInfo("");
                    }, 5000);
                }
            }).catch((error) => {
                setError(error);
            });
    }, [idParty, router, user?.id]);

    return (
        <>
            <Head>
                <title>Ludotter - Party</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {participants === undefined ?
                <div className="flex justify-center items-center h-screen">
                    <svg className="animate-spin -ml-1 mr-3 h-20 w-20 text-gray-800" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                            strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                </div>
                :


                <HomeLayout>
                    <section>
                        <div className="container mx-auto pt-10 h-screen">
                            {error &&

                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Erreur !</strong>
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            }

                            {success &&
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Succès !</strong>
                                    <span className="block sm:inline">{success}</span>
                                </div>
                            }

                            {info &&
                                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Info !</strong>
                                    <span className="block sm:inline">{info}</span>
                                </div>
                            }

                            {Party.length > 0 &&
                                <div className="">
                                    <div className="md:col-span-7 md:col-start-7 my-10 relative">
                                        <h2 className="mb-2 font-semibold leading-none text-gray-900 text-5xl">{Party[0].name}</h2>
                                        <div className="flex items-center mb-5 justify-between mt-20">
                                            <dl>
                                                <dt className="mb-2 font-semibold leading-none text-gray-900 text-2xl">Description</dt>
                                                <dd className="text-xl text-gray-800 mb-5">{Party[0].description}</dd>
                                            </dl>
                                            <dl className="">
                                                <dt className="mb-2 font-semibold leading-none text-gray-900 text-2xl">Date</dt>
                                                <dd className="text-xl text-gray-800 mb-5">{Party[0].dateParty}</dd>
                                            </dl>
                                            <dl className="">
                                                <dt className="mb-2 font-semibold leading-none text-gray-900 text-2xl">Lieu</dt>
                                                <dd className="text-xl text-gray-800 mb-5">{Party[0].location} {Party[0].zipcode}</dd>
                                            </dl>
                                            {/* Browsers users to find the name of the owner */}
                                            {users && users.map((item, index) => {
                                                if (item.id === Party[0].owner) {
                                                    return (
                                                        <dl className="">
                                                            <dt className="mb-2 font-semibold leading-none text-gray-900 text-2xl">Organisateur</dt>
                                                            <dd className="text-xl text-gray-800 mb-5">{item.firstname} {item.name}</dd>
                                                        </dl>
                                                    )
                                                }
                                            })}
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="flex flex-col">
                                                <p className="font-semibold">Personnes inscrites</p>
                                                {participants && participants.length === 0 && 
                                                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                                                        <span className="block sm:inline">Aucun participant pour le moment.</span>
                                                    </div>
                                                }
                                                {participants && participants.length > 0 && participants.map((item, index) => {
                                                    return (
                                                        <>
                                                            <ul role="list" className="max-w-sm divide-y divide-gray-200 dark:divide-gray-700">
                                                                <li className="py-3 sm:py-4">
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="flex-1 min-w-0">
                                                                            <p key={index} className="text-sm font-semibold text-gray-900 dark:text-white">
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
                                                                                <button
                                                                                    key={index}
                                                                                    type="button"
                                                                                    className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                                                                                                if (data.status === 400) {
                                                                                                    setError(data.response.message);
                                                                                                }
                                                                                            }).catch((error) => {
                                                                                                setError(error);
                                                                                            });
                                                                                    }}
                                                                                >
                                                                                    Confirmer
                                                                                </button>
                                                                            </div>
                                                                        )}

                                                                        {user?.id === Party[0].owner && (
                                                                            <div className="flex-shrink-0">
                                                                                <button
                                                                                    key={index}
                                                                                    type="button"
                                                                                    className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
                                                                                                if (data.status === 400) {
                                                                                                    setError(data.response.message);
                                                                                                }
                                                                                            }).catch((error) => {
                                                                                                setError(error);
                                                                                            });
                                                                                    }}
                                                                                >
                                                                                    Refuser
                                                                                </button>
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

                                        <div className="flex justify-start mt-10">
                                            {participants && !participants.some(profile => profile.id === user?.id) ?
                                                <Button color="success" onClick={joinParty}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                        strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                                    </svg>
                                                    Rejoindre la fête
                                                </Button> :

                                                <Button color="failure" onClick={leaveParty}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                        strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                    Se désinscrire
                                                </Button>
                                            }

                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </section>
                </HomeLayout >
            }
        </>
    )
}