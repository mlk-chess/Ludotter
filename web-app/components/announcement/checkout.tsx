import React, {useState} from "react";
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

interface Error {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
}

export default function Checkout(props: {id: string}) {
    const [state, setState] = useState({
        number: '',
        expiry: '01/12',
        cvc: '',
        name: '',
        focus: '',
    });
    const [isCheckout, setIsCheckout] = useState<boolean>(false);
    const [errorsCheckout, setErrorsCheckout] = useState<Error>({} as Error);
    const [errors, setErrors] = useState<string>('');

    const handleInputChange = (evt) => {
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

    const handleInputFocus = (evt) => {
        setState((prev) => ({...prev, focus: evt.target.name}));
    }

    const checkoutAnnouncement = () => {
        setIsCheckout(true);
        let error = false;
        setErrorsCheckout({} as Error);

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

        if (!error) {
            fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/announcement/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: props.id,
                })
            })
                .then(response => response.json())
                .then((data) => {
                    console.log(data);
                    setIsCheckout(false);
                }).catch((error) => {
                console.log(error);
                setIsCheckout(false);
            });
        }else{
            setIsCheckout(false);
        }
    }

    return (
        <>
            <div className="bg-white rounded p-4">
                <Cards
                    number={state.number}
                    expiry={state.expiry}
                    cvc={state.cvc}
                    name={state.name}
                    focused={state.focus}
                    locale={{valid: 'valide jusqu\'au'}}
                    placeholders={{name: 'Nom du titulaire'}}
                />
                <div>
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
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom
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
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="23">23</option>
                                <option value="24">24</option>
                                <option value="25">25</option>
                                <option value="26">26</option>
                                <option value="27">27</option>
                                <option value="28">28</option>
                                <option value="29">29</option>
                                <option value="30">30</option>
                                <option value="31">31</option>
                                <option value="32">32</option>
                                <option value="33">33</option>
                                <option value="34">34</option>
                                <option value="35">35</option>
                                <option value="36">36</option>
                                <option value="37">37</option>
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

                {/*{errorsCheckout &&*/}
                {/*    <p className="text-red-600">Erreur</p>*/}
                {/*}*/}

                {isCheckout ?
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
                    :
                    <div className="flex justify-center">
                        <button
                            className="text-white border-2 border-custom-orange bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-base px-4 py-2 text-center"
                            onClick={checkoutAnnouncement}>Acheter
                        </button>
                    </div>
                }
            </div>
        </>
    )
}