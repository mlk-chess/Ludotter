import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useCallback, useEffect, useState } from "react";



export default function FormCreate() {

    const [name, setName] = useState("");
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [balance, setBalance] = useState("");
    const [role, setRole] = useState("");
    const [points, setPoints] = useState("");
    const [status, setStatus] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const supabase = useSupabaseClient()

    useEffect(() => {
        document.body.classList.add("bg-custom-light-blue");
    }, []);

    const save = useCallback(async (e: any) => {
        e.preventDefault();

        const {data: {session}} = await supabase.auth.getSession();
        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/user/admin/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            },
            body: JSON.stringify({
                name: name,
                firstname: firstname,
                email: email,
                birthday: birthday,
                pseudo: pseudo,
                balance: balance,
                role: role,
                status: status,
                points: points,

            })
        })
            .then(response => response.json())
            .then((data) => {

                if (data.statusCode === 201) {
                    setSuccess("Created.")
                    setError("")
                } else {
                    setError(data)
                    setSuccess("")
                }

            }).catch((error) => {
                console.log(error);

            });

    }, [name, firstname, email]);


    return (
        <div className="py-8 px-10 mx-auto my-20 max-w-4xl rounded-lg lg:py-16 bg-white">
            <h2 className="mb-8 text-xl font-bold text-gray-900">Ajouter un utilisateur</h2>
            <form className="space-y-6" onSubmit={save}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Nom</label>
                        <input type="text" name="name" id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Jean" required onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Prénom</label>
                        <input type="text" name="name" id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Dupont" required onChange={(e) => setFirstname(e.target.value)} />
                    </div>

                </div>

                <div>
                    <label htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                    <input type="email" name="email" id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="email@exemple.com" required onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="points"
                            className="block mb-2 text-sm font-medium text-gray-900">Points</label>
                        <input type="text" name="text" id="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Points" required onChange={(e) => setPoints(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="balance"
                            className="block mb-2 text-sm font-medium text-gray-900">Balance</label>
                        <input type="text" name="text" id="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Balance" required onChange={(e) => setBalance(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                        <label htmlFor="pseudo"
                            className="block mb-2 text-sm font-medium text-gray-900">Pseudo</label>
                        <input type="text" name="text" id="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Pseudo" required onChange={(e) => setPseudo(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="birthday"
                            className="block mb-2 text-sm font-medium text-gray-900">Date de naissance</label>
                        <input type="date" name="birthday" id="birthday"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Date de naissance" required onChange={(e) => setBirthday(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="role"
                            className="block mb-2 text-sm font-medium text-gray-900">Role</label>
                        <select id="role" name="role" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" onChange={(e) => setRole(e.target.value)}>
                            <option value="ADMIN">Admin</option>
                            <option value="CLIENT">Client</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status"
                            className="block mb-2 text-sm font-medium text-gray-900">Status</label>
                        <select id="status" name="status" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" onChange={(e) => setStatus(e.target.value)}>
                            <option value="1">Activé</option>
                            <option value="0">Désactivé</option>
                        </select>
                    </div>
                </div>
                <button type="submit"
                    className="mt-3 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"> Créer
                </button>
            </form>
        </div>
    )
}