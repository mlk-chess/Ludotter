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
                            className="text-custom-dark bg-custom-white border-2 border-custom-orange hover:bg-custom-hover-orange hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0">Se connecter
                    </button>
                    <button type="button"
                            className="text-white bg-custom-orange hover:bg-custom-hover-orange focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 md:mx-2 ">S'inscrire
                    </button>
                    
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
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