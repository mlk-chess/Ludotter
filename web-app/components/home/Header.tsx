export default function Header() {

    return (
        <section className="bg-custom-light-orange">
            <div className="container mx-auto py-12 h-3/4">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="text-center mb-12 md:text-left md:w-2/3 md:pr-10">
                        <h1 className="mb-8 font-semibold md:text-3xl xl:text-5xl"><span
                            className="leading-[140%]"><span
                            className="bg-custom-pastel-purple rounded-2xl px-3 py-1 leading-[100%] inline-block">Louer</span>, <span
                            className="bg-custom-pastel-blue rounded-2xl px-3 py-1 leading-[100%] inline-block">acheter</span>, <span
                            className="bg-custom-pastel-orange rounded-2xl px-3 py-1 leading-[100%] inline-block">rejoigner</span> <br/> des parties de jeux de société  !</span>
                        </h1>
                        <button
                            className="text-white bg-custom-orange hover:bg-custom-hover-orange focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">S'inscrire
                        </button>
                    </div>
                    <div className="hidden md:block md:w-1/3">
                        <img src="./crown.png" alt=""/>
                    </div>
                </div>
            </div>
        </section>
    )
}