import Link from "next/link";
import {useSupabaseClient} from '@supabase/auth-helpers-react'
import {useEffect, useState} from "react";
import {HiLogout} from 'react-icons/hi';
import {Dropdown, Navbar} from 'flowbite-react';

export default function NavbarComponent() {
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
        <div
            className="bg-custom-light-orange w-full z-20 top-0 left-0 border-b border-custom-highlight-orange">
            <Navbar
                fluid
                rounded
                className="bg-custom-light-orange md:bg-custom-light-orange"
            >
                <Navbar.Brand href="/">
                    <img
                        alt="Ludotter Logo"
                        className="w-14 h-14 lg:w-20 lg:h-20 hover:duration-1000 hover:rotate-[360deg]"
                        src="/otter.png"
                    />
                </Navbar.Brand>
                <div
                    className="flex md:order-2"
                >
                </div>
                <div className="hidden md:block absolute right-0">
                    {session ?
                        <div
                            className="text-custom-dark border-2 border-custom-highlight-orange bg-white focus:outline-none font-medium rounded-lg text-sm lg:text-base px-4 py-3 text-center">
                            <Dropdown
                                inline
                                label={'Mon compte'}
                                className={'mt-2'}
                            >
                                <Dropdown.Item>
                                    <Link href="/me/announcement">Mes annonces</Link>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <Link href="/me/ordering">Mes commandes</Link>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <Link href="/me/master">Mes disponibilités</Link>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <Link href="/profil">Mon profil</Link>
                                </Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item icon={HiLogout} onClick={handleLogout}>
                                    Déconnexion
                                </Dropdown.Item>
                            </Dropdown>
                        </div>
                        :
                        <div>
                            <Link href="/login"
                                  className="text-custom-dark bg-custom-white border-2 border-custom-orange hover:bg-custom-hover-orange hover:text-white focus:outline-none font-medium rounded-lg text-base py-2 px-4 md:py-2 text-center mr-0">Se
                                connecter
                            </Link>
                            <Link href="/register"
                                  className="text-white border-2 border-custom-orange bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-base px-4 py-2 text-center mr-0 mx-10 ">S'inscrire
                            </Link>
                        </div>
                    }
                </div>

                <Navbar.Toggle/>
                <Navbar.Collapse className="hidden md:block">
                    <li>
                        <Link href="/"
                              className="text-custom-dark border-2 border-custom-light-orange hover:border-solid hover:bg-white hover:border-custom-highlight-orange focus:outline-none font-medium rounded-lg text-sm lg:text-base px-4 py-3 text-center"
                              aria-current="page">Accueil</Link>
                    </li>
                    <li>
                        <Link href="/announcement"
                              className="text-custom-dark border-2 border-custom-light-orange hover:border-solid hover:bg-white hover:border-custom-highlight-orange focus:outline-none font-medium rounded-lg text-sm lg:text-base px-4 py-3 text-center"
                              aria-current="page">Annonces</Link>
                    </li>
                    <li>
                        <Link href="/event"
                              className="text-custom-dark border-2 border-custom-light-orange hover:border-solid hover:bg-white hover:border-custom-highlight-orange focus:outline-none font-medium rounded-lg text-sm lg:text-base px-4 py-3 text-center"
                              aria-current="page">Evénements</Link>
                    </li>
                    <li>
                        <Link href="/party"
                              className="text-custom-dark border-2 border-custom-light-orange hover:border-solid hover:bg-white hover:border-custom-highlight-orange focus:outline-none font-medium rounded-lg text-sm lg:text-base px-4 py-3 text-center"
                              aria-current="page">Parties</Link>
                    </li>
                    {session ?
                        <>
                            <li>
                                <Link href="/me/announcement/new"
                                      className="text-custom-dark border-2 border-custom-light-orange hover:border-solid hover:bg-white hover:border-custom-highlight-orange focus:outline-none font-medium rounded-lg text-sm lg:text-base px-4 py-3 text-center"
                                      aria-current="page">Poster une annonce</Link>
                            </li>
                            <li>
                                <Link href="/master"
                                      className="text-custom-dark border-2 border-custom-light-orange hover:border-solid hover:bg-white hover:border-custom-highlight-orange focus:outline-none font-medium rounded-lg text-sm lg:text-base px-4 py-3 text-center"
                                      aria-current="page">Jouer en ligne</Link>
                            </li>
                        </>
                        :
                        null
                    }
                </Navbar.Collapse>

                <Navbar.Collapse className="md:hidden block">
                    {session ? (
                        <>
                            <button onClick={handleLogout}
                                    className="text-custom-dark bg-custom-white border-2 border-custom-orange hover:bg-custom-hover-orange hover:text-white focus:outline-none font-medium rounded-lg text-base py-2 px-4 md:py-2 text-center mr-0"
                            >Déconnexion
                            </button>
                        </>

                    ) : (
                        <div className="flex justify-center">
                            <Link href="/login"
                                  className="text-custom-dark bg-custom-white border-2 border-custom-orange hover:bg-custom-hover-orange hover:text-white focus:outline-none font-medium rounded-lg text-base py-2 px-4 md:py-2 text-center mr-0">Se
                                connecter
                            </Link>
                            <Link href="/register"
                                  className="text-white border-2 border-custom-orange bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-base px-4 py-2 text-center mr-0 mx-10 ">S'inscrire
                            </Link>
                        </div>
                    )}
                    <li className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange">
                        <Link href="/"
                              aria-current="page">Accueil</Link>
                    </li>
                    <li className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange">
                        <Link href="/announcement"
                              aria-current="page">Annonces</Link>
                    </li>
                    <li className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange">
                        <Link href="/event"
                              aria-current="page">Evénements</Link>
                    </li>
                    <li className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange">
                        <Link href="/party"
                              aria-current="page">Parties</Link>
                    </li>
                </Navbar.Collapse>
            </Navbar>
        </div>

    )
}