import React from "react";

export default function FormCreate() {

    return (
        <div className="py-8 px-10 mx-auto my-24 max-w-4xl rounded-lg lg:py-16 bg-white">
            <h2 className="mb-8 text-xl font-bold text-gray-900">Ajouter une annonce</h2>
            <form action="#">
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="sm:col-span-2">
                        <label htmlFor="name"
                               className="block mb-2 text-sm font-medium text-gray-900">Nom</label>
                        <input type="text" name="name" id="name"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-pastel-purple focus:border-custom-pastel-purple focus:bg-white block w-full p-2.5"
                               placeholder="Monopoly" required/>
                    </div>
                    <div className="w-full">
                        <label htmlFor="brand"
                               className="block mb-2 text-sm font-medium text-gray-900">Type de l'annonce</label>

                        <div className="flex pt-3">
                            <div className="flex items-between mr-4">
                                <input id="inline-radio" type="radio" value="" name="inline-radio-group"
                                       className="w-4 h-4 text-custom-pastel-purple bg-gray-100 border-gray-300 focus:ring-custom-pastel-purple focus:ring-2"/>
                                <label htmlFor="inline-radio"
                                       className="ml-2 text-sm font-medium text-gray-900">Location</label>
                            </div>
                            <div className="flex items-center mr-4">
                                <input id="inline-2-radio" type="radio" value="" name="inline-radio-group"
                                       className="w-4 h-4 text-custom-pastel-purple bg-gray-100 border-gray-300 focus:ring-custom-pastel-purple focus:ring-2"/>
                                <label htmlFor="inline-2-radio"
                                       className="ml-2 text-sm font-medium text-gray-900">Vente</label>
                            </div>
                        </div>
                    </div>
                    <div className="w-full relative">
                        <label htmlFor="categories"
                               className="block mb-2 text-sm font-medium text-gray-900">Catégories</label>

                        <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown"
                                className="w-full relative bg-gray-50 border border-gray-300 text-gray-900 focus:ring-1 focus:outline-none focus:ring-custom-pastel-purple rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
                                type="button">Sélectionner une ou plusieurs catégories <svg className="absolute right-5 w-4 h-4"
                                                                   aria-hidden="true" fill="none"
                                                                   stroke="currentColor" viewBox="0 0 24 24"
                                                                   xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M19 9l-7 7-7-7"></path>
                        </svg></button>
                        <div id="dropdown"
                             className="z-10 hidden bg-white rounded-lg shadow w-full p-2.5">

                            <div className="flex items-center mb-4">
                                <input id="default-checkbox" type="checkbox" value=""
                                       className="w-4 h-4 text-custom-pastel-purple bg-gray-100 border-gray-300 rounded focus:ring-custom-pastel-purple"/>
                                <label htmlFor="default-checkbox"
                                       className="ml-2 text-sm font-medium text-gray-900">Actions</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input id="default-checkbox" type="checkbox" value=""
                                       className="w-4 h-4 text-custom-pastel-purple bg-gray-100 border-gray-300 rounded focus:ring-custom-pastel-purple"/>
                                <label htmlFor="default-checkbox"
                                       className="ml-2 text-sm font-medium text-gray-900">Famille</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input id="default-checkbox" type="checkbox" value=""
                                       className="w-4 h-4 text-custom-pastel-purple bg-gray-100 border-gray-300 rounded focus:ring-custom-pastel-purple"/>
                                <label htmlFor="default-checkbox"
                                       className="ml-2 text-sm font-medium text-gray-900">Expert</label>
                            </div>
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="description"
                               className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                        <textarea id="description" rows="8"
                                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-custom-pastel-purple focus:border-custom-pastel-purple"
                                  placeholder="Description de l'annonce"></textarea>
                    </div>
                </div>
                <button type="submit"
                        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-custom-orange rounded-lg hover:bg-custom-hover-orange">
                    Ajouter
                </button>
            </form>
        </div>
    )
}
