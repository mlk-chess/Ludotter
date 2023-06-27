import React, {Fragment, useEffect, useRef, useState} from "react";
import { useRouter } from 'next/router'
import { useUser } from "@supabase/auth-helpers-react";

  const Conversation = () => {

    interface Message{
        message:string;
        sender:Sender;
    }

    interface Sender{
        firstname:string;
        name:string;
        id:string;
    }

    const router = useRouter();
    const user = useUser();
    const [messages, setMessages] = useState([]);

    useEffect( () => {

        const {id} = router.query;

        const getMessages = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/party/getMessagesByConversation/${id}`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then((data) => {
                    console.log(data)
                    setMessages(data)
                }).catch((error) => {
                console.log(error);
            });
        }

        if (id){
            getMessages();
        }

    },[router])

    return (

        <div className="flex flex-col flex-auto h-full p-6">
        <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-custom-highlight-orange shadow-sm h-full p-4">
        <div className="flex flex-col h-full overflow-x-auto mb-4">
            <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">

                    {

                        messages.map( (message:Message,index) => (
                        
                            <div key={index}>

                                { message.sender.id == user!.id ? (
                            
                            
                                <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                    <div className="flex flex-row items-center">

                                        <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                            <div>
                                            {message.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                ) :
                                
                                <div className="col-start-6 col-end-13 p-3 rounded-lg">
                                    <div className="flex items-center justify-start flex-row-reverse">
                                        
                                        <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                            <div>{message.message}</div>
                                        </div>
                                    </div>
                                </div>
                           
                                } 
                            </div>
                            
                        ))
                    }
                
        
            </div>
            </div>
        </div>
        <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
        
            <div className="flex-grow ml-4">
            <div className="relative w-full">
                <input type="text" placeholder="Message..." className="flex w-full rounded-xl border-gray-300 pl-4 h-10"/>
            </div>
            </div>
            <div className="ml-4">
            <button className="flex items-center justify-center bg-custom-pastel-blue hover:bg-indigo-600 rounded-xl text-black font-medium px-4 py-1 flex-shrink-0">
                <span>Envoyer</span>
                <span className="ml-2">
                <svg
                    className="w-4 h-4 transform rotate-45 -mt-px"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                </svg>
                </span>
            </button>
            </div>
        </div>
        </div>
    </div>
   

    );

}

export default Conversation;