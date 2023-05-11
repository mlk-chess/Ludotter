import { Carousel } from "flowbite-react";

export default function Slider() {

    return (
        <section>
            <div className="pb-8 h-[900px]">
                <div className="flex flex-row py-8 pl-10">
                    <img className="h-20" src="./target.png"alt="..."/>
                    <h3 className="self-center pl-4 font-medium md:text-4xl">Événement à venir</h3>
                </div>
                <div className="flex justify-end pb-6 pr-8">
                    <button type="button"
                            className="justify-end text-white border-2 border-custom-orange bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-sm md:text-base py-2 px-4 md:px-4 md:py-2 text-center mr-3 md:mr-0 md:mx-2 ">Voir tous nos événements
                    </button>
                </div>
               
                <div className="h-56 sm:h-64 xl:h-[550px] 2xl:h-[750px]">
                    <Carousel className="">
                        <img src="./flyer.png"alt="..."/>
                        <img src="./flyer.png"alt="..."/>
                        <img src="./flyer.png"alt="..."/>
                    </Carousel>
                </div>
            </div>
        </section>
    )
}