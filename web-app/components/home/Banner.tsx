export default function Banner() {

    return (
        <section>
            <div className="container mx-auto relative pr-12 pb-8 w-10/12">
                <img className="rocket absolute top-0 right-0" src="./home/rocket.svg" width={175} alt=""/>
                    <div className="w-full bg-custom-dark rounded-lg py-12 px-12">
                        <p className="mb-4 md:text-2xl text-white">Inscrivez-vous maintenant et rejoignez notre communauté de passionnés de jeux de société !</p>
                        <button
                            className="text-white bg-custom-orange hover:bg-custom-hover-orange focus:ring-4 focus:outline-none font-medium rounded-lg text-base px-5 py-2.5 text-center">S'inscrire
                        </button>
                    </div>
            </div>           
        </section>
    )
}