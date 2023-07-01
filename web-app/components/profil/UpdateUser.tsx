import React, {useEffect,useState} from "react";
import 'flowbite';

export default function UpdateUserProfil() {

    return (
                <div className="grid mt-10 place-items-center">
                    <div className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-7">
                        <div className="flex font-medium text-2xl mb-8">
                            <h1>Informations personnelles</h1>
                        </div>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstname"
                                           className="block mb-2 text-sm font-medium text-gray-900">Prénom</label>
                                    <input type="text" name="firstname" id="firstname"
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple block w-full p-2.5"
                                           placeholder="Jehane"/>
                                </div>
                                <div>
                                    <label htmlFor="name"
                                           className="block mb-2 text-sm font-medium text-gray-900">Nom</label>
                                    <input type="name" name="name" id="name"
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple block w-full p-2.5"
                                           placeholder="Benadjemia"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstname"
                                           className="block mb-2 text-sm font-medium text-gray-900">Pseudo</label>
                                    <input type="text" name="pseudo" id="pseudo"
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple block w-full p-2.5"
                                           placeholder="jehanebnj"/>
                                </div>
                                <div>
                                    <label htmlFor="date"
                                           className="block mb-2 text-sm font-medium text-gray-900">Date de naissance</label>
                                    <input type="date" name="date" id="date"
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple block w-full p-2.5"
                                           />
                                </div>
                            </div>
                          
                            <div>
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input type="email" name="email" id="email"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple block w-full p-2.5"
                                       placeholder="jehanebnj@gmail.com"/>
                            </div>
                            <button type="submit"
                                    className="text-white bg-custom-orange hover:bg-custom-hover-orange focus:ring-4 focus:outline-none font-medium rounded-lg text-sm md:text-base px-5 py-2.5 text-center">Enregistrer
                            </button>
                        </form>
                       
                    </div>
                </div>
    )
}
