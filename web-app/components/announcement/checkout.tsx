import React, {useState} from "react";
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

export default function Checkout() {
    const [state, setState] = useState({
        number: '',
        expiry: '01/12',
        cvc: '',
        name: '',
        focus: '',
    });

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

    return (
        <>
            <div className="bg-white rounded p-4">
                <Cards
                    number={state.number}
                    expiry={state.expiry}
                    cvc={state.cvc}
                    name={state.name}
                    focused={state.focus}
                    locale={{valid: 'valide jusqu\'à'}}
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}