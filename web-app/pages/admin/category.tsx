import Head from 'next/head'
import AdminLayout from "@/components/layouts/Admin";
import Modal from "@/components/Modal";
import 'flowbite';
import { useCallback, useEffect, useState } from 'react';

interface Category {
    id: number;
    name: string;
    createdAt: string;
}

export default function Category() {

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("")
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [categorySelected, setCategorySelected] = useState<Category | undefined>(undefined);

    useEffect( () => {
    
         fetch(`http://localhost:3001/category`,{
            method:'GET',
        })
        .then(response => response.json())
        .then( (data) => {
            setCategories(data)
            
        }).catch( (error) =>{
            console.log(error);
            
        });
        
    },[]);

    const save = useCallback( async (e:any) => {

        e.preventDefault();

        await fetch(`http://localhost:3001/category/save`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name:name})
        })
        .then(response => response.json())
        .then( (data) => {
            
            if (data.statusCode === 201){
                setSuccess("Created.")
                setError("")
            }else{
                setError(data.response.message)
                setSuccess("")
            }

            setShowModal(false);
         
        }).catch( (error) =>{
            console.log(error);  
        });
                

    },[name])

    const update = useCallback( async (e: any ) => {

        e.preventDefault();

        await fetch(`http://localhost:3001/category/${categorySelected?.id}`,{
            method:'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: categorySelected?.name})
        })
        .then(response => response.json())
        .then( (data) => {
            
            if (data.statusCode === 200){
                setSuccess("Updated.")
                setError("")
            }else{
                setError(data.response.message)
                setSuccess("")
            }
            setShowUpdateModal(false);
         
        }).catch( (error) =>{
            console.log(error);  
        });
                

    },[categorySelected])

    const openUpdateModal = useCallback( async (category:Category) => {
        setShowUpdateModal(true);
        setCategorySelected(category);
        setName(category.name)
    },[])

    return (
        <>
             <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <AdminLayout>
                <div className="p-4 sm:ml-64">
                    <div className="p-4 mt-14">

                        {showModal ? (
                            <>
                            <Modal setShowModal={setShowModal} title="Créer une catégorie">
                                <form onSubmit={save}>
                                    <div className="mb-4">
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
                                            <input onChange={ (e) => setName(e.target.value)} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary-500" placeholder="Nom" required />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end pt-5 border-t border-solid border-slate-200 rounded-b">
                                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Enregistrer</button>
                                    </div>
                                </form>
                            </Modal>
                            </>
                        ) : null}


                        {showUpdateModal ? (
                            <>
                            <Modal setShowModal={setShowUpdateModal} title="Modification">
                                <form onSubmit={update}>
                                    <div className="mb-4">
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
                                            <input value={categorySelected?.name} onChange={ (e) => setCategorySelected((prevCategory:Category | undefined) => ({...prevCategory!,name: e.target.value})) } type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary-500" placeholder="Nom" required />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end pt-5 border-t border-solid border-slate-200 rounded-b">
                                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Enregistrer</button>
                                    </div>
                                </form>
                            </Modal>
                            </>
                        ) : null}

                    {
                        success !== "" ? 
                            <div id="toast-success" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow" role="alert">
                                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                    <span className="sr-only">Check icon</span>
                                </div>
                                <div className="ml-3 text-sm font-normal">{success}</div>
                                <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8" data-dismiss-target="#toast-success" aria-label="Close">
                                    <span className="sr-only">Close</span>
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                </button>
                            </div>
                        : ""
                    }   

                    {
                        error !== "" ? 
                        <div id="toast-danger" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span className="sr-only">Error icon</span>
                            </div>
                            <div className="ml-3 text-sm font-normal">{error}</div>
                            <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
                                <span className="sr-only">Close</span>
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                        </div>
                    
                        : ""
                    }   
                        <div className="flex justify-end">
                            <button  onClick={() => setShowModal(true)} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Créer une catégorie</button>
                        </div>

                        <div className="relative overflow-x-auto mt-5">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr className="border-b">
                                        <th scope="col" className="px-6 py-4">
                                            Nom
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>

                                { 
                                    categories.map( (category:Category,index) => {
                                        return (

                                            <tr key={index} className={index % 2 == 0 ? ' bg-white' : ' bg-gray-50'}>
                                                <td scope="row" className="px-6 py-3 text-gray-900">
                                                   {category.name}
                                                </td>
                                            
                                                <td className="px-6 py-3">

                                                    <svg onClick={ () => openUpdateModal(category)}  className="w-6 h-6 stroke-blue-500 cursor-pointer" fill="none" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    )
}


