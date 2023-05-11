import { Carousel } from "flowbite-react";

export default function Slider() {

    return (
        <section>
            <div className="pb-8 h-[950px]">
                <div className="flex md:justify-start justify-center pl-10">
                    <img src="./target.png"alt="..."/>
                    <h3 className="self-center pl-4 font-medium md:text-4xl">Événement à venir</h3>
                </div>
                <div className="flex justify-center md:justify-end md:p-5">
                    <button type="button"
                            className="justify-end text-white border-2 border-custom-orange bg-custom-orange hover:bg-custom-hover-orange focus:outline-none font-medium rounded-lg text-sm md:text-base py-2 px-4 md:px-4 md:py-2 text-center ">Voir tous nos événements
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