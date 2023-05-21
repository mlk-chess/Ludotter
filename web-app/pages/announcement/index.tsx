import Head from 'next/head'
import React, {useEffect, useState} from "react";
import HomeLayout from "@/components/layouts/Home";

interface Announcement {
    name: string;
    description: string;
    firstImage: string;
}


export default function New() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        document.body.classList.add("bg-custom-light-orange");
    });

    useEffect(() => {


        fetch(`http://localhost:3001/announcement`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then((data) => {
                setAnnouncements(data)

            }).catch((error) => {
            console.log(error);

        });

    }, []);

    return (
        <>
            <Head>
                <title>Ludotter</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <HomeLayout>
                <section>
                    <div className="container my-12 mx-auto px-4 md:px-12">
                        <div className="flex flex-wrap -mx-1 lg:-mx-4">
                            {announcements.map((item, index) => (
                                <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">

                                <div
                                    className="bg-white border border-gray-200 rounded-lg shadow">
                                    <img className="rounded-t-lg" src={item.firstImage} alt=""/>

                                    <div className="p-5">
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{item.name}</h5>

                                        <p className="mb-3 font-normal text-gray-700">{item.description}</p>
                                    </div>
                                </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </HomeLayout>
        </>
    )
}