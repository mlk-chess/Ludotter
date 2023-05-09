export default function Navbar() {

    return (
        <nav
            className="bg-custom-light-orange w-full z-20 top-0 left-0 border-b border-custom-highlight-orange">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
                <a href="#" className="flex items-center">
                    <img src="./otter.png" alt="logo" className="w-20 h-20 hover:duration-1000 hover:rotate-[360deg]"/>
                </a>
                <div className="flex md:order-2">
                    <button type="button"
                            className="hidden md:block text-custom-dark bg-custom-white border-2 border-custom-orange hover:bg-custom-hover-orange hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0" >Se connecter
                    </button>
                    <button type="button"
                            className="hidden md:block text-white bg-custom-orange hover:bg-custom-hover-orange focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 md:mx-2 ">S'inscrire
                    </button>
                    <button data-collapse-toggle="navbar-sticky" type="button"
                                    className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                    aria-controls="navbar-sticky" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                          clip-rule="evenodd"></path>
                                </svg>
                    </button>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul className="bg-custom-light-orange flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-custom-light-orange">
                        <li>
                            <a href="#"
                                className="text-custom-dark hover:bg-white hover:border-2 hover:border-custom-highlight-orange focus:ring-4 focus:outline-none font-medium rounded-lg text-base px-4 py-3 text-center mr-3 md:mr-0"
                                aria-current="page">Explorez</a>
                        </li>
                        <li>
                            <a href="#"
                                className="text-custom-dark hover:bg-white hover:border-2 hover:border-custom-highlight-orange focus:ring-4 focus:outline-none font-medium rounded-lg text-base px-4 py-3 text-center mr-3 md:mr-0"
                                aria-current="page">Explorez</a>
                        </li>
                        <li>
                            <a href="#"
                                className="text-custom-dark hover:bg-white hover:border-2 hover:border-custom-highlight-orange focus:ring-4 focus:outline-none font-medium rounded-lg text-base px-4 py-3 text-center mr-3 md:mr-0"
                                aria-current="page">Explorez</a>
                        </li>
                        <li>
                            <a href="#"
                                className="text-custom-dark hover:bg-white hover:border-2 hover:border-custom-highlight-orange focus:ring-4 focus:outline-none font-medium rounded-lg text-base px-4 py-3 text-center mr-3 md:mr-0"
                                aria-current="page">Explorez</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    )
}