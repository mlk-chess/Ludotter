import Head from 'next/head'
import AdminLayout from "@/components/layouts/Admin";
import Modal from "@/components/Modal";
import 'flowbite';
import { useCallback, useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface Event {
    name: string;
    description: string;
    id: string;
    date: string;
    time: string;
    company:Company;
    status:number;
    players:number
}

interface Company{
    name:string
    id:string
}

export default function Event() {


    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [players, setPlayers] = useState<string>("");
    const [company, setCompany] = useState([]);
    const [events, setEvents] = useState([]);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [description, setDescription] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventSelected, setEventSelected] = useState<Event | undefined>(undefined);
    const supabase = useSupabaseClient()


    const getEvents = useCallback( async () => {

        const {data: {session}} = await supabase.auth.getSession();
        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/event/getEventsAdmin`,{
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            }
        })
        .then(response => response.json())
        .then( (data) => {
            setEvents(data)
            
        }).catch( (error) =>{
            console.log(error);
            
        });
    },[])

   
    useEffect( () => {
        getEvents();
    },[]);


    const cancelEvent = useCallback( async () => {

        const {data: {session}} = await supabase.auth.getSession();
        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/event/${eventSelected?.id}`,{
            method:'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            }
        })
        .then(response => response.json())
        .then( (data) => {
            getEvents()
            setShowDeleteModal(false);
         
        }).catch( (error) =>{
            console.log(error);  
        });

    },[eventSelected])


    const openModal = useCallback( async (event:Event, isUpdate : boolean) => {
        isUpdate ? setShowUpdateModal(true) :  setShowDeleteModal(true);
        setEventSelected(event);
        setDate(event.date);
        setName(event.name);
        setPlayers(event.players.toString());
        setDescription(event.description);
        setTime(event.time);
        
        
    },[])


    const update = useCallback(async (e: any) => {
        e.preventDefault();

        const {data: {session}} = await supabase.auth.getSession();

        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/event/${eventSelected?.id}`, {
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
                players: players,
              
            })
        })
            .then(response => response.json())
            .then((data) => {

                if (data.statusCode === 200) {
                    setShowUpdateModal(false);
                    getEvents();
                } else {
                    setError(data.response.message)
                    setSuccess("")
                }

            }).catch((error) => {
                console.log(error);

            });

    }, [name, date, description, time, players,company,eventSelected]);




    return (
        <>
             <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <AdminLayout>
                <div className="p-4 sm:ml-64">
                    <div className="p-4 mt-14">

                        {showDeleteModal ? (
                            <>
                            <Modal setShowModal={setShowDeleteModal}>
                                <h3 className="mb-5 text-lg font-normal text-gray-500">Voulez-vous vraiment annuler cet évènement ?</h3>
                                <div className="flex justify-end">
                                    <button onClick={() => cancelEvent()} type="button" className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">
                                        Supprimer
                                    </button>
                                </div>
                            </Modal>
                            </>
                        ) : null}


                        {showUpdateModal ? (
                            <>
                            <Modal setShowModal={setShowUpdateModal} title="Modification">
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
                            
                                <button className="mt-3 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Modifier</button>
                            </form>
                            </Modal>
                            </>
                        ) : null}

                

                  
                        <div className="flex justify-end">
                            <button className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Créer un événement</button>
                        </div>

                        <div className="relative overflow-x-auto mt-5">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr className="border-b">
                                        <th scope="col" className="px-6 py-4">
                                            Nom
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Descritpion
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Date
                                        </th>
                                       
                                        <th scope="col" className="px-6 py-4">
                                            Entreprise
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Statut
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>

                                { 
                                    events.length > 0 && events.map( (event:Event,index) => {
                                        return (

                                            <tr key={index} className={index % 2 == 0 ? ' bg-white' : ' bg-gray-50'}>
                                                <td scope="row" className="px-6 py-3 text-gray-900">
                                                   {event.name}
                                                </td>
                                                <td scope="row" className="px-6 py-3 text-gray-900">
                                                   {event.description}
                                                </td>
                                                <td scope="row" className="px-6 py-3 text-gray-900">
                                                   {event.date} {event.time}
                                                </td>
                                                <td scope="row" className="px-6 py-3 text-gray-900">
                                                    {event?.company?.name}
                                                </td>
                                                 <td scope="row" className="px-6 py-3 text-gray-900">
                                                
                                                    {event.status == -1 &&
                                                        <span
                                                            className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md border border-red-100">Annulé</span>
                                                    }
                                                    {event.status == 1 &&
                                                        <span
                                                            className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md border border-green-100">Publié</span>
                                                    }
                                                </td>
                                                    
                                                <td className="px-6 py-3 flex">

                                                {event.status == 1 &&
                                                    <svg onClick={ () => openModal(event, true)} className="w-6 h-6 stroke-blue-500 cursor-pointer" fill="none" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                }
                                                {event.status == 1 &&
                                                    <svg onClick={ () => openModal(event, false)}  fill="none" className="w-6 h-6 stroke-red-500 cursor-pointer" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                }
                            
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    )
}


