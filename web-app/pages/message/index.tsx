import React, {Fragment, useEffect, useRef, useState} from "react";
import HomeLayout from "@/components/layouts/Home";
import Head from 'next/head'
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Conversation from "@/components/message/Conversation";
import Link from "next/link";
import { useRouter } from 'next/router'


export default function Message(){

    interface Conversation{
        id:string;
        party?:Party;
        announcements?:Announcement;
        user1:User;
        user2:User;
    }

    interface Party{
        name: string;
    }

    interface User{

        id:string;
        firstname:string;
        name:string;

    }

    interface Announcement{
        name: string;
    }

    const router = useRouter();
    const {id} = router.query;
    const user = useUser();
    const supabaseClient = useSupabaseClient();
    const [parties,setParties] = useState([]);
    const [announcements,setAnnouncements] = useState([]);
    const [conversation,setConversation] = useState<string>("");
    const supabase = useSupabaseClient();


    useEffect(() => {
        document.body.classList.add("bg-custom-light-orange");

        const fetchData = async () => {
           
            const {data: {session}} = await supabase.auth.getSession();

            fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/message/getLastConversation`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.access_token
                }
            })
                .then(response => response.json())
                .then((data) => {
                    
                    if (data != 0){
                        router.push(`/message?id=${data}`)
                    }else{
                        router.push(`/message`)
                    }
                    
                }).catch((error) => {
                console.log(error);
            });
            
        }
        if (!id){
            fetchData();
        }
    },[]);




    useEffect(() => {

        const getPartiesConversation = async () => {
            const {data: {session}} = await supabase.auth.getSession();
            fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/message/getPartiesConversation`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.access_token
                }
            })
                .then(response => response.json())
                .then((data) => {
                setParties(data)
                }).catch((error) => {
                console.log(error);
            });
        }
        const getAnnouncementsConversation = async () => {
            const {data: {session}} = await supabase.auth.getSession();
            fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/message/getAnnouncementsConversation`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.access_token
                }
            })
                .then(response => response.json())
                .then((data) => {
                setAnnouncements(data)
                }).catch((error) => {
                console.log(error);
            });
        }

        getPartiesConversation();
        getAnnouncementsConversation();
        
    },[]);
   


    return (
        <Fragment>
             <Head>
                <title>Ludotter</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <HomeLayout>

            <div className="flex h-screen antialiased text-gray-800">
                <div className="flex flex-row h-full w-full overflow-x-hidden">
                <div className="flex flex-col py-8 pl-6 pr-2 rounded w-64 flex-shrink-0 ">
                
                    <div className="flex flex-col mt-8">
                    <div className="flex flex-row items-center justify-between text-xs">
                        <span className="font-bold">Annonces</span>
                    </div>

                    <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
                        {
                            announcements.length > 0 && announcements.map((conv:Conversation, index) => (
                                <Link href={{ pathname: '/message', query: { id: conv.id } }} key={index} className="flex flex-col hover:border-white hover:border-l-2 bg-custom-pastel-purple rounded-xl p-2">
                                    { 
                                        conv.user1.id == user?.id ? (
                                            <div className="text-sm font-bold">{conv.user2.firstname}</div>
                                        ) :  <div className="text-sm font-bold">{conv.user1.firstname}</div>
                                    }
                                    <div className="font-medium text-sm">{conv.announcements?.name}</div>
                                </Link>
                            ))
                        }
                    </div>
                    
                    <div className="flex flex-row items-center justify-between text-xs mt-6">
                        <span className="font-bold">Soirées</span>
                       
                        
                    </div>
                    
                    <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
                        {
                            parties.length > 0 && parties.map((conv:Conversation, index) => (
                                <Link href={{ pathname: '/message', query: { id: conv.id } }} key={index} className="flex flex-col hover:border-white hover:border-l-2 bg-custom-pastel-purple rounded-xl p-2">
                                    { 
                                        conv.user1.id == user?.id ? (
                                            <div className="text-sm font-bold">{conv.user2.firstname}</div>
                                        ) :  <div className="text-sm font-bold">{conv.user1.firstname}</div>
                                    }
                                    <div className="font-medium text-sm">{conv.party?.name}</div>
                                </Link>
                            ))
                        }
                    </div>
                    </div>
                </div>
                
                {
                    id ? <Conversation />
                    :  ""
                    
                } 
                
              </div>
            </div>
                
            </HomeLayout>
        </Fragment>
    );

}