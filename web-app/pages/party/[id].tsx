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
    const [users, setUsers] = useState<Profiles[]>([]);
    const [success, setSuccess] = useState("");
    const [info, setInfo] = useState("");
    const [isLoad, setIsLoad] = useState(false);
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
                        setIsLoad(true);
                        setParty(data.party)
                    }).catch((error) => {
                        setError(error);
                    });

            }
            setIsLoad(false);
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
                    setIsLoad(true);
                    setUsers(data.Users)
                }).catch((error) => {
                    console.log(error);
                });
            setIsLoad(false);
        }
        getAllUsers();
    }, []);

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
                    setIsLoad(true);
                    setParticipants(data.profiles);
                    setPartyProfiles(data.partyProfiles);
                }).catch((error) => {
                    setError(error);
                });
            setIsLoad(false);
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
                setIsLoad(true);
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
        setIsLoad(false);
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
                setIsLoad(true);
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
        setIsLoad(false);
    }, [idParty, router, user?.id]);

    return (
        <>
            <Head>
                <title>Ludotter - Party</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {participants === undefined || isLoad ?
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
                            <div className='grid grid-cols-1 md:grid-cols-12 h-4/6 gap-5'>
                                <div className="md:col-span-5 my-10">
                                    <div className="py-8 px-10 mx-auto  max-w-4xl rounded-lg lg:py-14 bg-white">
                                        <h2 className="mb-3 text-xl font-bold text-gray-900">Les Ludotters</h2>
                                        <hr></hr>
                                        {participants && participants.length === 0 &&
                                            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                                                <span className="block sm:inline">Aucun participant pour le moment.</span>
                                            </div>
                                        }
                                        {participants && participants.length > 0 && participants.map((item, index) => {
                                            return (
                                                <>
                                                    <ul key={index} role="list" className="w-full mt-5 font-medium rounded px-5 py-2 bg-custom-highlight-orange">
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
                                <div className="md:col-span-7 my-10">
                                    <div className="py-8 px-10 mx-auto  max-w-4xl rounded-lg lg:py-14 bg-white">

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
                                            <>
                                                <h2 className="mb-10 text-xl font-bold text-gray-900">{Party[0]?.name}</h2>

                                                <div className="flex mb-5 justify-between">
                                                    <span className="bg-custom-pastel-purple rounded font-medium px-3 py-1 leading-[100%] inline-block">Description ?</span>
                                                    <span className="px-3 py-1 leading-[100%] inline-block">{Party[0].description}</span>
                                                </div>
                                                <div className="flex mb-5 justify-between">
                                                    <span className="bg-custom-highlight-orange rounded font-medium px-3 py-1 leading-[100%] inline-block">Quand ?</span>
                                                    <span className="px-3 py-1 leading-[100%] inline-block">
                                                        {Party[0].dateParty}
                                                        {Party[0].time}
                                                    </span>
                                                </div>
                                                <div className="flex mb-5 justify-between">
                                                    <span className="bg-custom-pastel-blue rounded font-medium px-3 py-1 leading-[100%] inline-block">Nombre de joueurs maximum</span>
                                                    <span className="px-3 py-1 leading-[100%] inline-block">{participants.length} / {Party[0].players}</span>
                                                </div>
                                                <div className="flex mb-5 justify-between ">
                                                    <span className="bg-custom-pastel-purple rounded font-medium px-3 py-1 leading-[100%] inline-block">Où ?</span>
                                                    <span className="px-3 py-1 leading-[100%] inline-block">{Party[0].location} {Party[0].zipcode} </span>
                                                </div>
                                                {users && users.map((item, index) => {
                                                    if (item.id === Party[0].owner) {
                                                        return (
                                                            <div key={index} className="flex mb-5 justify-between ">
                                                                <span className="bg-custom-highlight-orange rounded font-medium px-3 py-1 leading-[100%] inline-block">Organisateur</span>
                                                                <span className="px-3 py-1 leading-[100%] inline-block">{item.firstname} {item.name}</span>
                                                            </div>
                                                        )
                                                    }
                                                })}

                                                <div>
                                                    {participants && !participants.some(profile => profile.id === user?.id) ?
                                                        <button
                                                            className='px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white bg-custom-orange rounded-lg hover:bg-custom-hover-orange'
                                                            onClick={joinParty}>
                                                            Rejoindre la fête
                                                        </button> :

                                                        <button
                                                            className='px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white bg-custom-orange rounded-lg hover:bg-custom-hover-orange'
                                                            onClick={leaveParty}>
                                                            Se désinscrire
                                                        </button>
                                                    }

                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>
                </HomeLayout>
            }
        </>
    )
}