import Head from 'next/head'
import dynamic from 'next/dynamic'
import {  useEffect } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/Admin';
import Checkout from '@/components/announcement/Checkout';
import { set } from 'lodash';

export default function Admin() {

    interface PaymentData {
        date: string;
        count: number;
    }

    interface Series{
        name: string;
        data: number[];
    }

    // useeffect with fetch data route payementByDate 
    // const [paymentData, setPaymentData] = useState([]);
    const [options, setOptions] = useState({});
    const [series, setSeries] = useState<Series[]>([]);

    
    useEffect( () => {
    document.body.classList.add("bg-custom-light-blue");
    },[]);

    useEffect(() => {
         fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/announcement/paymentByDate`, {
                method: 'GET',
            })
                .then(response => {
                    const statusCode = response.status;
                    return response.json();
                })
                .then((data) => {
                    setOptions({
                        chart: {
                            id: "basic-bar"
                        },
                        xaxis: {
                            categories: data.map( (data: PaymentData) => data.date),
                        }
                    });

                    setSeries([
                         {
                        name: 'Nombre de paiements',
                        data: data.map( (data: PaymentData) => data.count),
                        }
                    ]);
                    
                }).catch((error) => {
                console.log(error);
            });
    }, []);

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
                    <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                       
                        <div
                            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex-shrink-0">
                                    <h3 className="text-base font-light text-gray-500 dark:text-gray-400">Nombre de paiement par date</h3>
                                </div>
                               
                            </div>
                            {(typeof window !== 'undefined') &&

                                <Chart
                                options={options}
                                series={series}
                                type="bar"
                                width="500"
                            />
                            }
                            {/* Card Footer */}
                            <div
                                className="flex items-center justify-between pt-3 mt-4 border-t border-gray-200 sm:pt-6 dark:border-gray-700">
                                <div>
                                    <button
                                        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 rounded-lg hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                        type="button" data-dropdown-toggle="weekly-sales-dropdown">Last 7 days <svg
                                        className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M19 9l-7 7-7-7"/>
                                    </svg></button>
                                    {/* Dropdown menu */}
                                    <div
                                        className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                                        id="weekly-sales-dropdown">
                                        <div className="px-4 py-3" role="none">
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white"
                                               role="none">
                                                Sep 16, 2021 - Sep 22, 2021
                                            </p>
                                        </div>
                                        <ul className="py-1" role="none">
                                            <li>
                                                <a href="#"
                                                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                                   role="menuitem">Yesterday</a>
                                            </li>
                                            <li>
                                                <a href="#"
                                                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                                   role="menuitem">Today</a>
                                            </li>
                                            <li>
                                                <a href="#"
                                                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                                   role="menuitem">Last 7 days</a>
                                            </li>
                                            <li>
                                                <a href="#"
                                                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                                   role="menuitem">Last 30 days</a>
                                            </li>
                                            <li>
                                                <a href="#"
                                                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                                   role="menuitem">Last 90 days</a>
                                            </li>
                                        </ul>
                                        <div className="py-1" role="none">
                                            <a href="#"
                                               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                               role="menuitem">Custom...</a>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    )
}


