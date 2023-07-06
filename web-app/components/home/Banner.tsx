import Link from "next/link";

export default function Banner() {

    return (
        <section>
            <div className="container mx-auto">
                <div className="mx-auto relative w-5/6 md:max-w-xl lg:max-w-3xl xl:max-w-5xl my-36 flex items-center flex-col md:block">
                    <img className="md:absolute md:top-0 md:right-0 md:transform md:translate-x-1/2 md:-translate-y-1/2"
                         src="./home/rocket.svg" width={175} alt=""/>
                    <div className="flex items-center flex-col md:block w-full bg-custom-dark rounded-lg p-6 md:p-12">
                        <p className="mb-4 text-base sm:text-lg md:text-xl lg:text-2xl text-white max-w-3xl">Inscrivez-vous maintenant et rejoignez
                            notre communauté de passionnés de jeux de société !</p>
                        <Link href="/register"
                            className="text-white bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-sm md:text-base px-5 py-2.5 text-center">S'inscrire
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}