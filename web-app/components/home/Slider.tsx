import {Carousel} from "flowbite-react";

export default function Slider() {

    return (
        <section>
            <div className="container mx-auto pb-8">
                <div className="flex justify-between flex-col md:flex-row items-center">
                    <div className="gap-5 flex items-center flex-row md:justify-start justify-center mb-10 md:mb-0">
                        <img className="sm:w-20" src="./target.png" alt="..."/>
                        <h3 className="ml-4 font-medium text-2xl md:text-4xl">Événement à venir</h3>
                    </div>

                    <div className="h-fit">
                        <button type="button"
                                className="text-white border-2 border-custom-orange bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-sm md:text-base py-2 px-4 text-center m-0">Voir
                            tous nos événements
                        </button>
                    </div>
                </div>
            </div>

            <div className="h-56 sm:h-64 xl:h-[665px] 2xl:h-[750px]">
                <Carousel>
                    <img src="./flyer.png" alt="..."/>
                    <img src="./flyer.png" alt="..."/>
                    <img src="./flyer.png" alt="..."/>
                </Carousel>
            </div>

        </section>
    )
}