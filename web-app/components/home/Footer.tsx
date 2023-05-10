export default function Footer() {

    return (

        <footer className="bg-custom-dark">
            <div className="container w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="#" className="flex items-center mb-4 sm:mb-0">
                        <img src="./otter.png" alt="logo" className="w-20 h-20 hover:duration-1000 hover:rotate-[360deg]"/>
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-400 sm:mb-0">
                        <li>
                            <a href="#" className="mr-4 hover:underline md:mr-6 ">À propos</a>
                        </li>
                        <li>
                            <a href="#" className="mr-4 hover:underline md:mr-6">Mentions légales</a>
                        </li>
                        <li>
                            <a href="#" className="mr-4 hover:underline md:mr-6 ">Conditions d'utilisations</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">Contact</a>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-400 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center">© 2023 <a href="#" className="hover:underline">LudOtter™</a>. Tous Droits Réservés.</span>
            </div>
        </footer>
    )
}
