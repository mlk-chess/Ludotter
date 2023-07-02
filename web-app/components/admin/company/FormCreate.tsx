import React, {useCallback, useEffect, useState} from "react";
import { useSupabaseClient } from '@supabase/auth-helpers-react';


export default function FormCreate() {
   
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [number, setNumber] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

useEffect(() =>
    {
        document.body.classList.add("bg-custom-light-blue");
        
    },[]);
    const supabase = useSupabaseClient()


    const save = useCallback(async (e: any) => {
        e.preventDefault();

        const {data: {session}} = await supabase.auth.getSession();

        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/company/saveCompanyAdmin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message,
                address: address,
                city: city,
                zipcode: zipcode,
                number: number
              
            })
        })
            .then(response => response.json())
            .then((data) => {

                if (data.statusCode === 201) {
                    setSuccess("Created.")
                    setError("")
                } else {
                    setError(data.response.message)
                    setSuccess("")
                }

            }).catch((error) => {
                console.log(error);

            });

    }, [name, email, message, address, city, zipcode, number]);


    return (
        <div className="py-8 px-10 mx-auto my-20 max-w-4xl rounded-lg lg:py-16 bg-white">
            <h2 className="mb-8 text-xl font-bold text-gray-900">Ajouter un professionnel</h2>
                <form className="space-y-6" onSubmit={save}>
                            <div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Nom de l'entreprise</label>
                                    <input type="text" name="name" id="name"
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                           placeholder="Chez Waseem" required onChange={ (e) => setName(e.target.value)}/>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email"
                                           className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                    <input type="email" name="email" id="email"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                       placeholder="email@exemple.com" required onChange={ (e) => setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="numberPhone"
                                           className="block mb-2 text-sm font-medium text-gray-900">Numéro de téléphone</label>
                                    <input type="text" name="text" id="number" placeholder="01 02 03 04 05" required onChange={ (e) => setNumber(e.target.value)}
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
                                </div>
                            </div>
                          
                            <div>
                                <label htmlFor="address"
                                       className="block mb-2 text-sm font-medium text-gray-900">Adresse</label>
                                <input type="text" name="text" id="text"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                       placeholder="1 rue de la paix" required onChange={ (e) => setAddress(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email"
                                           className="block mb-2 text-sm font-medium text-gray-900">Code Postal</label>
                                    <input type="text" name="text" id="text"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                       placeholder="75 012" required onChange={ (e) => setZipcode(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="numberPhone"
                                           className="block mb-2 text-sm font-medium text-gray-900">Ville</label>
                                    <input type="text" name="text" id="text"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                       placeholder="Paris" required onChange={ (e) => setCity(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="message"
                                       className="block mb-2 text-sm font-medium text-gray-900">Message</label>
                                <textarea name="text" id="text"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                       placeholder="Écrivez-nous un message ..." required onChange={ (e) => setMessage(e.target.value)} />
                            </div>
                            <button type="submit"
                                    className="mt-3 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"> Créer
                            </button>
                        </form>
        </div>
    )
}