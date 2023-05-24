import React, {useState} from "react";

interface DisplayImagesProps {
    images: string[];
}

export default function DisplayImages(props: DisplayImagesProps) {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [imageModal, setImageModal] = useState<string>('');
    const handleShowModal = (image: string) => {
        setShowModal(true);
        setImageModal(image);
    }

    const handleOutModal = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            setShowModal(false);
        }
    };

    return (
        <>
            <div className="md:col-span-5">
                <div className="grid grid-cols-12 md:grid-rows-2 gap-1 md:h-full md:max-h-[545px]">
                    {props.images.length === 1 &&
                        <div className="col-span-12 row-span-2">
                            <img
                                className="h-[180px] md:h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                src={props.images[0]} alt="" onClick={() => handleShowModal(props.images[0])}/>
                        </div>
                    }

                    {props.images.length === 2 &&
                        <>
                            <div className="col-span-6 row-span-2">
                                <img
                                    className="h-[180px] md:h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                    src={props.images[0]} alt="" onClick={() => handleShowModal(props.images[0])}/>
                            </div>
                            <div className="col-span-6 row-span-2">
                                <img
                                    className="h-[180px] md:h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                    src={props.images[1]} alt="" onClick={() => handleShowModal(props.images[1])}/>
                            </div>
                        </>
                    }

                    {props.images.length === 3 &&
                        <>
                            <div className="col-span-6 row-span-2">
                                <img
                                    className="h-[180px] md:h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                    src={props.images[0]} alt="" onClick={() => handleShowModal(props.images[0])}/>
                            </div>
                            <div className="col-span-6 row-span-1">
                                <img
                                    className="h-[180px] md:h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                    src={props.images[1]} alt="" onClick={() => handleShowModal(props.images[1])}/>
                            </div>
                            <div className="col-span-12 md:col-span-6 row-span-1">
                                <img
                                    className="h-[180px] md:h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                    src={props.images[2]} alt="" onClick={() => handleShowModal(props.images[2])}/>
                            </div>
                        </>
                    }

                    {props.images.length === 4 &&
                        <>
                            <div className="col-span-6">
                                <img
                                    className="h-[180px] md:h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                    src={props.images[0]} alt="" onClick={() => handleShowModal(props.images[0])}/>
                            </div>
                            <div className="col-span-6">
                                <img
                                    className="h-[180px] md:h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                    src={props.images[1]} alt="" onClick={() => handleShowModal(props.images[1])}/>
                            </div>
                            <div className="col-span-6">
                                <img
                                    className="h-[180px] md:h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                    src={props.images[2]} alt="" onClick={() => handleShowModal(props.images[2])}/>
                            </div>
                            <div className="col-span-6">
                                <img
                                    className="h-[180px] md:h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                    src={props.images[3]} alt="" onClick={() => handleShowModal(props.images[3])}/>
                            </div>
                        </>
                    }

                    <div
                        className={`${showModal ? 'block' : 'hidden'} fixed top-0 left-0 z-80 w-screen h-screen bg-black/70 flex justify-center items-center`} onClick={handleOutModal}>
                        <div className="fixed z-90 top-6 right-8 text-white text-5xl font-bold hover:cursor-pointer"
                             onClick={() => setShowModal(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </div>
                        <img src={imageModal} className="max-full max-h-[600px] object-cover" alt=""/>
                    </div>
                </div>
            </div>
        </>
    )
}