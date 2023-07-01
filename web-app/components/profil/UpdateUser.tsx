import React, {useCallback, useEffect,useState} from "react";
import 'flowbite';

import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from "next/link";

export default function UpdateUserProfil() {

    const supabase = useSupabaseClient()
    const [name,setName] = useState("");
    const [firstname,setFirstname] = useState("");
    const [birthday,setBirthday] = useState("");
    const [email,setEmail] = useState("");
    const [pseudo,setPseudo] = useState("");
  


    useEffect(() =>
    {

        const fetchData = async () => {

            const {data: {session}} = await supabase.auth.getSession();
            fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.access_token
                }
            })
                .then(response => response.json())
                .then((data) => {
                    console.log(data)
                    setEmail(data[0].email)
                    setName(data[0].name)
                    setFirstname(data[0].firstname)
                    setPseudo(data[0].pseudo)
                   
                }).catch((error) => {
                console.log(error);
            });
            
        }
        fetchData();
     
    
    },[]);

    const update = useCallback( async (e:any) => {
        e.preventDefault();
        const {data: {session}} = await supabase.auth.getSession();

        fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/update-me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            },
            body:JSON.stringify({
                name: name,
                firstname:firstname,
                email:email,
                pseudo:pseudo
            })
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data)
              
            }).catch((error) => {
            console.log(error);
        });
    },[name,firstname,email,pseudo])

    return (
                <div className="grid mt-10 place-items-center">
                    <div className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-7">
                        <div className="flex font-medium text-2xl mb-8">
                            <h1>Informations personnelles</h1>
                        </div>
                        <form className="space-y-6" onSubmit={update}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstname"
                                           className="block mb-2 text-sm font-medium text-gray-900">Prénom</label>
                                    <input type="text" value={firstname} onChange={ (e) => setFirstname(e.target.value)}
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple block w-full p-2.5"
                                           placeholder="Jehane"/>
                                </div>
                                <div>
                                    <label htmlFor="name"
                                           className="block mb-2 text-sm font-medium text-gray-900">Nom</label>
                                    <input type="name" value={name} onChange={ (e) => setName(e.target.value)}
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple block w-full p-2.5"
                                           placeholder="Benadjemia"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstname"
                                           className="block mb-2 text-sm font-medium text-gray-900">Pseudo</label>
                                    <input type="text" value={pseudo} onChange={ (e) => setPseudo(e.target.value)}
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple block w-full p-2.5"
                                           placeholder="jehanebnj"/>
                                </div>
                            </div>
                          
                            <div>
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input type="email" value={email} onChange={ (e) => setEmail(e.target.value)}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple block w-full p-2.5"
                                       placeholder="jehanebnj@gmail.com"/>
                            </div>
                            <button type="submit"
                                    className="text-white bg-custom-orange hover:bg-custom-hover-orange focus:ring-4 focus:outline-none font-medium rounded-lg text-sm md:text-base px-5 py-2.5 text-center">Enregistrer
                            </button>
                            <Link href="/forgetPassword" className="mx-2 text-white border-2 border-custom-orange bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-base px-4 py-2 text-center">
                                Changer mon mot de passe
                            </Link>
                        </form>
                       
                    </div>
                </div>
    )
}
