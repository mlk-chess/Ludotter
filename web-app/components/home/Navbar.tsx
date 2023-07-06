import Link from "next/link";
import {useSupabaseClient} from '@supabase/auth-helpers-react'
import {useEffect, useState} from "react";
import {HiLogout} from 'react-icons/hi';
import {Dropdown, Navbar} from 'flowbite-react';
import {useRouter} from "next/router";

export default function NavbarComponent() {


    interface User{
        role:string;
    }
    const supabase = useSupabaseClient();
    const [session, setSession] = useState<any | null>(null);
    const [user,setUser] = useState<User[]>([]);
    const [displayAccount, setDisplayAccount] = useState<boolean>(false);
    const router = useRouter();


    const fetchData = async() => {

        const {data: {session}} = await supabase.auth.getSession();
        fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            },
        })
            .then(response => response.json())
            .then((data) => {
                setUser(data)

            }).catch((error) => {
            console.log(error);
        });
    }


    useEffect(() => {
        const sessionListener = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session?.access_token);
        });

        fetchData();
    }, [session]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    console.log(user)

    return (
        <div
            className="bg-custom-light-orange w-full z-20 top-0 left-0 border-b border-custom-highlight-orange md:py-6 lg:py-0">
            <Navbar
                fluid
                rounded
                className="bg-custom-light-orange md:bg-custom-light-orange"
            >
                <Navbar.Brand href="/" className="md:hidden lg:block">
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
                                label={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                }
                                className={'mt-2'}
                            >

                                { user.length > 0 && user[0].role == "CLIENT" &&
                                <>
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
                                        <Link href="/me/meeting">Mes réunions</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Link href="/message">Message</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Link href="/profil">Mon profil</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="lg:hidden">
                                        <Link href="/me/announcement/new">Poster une annonce</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Divider/>
                                    <Dropdown.Item icon={HiLogout} onClick={handleLogout}>
                                        Déconnexion
                                    </Dropdown.Item>
                                </>


                                }

                                { user.length > 0 && user[0].role == "COMPANY" &&
                                    <>
                                        
                                        <Dropdown.Item>
                                            <Link href="/company/event">Mes évènements</Link>
                                        </Dropdown.Item>
                                      
                                        <Dropdown.Item>
                                            <Link href="/profil">Mon profil</Link>
                                        </Dropdown.Item>
                                       
                                        <Dropdown.Divider/>
                                        <Dropdown.Item icon={HiLogout} onClick={handleLogout}>
                                            Déconnexion
                                        </Dropdown.Item>
                                    </>

                                 }

                                { user.length > 0 && user[0].role == "ADMIN" &&
                                    <>
                                        
                                        <Dropdown.Item>
                                            <Link href="/admin">Dashboard admin</Link>
                                        </Dropdown.Item>
                                       
                                        <Dropdown.Divider/>
                                        <Dropdown.Item icon={HiLogout} onClick={handleLogout}>
                                            Déconnexion
                                        </Dropdown.Item>
                                    </>

                                }
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
                    {session && user.length > 0 && user[0].role == "CLIENT" ?
                        <>
                            <li className="hidden lg:block">
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
                    {session ?
                        <>
                            <div
                                onClick={() => setDisplayAccount(!displayAccount)}
                                className="cursor-pointer hover:bg-custom-highlight-orange flex justify-between text-custom-dark border-2 border-custom-highlight-orange bg-white focus:outline-none font-medium rounded-lg text-sm lg:text-base px-4 py-3 text-center">
                                <div className="flex items-center gap-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    <span>Mon compte</span>
                                </div>
                                {displayAccount ?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
                                    </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5}
                                         stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                                    </svg>
                                }
                            </div>
                            {displayAccount &&
                                <div className="w-full flex flex-col bg-gray-50 rounded">


                                    { user.length > 0 && user[0].role == "CLIENT" &&

                                        <>
                                            <Link href="/me/announcement"
                                                className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                                            >Mes annonces</Link>
                                            <Link href="/me/ordering"
                                                className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                                            >Mes commandes</Link>
                                            <Link href="/me/master"
                                                className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                                            >Mes disponibilités</Link>
                                            <Link href="/me/meeting"
                                                className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                                            >Mes réunions</Link>
                                            <Link href="/message"
                                                className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                                            >Message</Link>
                                            <Link href="/profil"
                                                className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                                            >Mon profil</Link>
                                            <Link href="/me/announcement/new"
                                                className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                                            >Poster une annonce</Link>
                                            <Link href="/master"
                                                className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                                            >Jouer en ligne</Link>
                                        </>
                                    }

                                    { user.length > 0 && user[0].role == "COMPANY" &&

                                        <>
                                            <Link href="/company/event"
                                                className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                                            >Mes évènements</Link>
                                            <Link href="/profil"
                                                className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                                            >Mon profil</Link>  
                                        </>
                                    }

                                    { user.length > 0 && user[0].role == "ADMIN" &&

                                    <>
                                        <Link href="/admin"
                                            className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                                        >Dashboard admin</Link>
                                    
                                    </>
                                    }
                                    
                                    <button onClick={handleLogout}
                                        className="w-full px-4 py-4 border-b-2 border-b-custom-pastel-purple hover:rounded-md hover:bg-custom-highlight-orange"
                                    > Déconnexion
                                    </button>
                                </div>
                            }
                        </>
                        : (
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
                    <Link href="/"
                          className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                          aria-current="page">Accueil</Link>
                    <Link href="/announcement"
                          className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                          aria-current="page">Annonces</Link>
                    <Link href="/event"
                          className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                          aria-current="page">Evénements</Link>
                    <Link href="/party"
                          className="w-full px-4 py-4 border-b-2 border-b-custom-highlight-orange hover:rounded-md hover:bg-custom-highlight-orange"
                          aria-current="page">Parties</Link>
                </Navbar.Collapse>
            </Navbar>
        </div>

    )
}