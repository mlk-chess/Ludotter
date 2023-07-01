import React, {useEffect, useState} from "react";
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import Datepicker from "react-tailwindcss-datepicker";
import {Tooltip} from 'flowbite-react';
import {useRouter} from "next/router";
import {useSupabaseClient} from "@supabase/auth-helpers-react";

interface Error {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
    date: string;
}

interface DisabledDates {
    startDate: Date;
    endDate: Date;
}

interface Props {
    id: string;
    checkout: boolean;
    setCheckout: (value: boolean) => void;
    price: number;
}

export default function CheckoutLocation(props: Props) {
    const [state, setState] = useState({
        number: '',
        expiry: '01/12',
        cvc: '',
        name: '',
        focus: undefined,
    });
    const [isCheckout, setIsCheckout] = useState<boolean>(false);
    const [errorsCheckout, setErrorsCheckout] = useState<Error>({} as Error);
    const [errors, setErrors] = useState<string>('');
    const [disabledDates, setDisabledDates] = useState<DisabledDates[]>([]);
    const [days, setDays] = useState<number>(1);
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });
    const router = useRouter();
    const supabase = useSupabaseClient();

    const handleValueChange = (newValue: any) => {
        const differenceInTime = (new Date(newValue.endDate)).getTime() - (new Date(newValue.startDate)).getTime();

        const differenceInDay = (differenceInTime / (1000 * 3600 * 24)) + 1;
        if (differenceInDay < 1) {
            setDays(1);
        } else {
            setDays(differenceInDay);
        }

        setValue(newValue);
    }


    const handleInputChange = (evt: any) => {
        const {name, value} = evt.target;
        let newValue = value;

        switch (name) {
            case 'number':
                newValue = newValue.replace(/[^0-9]/g, '');

                if (newValue.length > 16) {
                    newValue = newValue.slice(0, 16);
                }

                setState((prev) => ({...prev, [name]: newValue}));
                break;
            case 'name':
                newValue = newValue.replace(/[^a-zA-Z\s]/g, '');

                setState((prev) => ({...prev, [name]: newValue}));
                break;
            case 'month':
                const year = state.expiry.split('/')[1];
                setState((prev) => ({...prev, ['expiry']: value + '/' + year}));
                break;
            case 'year':
                const month = state.expiry.split('/')[0];
                setState((prev) => ({...prev, ['expiry']: month + '/' + value}));
                break;
            case 'cvc':
                newValue = newValue.replace(/[^0-9]/g, '');

                if (newValue.length > 3) {
                    newValue = newValue.slice(0, 3);
                }

                setState((prev) => ({...prev, [name]: newValue}));
                break;
        }
    }

    const handleInputFocus = (evt: any) => {
        setState((prev) => ({...prev, focus: evt.target.name}));
    }

    const checkoutAnnouncement = async () => {
        setIsCheckout(true);
        let error = false;
        setErrorsCheckout({} as Error);
        setErrors('');

        if (state.number.length < 16) {
            setErrorsCheckout((prevState) => ({
                ...prevState,
                number: "Le numéro de la carte est invalide"
            }));
            error = true;
        }

        if (state.name.length < 3) {
            setErrorsCheckout((prevState) => ({
                ...prevState,
                name: "Le nom du titulaire doit contenir au moins 3 caractères"
            }));
            error = true;
        }

        if (state.expiry.length < 5) {
            setErrorsCheckout((prevState) => ({
                ...prevState,
                expiry: "La date d'expiration est invalide"
            }));
            error = true;
        }

        if (state.cvc.length < 3) {
            setErrorsCheckout((prevState) => ({
                ...prevState,
                cvc: "Le code de sécurité est invalide"
            }));
            error = true;
        }

        if (value.startDate === null || value.endDate === null) {
            setErrorsCheckout((prevState) => ({
                ...prevState,
                date: "Veuillez sélectionner une date de début et de fin"
            }));
            error = true;
        }

        if (!error) {
            const {data: {session}} = await supabase.auth.getSession();

            fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/announcement/checkout/location`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.access_token
                },
                body: JSON.stringify({
                    id: props.id,
                    number: state.number,
                    expiry: state.expiry,
                    cvc: state.cvc,
                    name: state.name,
                    startDate: value.startDate,
                    endDate: value.endDate
                })
            })
                .then(response => {
                    const statusCode = response.status;
                    if (statusCode === 404) {
                        router.push('/admin/announcement');
                    }

                    if (statusCode === 201) {
                        router.push(`/me/ordering`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.status === 400 || data.status === 500) {
                        setErrors(data.response.message[0]);
                    }
                    if (data.status === 404) {
                        router.push('/announcement');
                    }
                    setIsCheckout(false);
                }).catch((error) => {
                console.log(error);
                setIsCheckout(false);
            });
        } else {
            setIsCheckout(false);
        }
    }

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/announcement/checkout/date`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then((data) => {
                setDisabledDates(data);
            }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <>
            <div
                className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-full md:w-2/4 lg:w-4/12 dark:bg-gray-800 ${props.checkout ? '' : 'translate-x-full'}`}>
                <button type="button" onClick={() => props.setCheckout(false)}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"></path>
                    </svg>
                    <span className="sr-only">Close menu</span>
                </button>

                <div className="mt-10">
                    <Cards
                        number={state.number}
                        expiry={state.expiry}
                        cvc={state.cvc}
                        name={state.name}
                        focused={state.focus}
                        locale={{valid: 'valide jusqu\'au'}}
                        placeholders={{name: 'Nom du titulaire'}}
                    />
                </div>

                <div className="mt-6 flex flex-col items-center">
                    <p className="text-center text-2xl font-semibold">{((props.price * days) + (5 * (props.price * days) / 100)).toFixed(2)} €</p>

                    <div className="">
                        <Tooltip content={`${props.price} € / jour + 5% frais de service`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
                            </svg>
                        </Tooltip>
                    </div>
                </div>

                <div>
                    <div className="my-6">
                        <label htmlFor=""
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sélectionnez les
                            dates</label>
                        <Datepicker
                            i18n={"fr"}
                            startWeekOn="mon"
                            minDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
                            value={value}
                            startFrom={new Date()}
                            onChange={handleValueChange}
                            primaryColor={"purple"}
                            disabledDates={disabledDates}
                        />
                        <p className="text-red-600 text-sm">{errorsCheckout.date}</p>
                    </div>

                    <hr className="h-px my-8 bg-gray-200 border-0"/>

                    <div className="my-6">
                        <label htmlFor="number"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Numéro de
                            carte</label>
                        <input type="text" name="number"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="1111 2222 3333 4444"
                               value={state.number}
                               onChange={handleInputChange}
                               onFocus={handleInputFocus}
                               required/>
                        <p className="text-red-600 text-sm">{errorsCheckout.number}</p>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="name"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom
                            du titulaire</label>
                        <input type="text" name="name"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="Nom"
                               value={state.name}
                               onChange={handleInputChange}
                               onFocus={handleInputFocus}
                               required/>
                        <p className="text-red-600 text-sm">{errorsCheckout.name}</p>
                    </div>

                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="month"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mois</label>
                            <select name="month"
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    defaultValue="month"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option disabled value="month">Mois</option>
                                <option value="01">01</option>
                                <option value="02">02</option>
                                <option value="03">03</option>
                                <option value="04">04</option>
                                <option value="05">05</option>
                                <option value="06">06</option>
                                <option value="07">07</option>
                                <option value="08">08</option>
                                <option value="09">09</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                            </select>
                            <p className="text-red-600 text-sm">{errorsCheckout.expiry}</p>
                        </div>

                        <div>
                            <label htmlFor="year"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Year</label>
                            <select name="year"
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    defaultValue="year"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option disabled value="year">Année</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                                <option value="2028">2028</option>
                                <option value="2029">2029</option>
                                <option value="2030">2030</option>
                                <option value="2031">2031</option>
                                <option value="2032">2032</option>
                                <option value="2033">2033</option>
                                <option value="2034">2034</option>
                                <option value="2035">2035</option>
                                <option value="2036">2036</option>
                                <option value="2037">2037</option>
                            </select>
                        </div>
                        <div className="grid md:grid-cols-2">
                            <div>
                                <label htmlFor="cvc"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CVC</label>
                                <input type="text" name="cvc"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="123"
                                       value={state.cvc}
                                       onChange={handleInputChange}
                                       onFocus={handleInputFocus}
                                       required/>
                                <p className="text-red-600 text-sm">{errorsCheckout.cvc}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {isCheckout ?
                    <div className="flex justify-center">
                        <svg aria-hidden="true"
                             className="mt-4 inline w-8 h-8 text-gray-200 animate-spin fill-gray-600"
                             viewBox="0 0 100 101" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"/>
                        </svg>
                    </div>
                    :
                    <>
                        <div className="flex justify-center">
                            <button
                                className="flex text-white border-2 border-custom-orange bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-base px-4 py-2 text-center"
                                onClick={checkoutAnnouncement}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>
                                </svg>
                                <span className="ml-4">Louer</span>
                            </button>
                        </div>
                        <p className="text-red-600 text-center mt-2">{errors}</p>
                    </>
                }
            </div>

            {props.checkout &&
                    <div className="absolute w-full h-screen bg-gray-600 top-0 left-0 opacity-40">
                </div>
            }
        </>
    )
}