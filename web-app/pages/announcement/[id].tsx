import Head from 'next/head'
import React, {useCallback, useEffect, useState} from "react";
import HomeLayout from "@/components/layouts/Home";
import {useRouter} from "next/router";
import DisplayImages from "@/components/announcement/DisplayImages";
import Loader from "@/components/utils/Loader";
import Checkout from "@/components/announcement/Checkout";
import CheckoutLocation from "@/components/announcement/CheckoutLocation";
import Modal from '@/components/Modal';
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import Link from "next/link";


interface Profile {
    pseudo: string;
}

interface Announcement {
    id: string;
    name: string;
    description: string;
    firstImage: string;
    base64Images: string[];
    type: string;
    price: number;
    announcementCategories: AnnouncementCategory[];
    status: number;
    profileId: Profile;
}

interface AnnouncementCategory {
    category: Category;
}

interface Category {
    name: string;
}


export default function Announcement() {
    const [announcement, setAnnouncement] = useState<Announcement[]>([]);
    const [idAnnouncement, setIdAnnouncement] = useState<string>('');
    const [checkout, setCheckout] = useState<boolean>(false);
    const router = useRouter();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    const supabase = useSupabaseClient();


    useEffect(() => {
        document.body.classList.add("bg-custom-light-orange");

        const fetchSession = async () => {
            const {data: {session}} = await supabase.auth.getSession();
            // @ts-ignore
            setUser(session);
        }
        fetchSession();
    }, []);

    useEffect(() => {
        if (!router.isReady) return;

        const {id} = router.query;
        if (typeof id === 'string') {
            setIdAnnouncement(id);

            fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/announcement/${id}`, {
                method: 'GET',
            })
                .then(response => {
                    const statusCode = response.status;
                    if (statusCode === 404) {
                        router.push('/announcement');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data[0].status !== 1 && (data[0].type !== 'location' || data[0].status !== 2)) {
                        router.push('/announcement');
                    }
                    setAnnouncement(data)
                }).catch((error) => {
                console.log(error);
            });
        }
    }, [router.isReady]);

    const openModal = useCallback(() => {

        const fetchData = async () => {

            const {data: {session}} = await supabase.auth.getSession();
            fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/message/getConversationAnnouncement/${idAnnouncement}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.access_token
                },
                
            })
                .then(response => {
                    const statusCode = response.status;
                    if (statusCode === 404) {
                        router.push('/announcement');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.length > 0) {
                        router.push(`/message?id=${data[0].id}`);
                    } else {
                        setShowModal(true);
                    }
                }).catch((error) => {
                console.log(error);
            });
        }

        fetchData();
    }, [idAnnouncement])

    const handleSubmit = useCallback(async (e: any) => {

        e.preventDefault();

        const {data: {session}} = await supabase.auth.getSession();

        fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/message/saveNewConversationAnnouncement`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            },
            body: JSON.stringify({
                message: message,
                id: idAnnouncement,
            })
        })
            .then(response => {
                const statusCode = response.status;
                if (statusCode === 404) {
                    router.push('/announcement');
                }
                return response.json();
            })
            .then((data) => {
                setShowModal(false)
            }).catch((error) => {
            console.log(error);
        });
    }, [message, idAnnouncement])

    return (
        <>
            <Head>
                <title>Ludotter</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <HomeLayout>
                <section>
                    {showModal ? (
                        <>
                            <Modal setShowModal={setShowModal} title="Envoyer un message">
                                <div className="">

                                    <form onSubmit={handleSubmit}>
                                        <div>
                                <textarea name="text" id="text"
                                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                          placeholder="Écrivez-nous un message ..." required
                                          onChange={(e) => setMessage(e.target.value)}/>
                                        </div>

                                        <button
                                            type="submit"
                                            className="mt-2 text-white border-2 border-custom-orange bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-xs px-3 py-2 text-center">
                                            Envoyer
                                        </button>

                                    </form>
                                </div>
                            </Modal>
                        </>
                    ) : null}

                    <div className="container mx-auto pt-10 h-screen">
                        {announcement.length > 0 ?
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-4/6">
                                    <DisplayImages images={announcement[0].base64Images}/>
                                    <div className="md:col-span-7 relative">

                                        <div
                                            className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                            <p className="font-medium text-sm text-gray-700 italic mb-5">Publiée
                                                par {announcement[0].profileId.pseudo}</p>

                                            <h2 className="mb-2 font-semibold leading-none text-gray-900 text-4xl">{announcement[0].name}</h2>
                                            <div className="flex items-center justify-between mt-5">
                                                {announcement[0].type === 'location' ?
                                                    <>
                                                                    <span
                                                                        className="bg-purple-100 text-purple-800 text-base font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">Location</span>
                                                        <p className="font-semibold text-lg text-gray-700">{announcement[0].price} €
                                                            / jour <span className="text-sm font-medium"> + frais</span>
                                                        </p>
                                                    </>

                                                    :
                                                    <>
                                                                    <span
                                                                        className="bg-green-100 text-green-800 text-base font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">En vente</span>
                                                        <p className="font-semibold text-lg text-gray-700">{announcement[0].price} € <span
                                                            className="text-sm font-medium"> + frais</span></p>
                                                    </>
                                                }
                                            </div>

                                            <div>
                                                <div className="flex flex-col mt-5">
                                                    <p className="font-semibold">Catégories :</p>
                                                    <div className="py-2">
                                                        {announcement[0].announcementCategories.map((item, index) => {
                                                            return (
                                                                <span key={index}
                                                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-400 text-white mr-2">
                                                        {item.category.name}
                                                    </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            <dl className="mt-10">
                                                <dt className="mb-2 font-semibold leading-none text-gray-900 text-xl">Description
                                                    :
                                                </dt>
                                                <dd className="text-xl text-gray-800 mb-5">{announcement[0].description}</dd>
                                            </dl>

                                            <div className="w-full pt-10">
                                                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
                                                {user ?
                                                    <div className="flex justify-between">
                                                        <button
                                                            onClick={() => openModal()}
                                                            className="flex text-custom-dark bg-custom-white border-2 border-custom-orange hover:bg-custom-hover-orange hover:text-white focus:outline-none font-medium rounded-lg text-base py-2 px-4 md:py-2 text-center mr-0">
                                                            <span>Contacter le propriétaire</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                 viewBox="0 0 24 24" strokeWidth={1.5}
                                                                 stroke="currentColor" className="w-6 h-6 ml-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                                                            </svg>
                                                        </button>

                                                        <button
                                                            className="text-white border-2 border-custom-orange bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-base px-4 py-2 text-center"
                                                            onClick={() => setCheckout(true)}>
                                                            {announcement[0].type === 'sale' ? 'Acheter' : 'Louer'}
                                                        </button>
                                                    </div>
                                                    :
                                                    <Link href="/login"
                                                          className="text-custom-dark bg-custom-white border-2 border-custom-orange hover:bg-custom-hover-orange hover:text-white focus:outline-none font-medium rounded-lg text-base py-2 px-4 md:py-2 text-center mr-0" >Se connecter
                                                    </Link>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {user ?
                                    announcement[0].type === 'sale' ?
                                        <Checkout id={idAnnouncement} checkout={checkout}
                                                  setCheckout={setCheckout} price={announcement[0].price}/>
                                        :
                                        <CheckoutLocation id={idAnnouncement} checkout={checkout}
                                                          setCheckout={setCheckout} price={announcement[0].price}/>
                                    :
                                    null
                                }
                            </>
                            :
                            <Loader/>
                        }
                    </div>
                </section>
            </HomeLayout>
        </>
    )
}