import Head from 'next/head'
import React, {useCallback, useEffect, useState} from "react";
import HomeLayout from "@/components/layouts/Home";
import {useRouter} from "next/router";
import {Button} from "flowbite-react";
import Modal from '@/components/Modal';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

interface Event {
    name: string;
    description: string;
    id: string;
    date: string;
    time: string;
    company:Company
    status:number;
}

interface User{
  
    name : string;
    firstname:string;
}

interface Profile{
    profiles : User;
}

interface Company{
    address : string;
    city : string;
    zipcode : string;
}





export default function Event() {
    const [event, setEvent] = useState<Event[]>([]);
    const [users, setUsers] = useState<Profile[]>([]);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [updateModal, setUpdateModal] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [idEvent, setIdEvent] = useState<string>('');
    const [error, setError] = useState("");

    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [description, setDescription] = useState("");
    const [players, setPlayers] = useState<string>("");

    const router = useRouter();
    const supabase = useSupabaseClient()

    useEffect(() => {
        document.body.classList.add("bg-custom-light-orange");
    },[]);

    useEffect(() => {
        if (!router.isReady) return;

        const {id} = router.query;
        if (typeof id === 'string') {
            setIdEvent(id)
            getEvent(id);
        }
    }, [router.isReady]);

    const getEvent = useCallback( (id:string) => {
       
         fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/event/${id}`, {
            method: 'GET',
        })
            .then((response) =>{
                return response.json()
            })
            .then((data) => {
                setEvent(data)
                setDate(data[0].date);
                setName(data[0].name);
                setPlayers(data[0].players);
                setDescription(data[0].description);
                setTime(data[0].time);
            }).catch((error) => {
            console.log(error);

        });
    },[])



    useEffect( () => {

        if (!router.isReady) return;
        const {id} = router.query;

        const fetchData = async (id:any) => {

            const {data: {session}} = await supabase.auth.getSession();
            await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/event/getUsersByEvent/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.access_token
                },
            })
                .then(response => response.json())
                .then((data) => {
                    setUsers(data)
                }).catch((error) => {
                console.log(error);

            });
        }

        fetchData(id);

    }, [router.isReady]);

    const update = useCallback(async (e: any) => {
        e.preventDefault();

        const {data: {session}} = await supabase.auth.getSession();
        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/event/${idEvent}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            },
            body: JSON.stringify({
                name: name,
                time: time,
                description: description,
                date: date,
                players: players
            })
        })
            .then(response => response.json())
            .then((data) => {

                if (data.statusCode === 200) {
                    getEvent(idEvent);
                    setUpdateModal(false)
                   
                } else {
                    setError(data.response.message)
                   
                }

            }).catch((error) => {
                console.log(error);

            });

    },[idEvent, time, date, players, description, name]);      


    const deleteEvent = useCallback(async (e: any) => {
        e.preventDefault();

        const {data: {session}} = await supabase.auth.getSession();
        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/event/${idEvent}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            },   
        })
            .then(response => response.json())
            .then((data) => {
                router.push('/me/event');
            }).catch((error) => {
                console.log(error);
            });
    }, [idEvent]);

    
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
                    <div className="container mx-auto pt-10 h-screen">
                     
                            <div className="grid grid-cols-1 md:grid-cols-12 h-4/6">
                                <div className="md:col-span-5 my-10">
                                    <div className="py-8 px-10 mx-auto  max-w-4xl rounded-lg lg:py-14 bg-white">
                                        <h2 className="mb-3 text-xl font-bold text-gray-900">Les Ludotters</h2>
                                        <hr></hr>

                                        {
                                            users.map((user, index) => (
                                                <div key={index} className="w-full mt-5 font-medium rounded px-5 py-2 bg-custom-highlight-orange">
                                                    {user.profiles.firstname} {user.profiles.name}
                                                </div>
                                            )
                                        )}
                                       
                                    </div>
                                </div>
                                <div className="md:col-span-7 md:col-start-7 my-10">

                                    <div className="py-8 px-10 mx-auto  max-w-4xl rounded-lg lg:py-14 bg-white">

                                        <h2 className="mb-10 text-xl font-bold text-gray-900">{event[0]?.name}</h2>
                                        <div className="flex mb-5 justify-between">
                                            <span className="bg-custom-pastel-purple rounded font-medium px-3 py-1 leading-[100%] inline-block">Où ?</span>
                                            <span className="px-3 py-1 leading-[100%] inline-block">{event[0]?.company.address} {event[0]?.company.city} {event[0]?.company.zipcode}</span>
                                        </div>
                                        <div className="flex mb-5 justify-between">
                                            <span className="bg-custom-highlight-orange rounded font-medium px-3 py-1 leading-[100%] inline-block">Quand ?</span>
                                            <span className="px-3 py-1 leading-[100%] inline-block">{event[0]?.date} {event[0]?.time}</span>
                                        </div>
                                        <div className="flex mb-5 justify-between ">
                                            <span className="bg-custom-pastel-blue rounded font-medium px-3 py-1 leading-[100%] inline-block">Pour quoi ?</span>
                                            <span className="px-3 py-1 leading-[100%] inline-block">{event[0]?.description} </span>
                                        </div>

                                        <div className="mt-10 flex">
                                       
                                            { event[0]?.status == 1 ? (
                                            <>
                                                <button onClick={() => setDeleteModal(true)} className="px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white bg-custom-orange rounded-lg hover:bg-custom-hover-orange">
                                                    Annuler l'évènement
                                                </button>
                                                <button onClick={() => setUpdateModal(true)} className="mx-2 px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white bg-custom-orange rounded-lg hover:bg-custom-hover-orange">
                                                    Modifier l'évènement
                                                </button>
                                            </>
                                            ) : "L'évenement a été annulé."
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
                                            <Button color="failure" onClick={deleteEvent}>
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
                                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                            <div className="w-full">
                                                <label htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900">Nom</label>
                                                <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:bg-white block w-full p-2.5"
                                                    placeholder="Le nom de votre évènement" required/>
                                            </div>


                                            <div className="w-full">
                                                <label htmlFor="players"
                                                    className="block mb-2 text-sm font-medium text-gray-900">Nombre de joueurs</label>
                                                <input value={players}  onChange={(e) => setPlayers(e.target.value)} type="number" name="players" id="players"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:bg-white block w-full p-2.5"
                                                    required/>
                                            </div>


                                            <div className="w-full">
                                                <label htmlFor="date"
                                                    className="block mb-2 text-sm font-medium text-gray-900">Date</label>
                                                <input value={date}  onChange={(e) => setDate(e.target.value)} type="date" name="date" id="date"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:bg-white block w-full p-2.5"
                                                    required/>
                                            </div>

                                            <div className="w-full">
                                                <label htmlFor="time"
                                                    className="block mb-2 text-sm font-medium text-gray-900">Heure de début</label>
                                                <input value={time} onChange={(e) => setTime(e.target.value)} type="time" name="time" id="time"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:bg-white block w-full p-2.5"
                                                    required/>
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label htmlFor="description"
                                                    className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                                                <textarea value={description}  onChange={(e) => setDescription(e.target.value)} id="description" rows={6}
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
                    
                    </div>
                </section>
            </HomeLayout>
        </>
    )
}