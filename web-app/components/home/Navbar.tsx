import Link from "next/link";
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
    const supabase = useSupabaseClient();
    const [session, setSession] = useState<any | null>(null)

    useEffect(() => {
        const sessionListener = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session?.access_token);
        });
    }, [session]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <nav
            className="bg-custom-light-orange w-full z-20 top-0 left-0 border-b border-custom-highlight-orange">
            <div className="lg:container flex flex-wrap items-center justify-between mx-auto">
                <a href="#" className="flex items-center">
                    <Image src="/otter.png" alt="logo" className="w-14 h-14 lg:w-20 lg:h-20 hover:duration-1000 hover:rotate-[360deg]" width="100" height="100" />
                </a>
                <div className="flex items-center md:order-2">
                    {session ? (
                        <>
                            <button onClick={handleLogout} className="text-custom-dark bg-custom-white border-2 border-custom-orange hover:bg-custom-hover-orange hover:text-white focus:outline-none font-medium rounded-lg text-base py-2 px-4 md:py-2 text-center mr-0">Déconnexion</button>
                        </>

                    ) : (
                        <div className="flex justify-center">
                            <Link href="/login"
                                className="text-custom-dark bg-custom-white border-2 border-custom-orange hover:bg-custom-hover-orange hover:text-white focus:outline-none font-medium rounded-lg text-base py-2 px-4 md:py-2 text-center mr-0" >Se connecter
                            </Link>
                            <Link href="/register"
                                className="text-white border-2 border-custom-orange bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-base px-4 py-2 text-center mr-0 mx-10 ">S'inscrire
                            </Link>
                        </div>
                    )}
                    <button data-collapse-toggle="navbar-sticky" type="button"
                        className="inline-flex items-center p-2 text-sm text-custom-dark rounded-lg md:hidden mr-4"
                        aria-controls="navbar-sticky" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-10 h-10" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul className="bg-custom-light-orange hidden md:flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-custom-light-orange">
                        <li>
                            <a href="#"
                                className="text-custom-dark border-2 border-custom-light-orange hover:border-solid hover:bg-white hover:border-custom-highlight-orange focus:outline-none font-medium rounded-lg text-sm lg:text-base px-4 py-3 text-center"
                                aria-current="page">Explorer</a>
                        </li>
                        <li>
                            <a href="#"
                                className="text-custom-dark border-2 border-custom-light-orange hover:border-solid hover:bg-white hover:border-custom-highlight-orange focus:outline-none font-medium rounded-lg text-sm lg:text-base px-4 py-3 text-center"
                                aria-current="page">Explorer</a>
                        </li>
                        <li>
                            <a href="#"
                                className="text-custom-dark border-2 border-custom-light-orange hover:border-solid hover:bg-white hover:border-custom-highlight-orange focus:outline-none font-medium rounded-lg text-sm lg:text-base px-4 py-3 text-center"
                                aria-current="page">Explorer</a>
                        </li>
                        <li>
                            <a href="#"
                                className="text-custom-dark border-2 border-custom-light-orange hover:border-solid hover:bg-white hover:border-custom-highlight-orange focus:outline-none font-medium rounded-lg text-sm lg:text-base px-4 py-3 text-center"
                                aria-current="page">Explorer</a>
                        </li>
                    </ul>

                    <div className="flex md:hidden h-screen md:h-auto">
                        <ul className="w-full text-lg pt-2 font-medium text-gray-900 bg-custom-light-orange">

                            {session ? (
                                <>
                                    <button onClick={handleLogout}
                                        className="text-custom-dark bg-custom-white border-2 border-custom-orange hover:bg-custom-hover-orange hover:text-white focus:outline-none font-medium rounded-lg text-base py-2 px-4 md:py-2 text-center mr-0"
                                    >Déconnexion</button>
                                </>

                            ) : (
                                <div className="flex justify-center">
                                    <Link href="/login"
                                        className="text-custom-dark bg-custom-white border-2 border-custom-orange hover:bg-custom-hover-orange hover:text-white focus:outline-none font-medium rounded-lg text-base py-2 px-4 md:py-2 text-center mr-0" >Se connecter
                                    </Link>
                                    <Link href="/register"
                                        className="text-white border-2 border-custom-orange bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-base px-4 py-2 text-center mr-0 mx-10 ">S'inscrire
                                    </Link>
                                </div>
                            )}

                            <a>
                                <div className="px-4">
                                    <li className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange">
                                        Profile
                                    </li>
                                </div>
                            </a>
                            <a>
                                <div className="px-4">
                                    <li className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange">
                                        Profile
                                    </li>
                                </div>
                            </a>
                            <a>
                                <div className="px-4">
                                    <li className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange">
                                        Profile
                                    </li>
                                </div>
                            </a>
                            <a>
                                <div className="px-4">
                                    <li className="w-full px-4 py-4 hover:rounded-md hover:bg-custom-highlight-orange">
                                        Profile
                                    </li>
                                </div>
                            </a>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

    )
}