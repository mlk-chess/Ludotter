import Head from 'next/head'
import React, { useCallback, useEffect, useState } from "react";
import HomeLayout from "@/components/layouts/Home";
import { useRouter } from "next/router";
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
                console.log(participants);
            }).catch((error) => {
                setError(error);
            });
    }

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
                    if (data.statusCode === 403) {
                        router.push('/login');
                    }
                    setIsLoad(true);
                    setUsers(data.Users)
                }).catch((error) => {
                    setError("Une erreur est survenue, veuillez réessayer plus tard");
                });
            setIsLoad(false);
        }
        getAllUsers();
    }, []);

    useEffect(() => {
        fetchParticipants();
    }, [idParty, isLoad]);


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
                } else if (data.statusCode === 201) {
                    setSuccess(" Fête rejointe avec succès, l'organisateur doit vous confirmer.");
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                    setInfo("");
                    setError("");
                } else {
                    setError("Une erreur est survenue, veuillez réessayer plus tard");
                }
            }).catch((error) => {
                setError(error);
            });
        setIsLoad(false);
        fetchParticipants();
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
        fetchParticipants();
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
                        {
                            Party[0]?.status == -1 || Party[0]?.status == -2 ?
                                <div className="pt-10 flex flex-col justify-center items-center">
                                    <h1 className="text-3xl font-bold text-gray-900">La fête a été annulée.</h1>
                                    <img className="w-1/3" src="/lost.svg" alt="lost" />
                                </div>
                                :
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
                                                                                                <div className="flex-shrink-0">
                                                                                                    <span key={indexPartyProfile} className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                                                                                        <span className="w-2 h-2 mr-1 bg-yellow-500 rounded-full"></span>
                                                                                                        En attente
                                                                                                    </span>
                                                                                                </div>
                                                                                            )
                                                                                        } else if (itemPartyProfile.status === 1) {
                                                                                            return (
                                                                                                <div className="flex-shrink-0">
                                                                                                    <span key={indexPartyProfile} className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                                                                                        <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                                                                                                        Confirmé
                                                                                                    </span>
                                                                                                </div>

                                                                                            )
                                                                                        } else if (itemPartyProfile.status === -1) {
                                                                                            return (
                                                                                                <div key={indexPartyProfile} className="flex-shrink-0">
                                                                                                    <span key={indexPartyProfile} className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
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
                                                                                                setIsLoad(true);
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
                                                                                                        setIsLoad(false);
                                                                                                    }).catch((error) => {
                                                                                                        setError(error);
                                                                                                    });
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
                                                                                                setIsLoad(true);
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
                                                                                                        setIsLoad(false);
                                                                                                    }).catch((error) => {
                                                                                                        setError(error);
                                                                                                    });
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

                                                            {

                                                                Party[0]?.status == -1 || Party[0]?.status == -2 ? (
                                                                    "La fête a été annulé."
                                                                ) :
                                                                    participants && !participants.some(profile => profile.id === user?.id) ?
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
                        }
                    </section>
                </HomeLayout>


            }
        </>
    )

}