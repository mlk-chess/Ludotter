import React, {useCallback, useEffect, useState} from "react";



export default function FormCreate() {
   
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [players, setPlayers] = useState("1");
    const [description, setDescription] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");


    const save = useCallback(async (e: any) => {
        e.preventDefault();


    }, [name, date, description, time, players]);

    return (
        <div className="py-8 px-10 mx-auto my-20 max-w-4xl rounded-lg lg:py-16 bg-white">
            <h2 className="mb-8 text-xl font-bold text-gray-900">Ajouter un évènement</h2>
            <form onSubmit={save}>
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
                        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:bg-white block w-full p-2.5">
                            <option value="">Sélectionnez une option</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
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
