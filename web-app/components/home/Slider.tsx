import { Carousel } from "flowbite-react";

export default function Slider() {

    return (
        <section>
            <div className="pb-8">
                <div className="container mx-auto gap-5 flex items-center md:flex-row flex-col md:justify-start justify-center">
                    <img className="sm:w-20" src="./target.png"alt="..."/>
                    <h3 className="ml-4 font-medium md:text-4xl">Événement à venir</h3>
                </div>
                <div className="container mx-auto flex justify-center sm:mt-5 md:justify-end">
                    <button type="button"
                            className="justify-end text-white border-2 border-custom-orange bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-sm md:text-base py-2 px-4 md:px-4 md:py-2 mb-10 text-center ">Voir tous nos événements
                    </button>
                </div>
               
                <div className="h-56 sm:h-64 xl:h-[665px] 2xl:h-[750px]">
                    <Carousel>
                        <img src="./flyer.png"alt="..."/>
                        <img src="./flyer.png"alt="..."/>
                        <img src="./flyer.png"alt="..."/>
                    </Carousel>
                </div>
            </div>
        </section>
    )
}