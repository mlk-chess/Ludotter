import React, {useEffect, useState} from "react";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import Link from "next/link";

export default function Header() {
    const supabase = useSupabaseClient();
    const [session, setSession] = useState<any | null>(null)

    useEffect(() => {
        const sessionListener = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session?.access_token);
        });
    }, [session]);

    return (
        <section>
            <div className="container mx-auto py-12 h-3/4 mb-20">
                <div className="flex flex-col-reverse items-center md:flex-row">
                    <div className="text-center mb-12 md:text-left md:w-7/12 ">
                        <h1 className="mb-8 font-semibold text-3xl xl:text-5xl"><span
                            className="leading-[140%]"><span
                            className="bg-custom-pastel-purple rounded-2xl px-3 py-1 leading-[100%] inline-block">Louer</span>, <span
                            className="bg-custom-pastel-blue rounded-2xl px-3 py-1 leading-[100%] inline-block">acheter</span>, <span
                            className="bg-custom-highlight-orange rounded-2xl px-3 py-1 leading-[100%] inline-block">participer</span> <br/> à des parties de jeux de société  !</span>
                        </h1>

                        {!session &&
                            <Link href="/register"
                            className="text-white bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-base px-5 py-2.5 text-center">S'inscrire
                            </Link>
                        }
                    </div>
                    <div className="w-1/3 transform translate-x-4 mb-10 md:mb-0">
                        <img className="w-11/12 md:w-3/4 rotate-[20deg]" src="./home/crown.svg" alt="crown"/>
                    </div>
                </div>
            </div>
        </section>
    )
}