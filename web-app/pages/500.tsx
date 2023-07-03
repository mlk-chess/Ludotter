import Link from "next/link";

export default function Custom404() {
    return (
        <>
            <div className="flex flex-col justify-center items-center px-6 mx-auto h-screen xl:px-0 dark:bg-gray-900">
                <div className="block md:max-w-lg">
                    <img src="/500.svg" alt="astronaut image"/>
                </div>
                <div className="text-center xl:max-w-4xl">
                    <h1 className="mb-3 text-2xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">Quelque chose s'est mal passé</h1>
                    <p className="mb-5 text-base font-normal text-gray-500 md:text-lg dark:text-gray-400">Oops! Vous êtes tombé sur une erreur 500.</p>

                    <Link href="/"
                          className="text-white border-2 border-custom-orange bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-base px-4 py-2 text-center mr-0 mx-10 ">
                        Revenir à l'accueil
                    </Link>
                </div>
            </div>
        </>
    )
}