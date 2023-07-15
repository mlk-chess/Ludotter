import React, {useCallback, useEffect, useState} from "react";
import { useSupabaseClient } from '@supabase/auth-helpers-react';


export default function FormCreate() {
   
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [players, setPlayers] = useState("1");
    const [companies, setCompanies] = useState([]);
    const [company, setCompany] = useState([]);
    const [description, setDescription] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");


    const supabase = useSupabaseClient()

    const save = useCallback(async (e: any) => {
        e.preventDefault();

        const {data: {session}} = await supabase.auth.getSession();

        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/event/saveEventAdmin`, {
            method: 'POST',
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
                companyId: company
              
            })
        })
            .then(response => response.json())
            .then((data) => {

                if (data.statusCode === 201) {
                    setSuccess("L'évènement a bien été créé.")
                    setError("")
                } else {
                    setError(data.response.message)
                    setSuccess("")
                }

            }).catch((error) => {
                console.log(error);

            });

    }, [name, date, description, time, players,company]);


    useEffect( () => {

        document.body.classList.add("bg-custom-light-blue");

        const fetchData = async() => {
            const {data: {session}} = await supabase.auth.getSession();
            fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/event/getCompanies`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.access_token
                },
            })
                .then(response => response.json())
                .then((data) => {
                    setCompanies(data)
                    setCompany(data[0].id)
                }).catch((error) => {
                console.log(error);
            });
        }

        fetchData();
       
    }, []);

    return (
        <div className="py-8 px-10 mx-auto my-20 max-w-4xl rounded-lg lg:py-16 bg-white">
            <h2 className="mb-8 text-xl font-bold text-gray-900">Ajouter un évènement</h2>
            <form onSubmit={save}>

                            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <span className="block sm:inline"> {error}</span>
                                </div>}

                            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline"> {success}</span>
                            </div>}
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="w-full">
                        <label htmlFor="name"
                               className="block mb-2 text-sm font-medium text-gray-900">Nom</label>
                        <input onChange={(e) => setName(e.target.value)} type="text" name="name" id="name"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:bg-white block w-full p-2.5"
                               placeholder="Le nom de votre évènement" required/>
                    </div>


                    <div className="w-full">
                        <label htmlFor="players"
                               className="block mb-2 text-sm font-medium text-gray-900">Nombre de joueurs</label>
                        <input value={players} onChange={(e) => setPlayers(e.target.value)} type="number" name="players" id="players"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:bg-white block w-full p-2.5"
                              required/>
                    </div>


                    <div className="w-full">
                        <label htmlFor="date"
                               className="block mb-2 text-sm font-medium text-gray-900">Date</label>
                        <input  onChange={(e) => setDate(e.target.value)} type="date" name="date" id="date"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:bg-white block w-full p-2.5"
                              required/>
                    </div>

                    <div className="w-full">
                        <label htmlFor="time"
                               className="block mb-2 text-sm font-medium text-gray-900">Heure de début</label>
                        <input onChange={(e) => setTime(e.target.value)} type="time" name="time" id="time"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:bg-white block w-full p-2.5"
                              required/>
                    </div>

                    <div className="w-full">
                     <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900">Nom de l'entreprise</label>
                        <select onChange={ (e:any) => setCompany(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:bg-white block w-full p-2.5">
                       
                            {companies.map((company: any) => (
                                <option key={company.id} value={company.id}>{company.name}</option>
                            ))}

                        </select> 
                    </div>


             

                    <div className="sm:col-span-2">
                        <label htmlFor="description"
                               className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                        <textarea onChange={(e) => setDescription(e.target.value)} id="description" rows={6}
                                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:bg-white"
                                  placeholder="Description de l'évènement" required></textarea>
                    </div>
                </div>
               
                <button className="mt-3 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Ajouter</button>
            </form>
        </div>
    )
}
