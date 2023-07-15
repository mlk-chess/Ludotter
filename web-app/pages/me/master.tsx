import Head from 'next/head'
import HomeLayout from '@/components/layouts/Home'
import React, {useEffect, useState} from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {Button, Modal} from "flowbite-react";
import Datepicker from "react-tailwindcss-datepicker";
import interactionPlugin from "@fullcalendar/interaction"
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import Loader from "@/components/utils/Loader";

interface Error {
    date: string;
    startTime: string;
    endTime: string;
}

interface Visio {
    date: string;
    title: string;
    id: string;
    dateVisio: string;
}

export default function Master() {
    const [load, setLoad] = useState<boolean>(false)
    const [visio, setVisio] = useState<Visio[]>([])
    const [displayModal, setDisplayModal] = useState<boolean>(false);
    const [displayDeleteModal, setDisplayDeleteModal] = useState<boolean>(false);
    const [isLoader, setIsLoader] = useState<boolean>(false);
    const [isLoad, setIsLoad] = useState<boolean>(true);
    const [isLoaderDelete, setIsLoaderDelete] = useState<boolean>(false);
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [errors, setErrors] = useState<Error>({} as Error);
    const [globalError, setGlobalError] = useState<string>('');
    const [deleteId, setDeleteId] = useState<string>('');
    const supabase = useSupabaseClient();

    const handleValueChange = (newValue: any) => {
        setValue(newValue);
    }

    useEffect(() => {
        document.body.classList.add("bg-custom-light-orange");
        setLoad(true);
        fetchData();
    }, []);

    const addDate = async () => {
        setIsLoader(true);
        let error = false;
        setErrors({} as Error);

        if (value.startDate === null || value.endDate === null) {
            setErrors((prevState) => ({
                ...prevState,
                date: "Veuillez sélectionner une date"
            }));
            error = true;
        }

        if (startTime === '') {
            setErrors((prevState) => ({
                ...prevState,
                startTime: "Veuillez sélectionner une heure de début"
            }));
            error = true;
        }

        if (endTime === '') {
            setErrors((prevState) => ({
                ...prevState,
                endTime: "Veuillez sélectionner une heure de fin"
            }));
            error = true;
        }

        if (!error) {
            const {data: {session}} = await supabase.auth.getSession();

            await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/visio/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.access_token,
                },
                body: JSON.stringify({
                    date: value.startDate,
                    startTime: startTime,
                    endTime: endTime,
                })
            })
                .then(response => {
                    const statusCode = response.status;
                    if (statusCode !== 201) {
                        setIsLoader(false);
                    }

                    return response.json();
                })
                .then((data) => {
                    if (data.statusCode === 201) {
                        fetchData();
                        handleClodeModal();
                    } else {
                        if (data.response.message) {
                            setGlobalError(data.response.message);
                        } else {
                            setGlobalError("Une erreur est survenue.");
                        }
                    }
                }).catch((error) => {
                    console.log(error);
                });
        }
        setIsLoader(false);
    }

    const handleClodeModal = () => {
        setDisplayModal(false);
        setGlobalError('');
        setErrors({} as Error);
        setStartTime('');
        setEndTime('');
        setValue({
            startDate: null,
            endDate: null
        })
    }

    const handleDelete = (id: string) => {
        setDeleteId(id);
        setDisplayDeleteModal(true)
    }

    const fetchData = async () => {
        const {data: {session}} = await supabase.auth.getSession();

        fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/visio`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token,
            },
        })
            .then(response => response.json())
            .then((data) => {
                setVisio(data);
                setIsLoad(false);
            }).catch((error) => {
            console.log(error);
        });
    }

    const deleteDispo = async () => {
        setIsLoaderDelete(true);

        const {data: {session}} = await supabase.auth.getSession();

        fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/visio/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            },
            body: JSON.stringify({
                id: deleteId,
            })
        })
            .then(response => {
                const statusCode = response.status;

                return response.json();
            })
            .then((data) => {
                if (data.statusCode === 200) {
                    fetchData();
                    setDisplayDeleteModal(false);
                    setIsLoaderDelete(false);
                    setGlobalError('');
                    setErrors({} as Error);
                } else {
                    if (data.response.message) {
                        setGlobalError(data.response.message);
                    } else {
                        setGlobalError("Une erreur est survenue.");
                    }
                    setIsLoaderDelete(false);
                }
            }).catch((error) => {
            console.log(error);
            setIsLoaderDelete(false);
        });
    }

    function renderEventContent(eventInfo: any) {
        const date = new Date(eventInfo.event._def.extendedProps.dateVisio);
        const today = new Date();

        return (
            <div className="flex items-center justify-between">
                <i>{eventInfo.event.title}</i>
                {date > today &&
                    <svg onClick={() => handleDelete(eventInfo.event.id)} xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-5 h-5 hover:bg-[#1da1f2]/90 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                }
            </div>
        )
    }

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
                    <div className="container mx-auto">
                        {isLoad ?
                            <Loader/>
                            :
                            <>
                                <h2 className="mt-10 mb-3 ml-5 text-3xl font-semibold text-center">Mes disponibilités</h2>
                                <div className="w-full flex justify-center">
                                    <div className="w-3/4 mt-10">
                                        <div
                                            className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                            <button onClick={() => setDisplayModal(true)}
                                                    className="mt-4 ml-10 text-custom-dark bg-custom-white border-2 border-custom-orange hover:bg-custom-hover-orange hover:text-white focus:outline-none font-medium rounded-lg text-base py-2 px-4 md:py-2 text-center mr-0">Ajouter
                                                une disponibilité
                                            </button>
                                            <FullCalendar
                                                plugins={[dayGridPlugin, interactionPlugin]}
                                                initialView="dayGridMonth"
                                                firstDay={1}
                                                locale="fr"
                                                headerToolbar={{
                                                    center: 'title',
                                                    left: '',
                                                }}
                                                buttonText={{
                                                    today: 'Aujourd\'hui',
                                                }}
                                                events={visio}
                                                eventContent={renderEventContent}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                        {load ?
                            <>
                                <Modal
                                    onClose={handleClodeModal}
                                    show={displayModal}
                                    popup
                                    size="lg"
                                >
                                    <Modal.Header/>
                                    <Modal.Body>
                                        <div className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5} stroke="currentColor"
                                                 className="mx-auto mb-4 h-10 w-10 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"/>
                                            </svg>

                                            <div className="mb-6 flex flex-col">
                                                <Datepicker
                                                    asSingle={true}
                                                    i18n={"fr"}
                                                    startWeekOn="mon"
                                                    minDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
                                                    value={value}
                                                    startFrom={new Date()}
                                                    onChange={handleValueChange}
                                                    primaryColor={"purple"}
                                                />
                                                <p className="text-red-600">{errors.date}</p>

                                                <div className="grid md:grid-cols-12 gap-6 mt-5">
                                                    <div className="col-span-6">
                                                        <label htmlFor="startTime"
                                                               className="block mb-2 text-sm font-medium text-gray-500">Heure
                                                            de début</label>
                                                        <input type="time" id="startTime"
                                                               onChange={(e) => setStartTime(e.target.value)}
                                                               className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                               required
                                                               value={startTime}
                                                        />
                                                        <p className="text-red-600">{errors.startTime}</p>
                                                    </div>

                                                    <div className="col-span-6">
                                                        <label htmlFor="endTime"
                                                               className="block mb-2 text-sm font-medium text-gray-500">Heure
                                                            de fin</label>
                                                        <input type="time" id="endTime"
                                                               onChange={(e) => setEndTime(e.target.value)}
                                                               className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                               required
                                                               value={endTime}
                                                        />
                                                        <p className="text-red-600">{errors.endTime}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>

                                            {isLoader ?
                                                <svg aria-hidden="true"
                                                     className="inline w-8 h-8 text-gray-200 animate-spin fill-gray-600"
                                                     viewBox="0 0 100 101" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                        fill="currentColor"/>
                                                    <path
                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                        fill="currentFill"/>
                                                </svg>
                                                :
                                                <>
                                                    <div className="flex justify-center gap-4">
                                                        <Button
                                                            color="success"
                                                            onClick={addDate}
                                                        >
                                                            Ajouter
                                                        </Button>
                                                        <Button
                                                            color="gray"
                                                            onClick={handleClodeModal}
                                                        >
                                                            Fermer
                                                        </Button>
                                                    </div>
                                                    <p className="text-red-600">{globalError}</p>
                                                </>
                                            }
                                        </div>
                                    </Modal.Body>
                                </Modal>
                                <Modal
                                    onClose={() => setDisplayDeleteModal(false)}
                                    show={displayDeleteModal}
                                    popup
                                    size="lg"
                                >
                                    <Modal.Header/>
                                    <Modal.Body>
                                        <div className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5} stroke="currentColor"
                                                 className="mx-auto mb-4 h-14 w-14 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
                                            </svg>

                                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                Voulez-vous vraiment supprimer cette disponibilité ?
                                            </h3>
                                            {isLoaderDelete ?
                                                <svg aria-hidden="true"
                                                     className="inline w-8 h-8 text-gray-200 animate-spin fill-gray-600"
                                                     viewBox="0 0 100 101" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                        fill="currentColor"/>
                                                    <path
                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                        fill="currentFill"/>
                                                </svg>
                                                :
                                                <div className="flex justify-center gap-4">
                                                    <Button
                                                        color="failure"
                                                        onClick={deleteDispo}
                                                    >
                                                        Oui, je suis sûr
                                                    </Button>
                                                    <Button
                                                        color="gray"
                                                        onClick={() => setDisplayDeleteModal(false)}
                                                    >
                                                        Non, annuler
                                                    </Button>
                                                </div>
                                            }
                                        </div>
                                    </Modal.Body>
                                </Modal>
                            </>
                            :
                            null
                        }
                    </div>
                </section>
            </HomeLayout>
        </>
    )
}