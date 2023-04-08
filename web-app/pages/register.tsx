import Head from 'next/head'
import React, {useEffect} from "react";
import Link from "next/link";

export default function Register() {
    useEffect(() =>
    {
        document.body.classList.add("bg-custom-light-orange");
    });

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main>
                <div className="grid h-screen place-items-center">
                    <div
                        className="w-full max-w-xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                        <form className="space-y-6" action="#">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstname"
                                           className="block mb-2 text-sm font-medium text-gray-900">Prénom</label>
                                    <input type="text" name="firstname" id="firstname"
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                           placeholder="Jean" required/>
                                </div>
                                <div>
                                    <label htmlFor="name"
                                           className="block mb-2 text-sm font-medium text-gray-900">Nom</label>
                                    <input type="name" name="name" id="name" placeholder="Pierre"
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                           required/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input type="email" name="email" id="email"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                       placeholder="email@exemple.com" required/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password"
                                           className="block mb-2 text-sm font-medium text-gray-900">Mot de passe</label>
                                    <input type="password" name="password" id="password"
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                           placeholder="******" required/>
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword"
                                           className="block mb-2 text-sm font-medium text-gray-900">Confirmation du mot de passe</label>
                                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder="******"
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                           required/>
                                </div>
                            </div>
                            <button type="submit"
                                    className="w-full text-white bg-custom-orange hover:bg-custom-hover-orange focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">S'inscrire
                            </button>
                        </form>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-300 mt-10">
                            Vous avez déjà un compte ? <Link href="/login" className="text-custom-orange hover:underline">Se connecter</Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
