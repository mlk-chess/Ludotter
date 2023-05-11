import { Carousel } from "flowbite-react";

export default function Slider() {

    return (
        <section>
            <div>

            
            <div>
                <h3 className="mb-8 font-medium md:text-4xl">Evenement à venir</h3>
            </div>
            <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
                <Carousel>
                    <img
                    src="./flyer.png"
                    alt="..."
                    />
                    <img
                    src="./flyer.png"
                    alt="..."
                    />
                    <img
                    src="./flyer.png"
                    alt="..."
                    />
                </Carousel>
            </div>
            </div>
        </section>
    )
}