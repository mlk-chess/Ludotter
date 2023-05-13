export default function About() {

    return (
        <section>
            <div className="container mx-auto py-24">
                <div className="flex flex-col lg:flex-row">
                    <div className="text-center mb-12 lg:text-left lg:w-1/3 lg:pr-10">
                        <h3 className="mb-8 font-semibold text-2xl md:text-4xl">Avec LudOtter, <br/> vender, louer et gagner des cadeaux !</h3>
                    </div>
                    <div className="flex justify-center lg:justify-normal flex-col md:flex-row lg:w-2/3">
                        <div className="bg-white py-10 mx-auto w-5/12 md:w-1/3 max-w-xs h-fit rounded-3xl shadow-lg border-t-[3px] border-l-[3px] border-r-[6px] border-b-[6px] border-custom-pastel-orange hover:-translate-y-6 duration-300">
                            <img className="mx-auto w-32 md:w-28 xl:w-40" src="./home/euro.svg" alt=""/>
                                <div className="mt-14">
                                    <p className="text-center font-semibold text-2xl">Vender</p>
                                </div>
                        </div>
                        <div className="bg-white mx-auto my-10 py-10 w-5/12 md:w-1/3 md:mx-12 md:mt-40 max-w-xs h-fit rounded-3xl shadow-lg border-t-[3px] border-l-[3px] border-r-[6px] border-b-[6px] border-custom-pastel-purple hover:-translate-y-6 duration-300">
                            <img className="mx-auto mx-auto w-32 md:w-28 xl:w-40" src="./home/fire.svg" alt=""/>
                                <div className="mt-14">
                                    <p className="text-center font-semibold text-2xl">Gagner</p>
                                </div>
                        </div>
                        <div className="bg-white mx-auto py-10 w-5/12 md:w-1/3 max-w-xs h-fit rounded-3xl shadow-lg border-t-[3px] border-l-[3px] border-r-[6px] border-b-[6px] border-custom-pastel-blue hover:-translate-y-6 duration-300">
                            <img className="mx-auto mx-auto w-32 md:w-28 xl:w-40" src="./home/megaphone.svg" alt=""/>
                                <div className="mt-14">
                                    <p className="text-center font-semibold text-2xl">Louer</p>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}