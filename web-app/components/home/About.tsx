export default function About() {

    return (
        <section className="bg-custom-light-orange">
            <div className="container mx-auto py-12">
                <div className="flex flex-col md:flex-row">
                    <div className="text-center mb-12 md:text-left md:w-1/3 md:pr-10">
                        <h3 className="mb-8 font-medium md:text-lg xl:text-3xl">Avec LudOtter, vendez, louez et gagnez des cadeaux !</h3>
                    </div>
                    <div className="md:flex md:flex-row md:w-2/3">
                        <div className="bg-white py-10 mx-auto md:w-1/3 max-w-xs h-96 rounded-3xl shadow-lg">
                            <img className="mx-auto" src="./dollar.png" alt=""/>
                                <div className="my-14">
                                    <div className="text-center font-bold text-xl">Vendez</div>
                                </div>
                        </div>
                        <div className="bg-white mx-auto my-10 py-10 md:w-1/3 md:mx-12 md:mt-40 max-w-xs h-96 rounded-3xl shadow-lg">
                            <img className="mx-auto" src="./fire.png" alt=""/>
                                <div className="my-14">
                                    <div className="text-center	font-bold text-xl">Gagnez</div>
                                </div>
                        </div>
                        <div className="bg-white mx-auto py-10 md:w-1/3 max-w-xs h-96 rounded-3xl shadow-lg">
                            <img className="mx-auto" src="./megaphone.png" alt=""/>
                                <div className="my-14">
                                    <div className="text-center	font-bold text-xl">Louez</div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}