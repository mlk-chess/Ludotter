import React, {Fragment, useCallback, useEffect, useRef, useState} from "react";
import { useRouter } from 'next/router'
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

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
    const [message, setMessage] = useState("");
    const [id, setId] = useState<string | string[] | undefined>('');
    const supabaseClient = useSupabaseClient()
    

    const getMessages = useCallback( async (id:any) => {
        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/message/getMessagesByConversation/${id}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then((data) => {

                if(data.status == 404 || data.status == 500 || data.status == 403){
                    router.push('/message')
                }else{
                    setMessages(data)
                } 
                
            }).catch((error) => {
            console.log(error);
        });
    },[])

    useEffect( () => {

        const {id} = router.query;
       
          
        if (id){
            setId(id)
            getMessages(id);
        }

        const messagesWatcher = supabaseClient.channel('messages-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'message' },
            payload => {
                
                getMessages(id);
            }
        )
        .subscribe()

    },[router])

    const handleSubmit = useCallback(() => {

        fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/message/sendMessageParty`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                convId: id,
                message: message,
            })
        })
            .then(response => response.json())
            .then((data) => {
                setMessage("")
                
            }).catch((error) => {
            console.log(error);
        });

    },[message,id]);



    return (

        <div className="flex flex-col flex-auto h-full p-6">
        <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-custom-highlight-orange shadow-sm h-full p-4">
        <div className="flex flex-col h-full overflow-x-auto mb-4">
            <div className="flex flex-col h-full">
                
                    {

                        messages.length > 0 && messages.map( (message:Message,index) => (
                    
                            <div key={index} className="grid grid-cols-12 gap-y-2">

                                { message.sender.id != user!.id ? (
                            
                            
                                <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                    <div className="flex flex-row items-center">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-custom-pastel-purple flex-shrink-0">
                                            {message.sender.firstname.toUpperCase().slice(0,1)}
                                            {message.sender.name.toUpperCase().slice(0,1)}
                                        </div>

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

                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-custom-pastel-purple flex-shrink-0">
                                                {message.sender.firstname.toUpperCase().slice(0,1)}
                                                {message.sender.name.toUpperCase().slice(0,1)}
                                        </div>
                                        
                                        <div className="relative mr-3 text-sm bg-custom-pastel-blue py-2 px-4 shadow rounded-xl">
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
        <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
        
            <div className="flex-grow ml-4">
            <div className="relative w-full">
                <input type="text" value={message} onChange={ (e) => {setMessage(e.target.value)}} placeholder="Message..." className="flex w-full rounded-xl border-gray-300 pl-4 h-10"/>
            </div>
            </div>
            <div className="ml-4">
            <button onClick={handleSubmit} className="flex items-center justify-center bg-custom-pastel-blue hover:bg-indigo-600 rounded-xl text-black font-medium px-4 py-1 flex-shrink-0">
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