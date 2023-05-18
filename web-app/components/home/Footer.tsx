import Image from 'next/image';

export default function Footer() {

    return (

        <footer className="bg-custom-dark">
            <div className="w-full mx-auto py-4 px-6 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex justify-center w-full sm:w-fit sm:block">
                        <a href="#" className="mb-4 sm:mb-0 w-fit">
                            <Image src="/otter.png" alt="logo" className="w-20 h-20 hover:duration-1000 hover:rotate-[360deg]" width="100" height="100" />
                        </a>
                    </div>
                    <ul className="flex justify-center flex-wrap items-center mb-6 text-sm font-medium text-gray-200 sm:mb-0">
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
                <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-gray-500 text-center">© 2023 <a href="#" className="hover:underline">LudOtter™</a>. Tous Droits Réservés.</span>
            </div>
        </footer>
    )
}
