import Head from 'next/head'
import React, { useEffect, useState } from "react";
import HomeLayout from "@/components/layouts/Home";
import Link from "next/link";
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface Party {
    name: string;
    description: string;
    id: string;
    status: number;
    zipcode: string;
    location: string;
    dateParty: string;
    owner: string;
    players: number;
    time: string;
}

export default function myParties() {
    const [parties, setParties] = useState<Party[]>([]);
    const [error, setError] = useState<any>([]);
    const [isLoad, setIsLoad] = useState<boolean>(true);
    const supabase = useSupabaseClient()


    useEffect(() => {
        document.body.classList.add("bg-custom-light-orange");
    });

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.access_token
                }
            })
                .then(response => response.json())
                .then((data) => {
                    setParties(data.parties);
                    setIsLoad(false);
                }).catch((error) => {
                    setError("Une erreur est survenue, veuillez réessayer plus tard");
                });
        }
        fetchData();

    }, []);

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
                    <div className="container my-12 mx-auto px-4 md:px-12">

                        {isLoad ? (
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                            </div>
                        )

                            :

                            parties.length === 0 ? (
                                <div className="flex justify-center items-center ">
                                    <h1 className="text-2xl font-bold text-gray-900">Vous n'avez pas encore de fête</h1>
                                    <img className='w-1/3' src="/lost.svg" alt="lost" />                                    
                                </div>) :

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-10">
                                    {parties && parties.length > 0 && parties.map((item, index) => (
                                        <Link href={`/me/party/${item.id}`} key={index}>
                                            <div className="w-80 bg-white border border-gray-200 rounded-lg shadow mx-auto hover:-translate-y-3 hover:cursor-pointer hover:scale-105 duration-300">
                                                <div className="flex items-center justify-end px-2 py-2">

                                                    {item?.status === -2 &&
                                                        <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300">
                                                            Annulée par un administateur
                                                        </span>
                                                    }

                                                    {item?.status === -1 &&
                                                        <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                                            Annulée
                                                        </span>
                                                    }
                                                    {item?.status === 0 &&
                                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                                            En attente
                                                        </span>
                                                    }
                                                    {item?.status === 1 &&
                                                        (
                                                            new Date(item?.dateParty) < new Date() ?
                                                                <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-900 dark:text-gray-300">
                                                                    Fête terminée
                                                                </span> :
                                                                <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                                                    Ouvert
                                                                </span>
                                                        )
                                                    }

                                                </div>

                                                <div className="p-5">
                                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{item?.name}</h5>
                                                    <p className="mb-3 font-normal text-gray-700 overflow-hidden overflow-ellipsis whitespace-nowrap">{item?.description}</p>
                                                </div>
                                                <div className="flex items-center justify-between px-5 py-3 bg-gray-100 border-t border-gray-200 rounded-b-lg">
                                                    <div className="flex items-center">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-900">{item?.players}</span>
                                                            <span className="text-xs font-normal text-gray-500">Joueurs</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-900">{item?.dateParty}</span>
                                                            <span className="text-xs font-normal text-gray-500">Date</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-900">{item?.time}</span>
                                                            <span className="text-xs font-normal text-gray-500">Heure</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                        }
                    </div>
                </section>
            </HomeLayout>
        </>
    )
}