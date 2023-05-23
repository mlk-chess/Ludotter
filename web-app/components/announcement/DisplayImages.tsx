import React from "react";

interface DisplayImagesProps {
    images: string[];
}

export default function DisplayImages(props: DisplayImagesProps) {

    return (
        <>
            <div className="col-span-5">
                <div className="grid grid-cols-12 grid-rows-2 gap-1 h-full max-h-[545px]">
                    {props.images.length === 1 &&
                        <div className="col-span-12 row-span-2">
                            <img className="h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                 src={props.images[0]} alt=""/>
                        </div>
                    }

                    {props.images.length === 2 &&
                        <>
                            <div className="col-span-6 row-span-2">
                                <img className="h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                     src={props.images[0]} alt=""/>
                            </div>
                            <div className="col-span-6 row-span-2">
                                <img className="h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                src={props.images[1]} alt=""/>
                            </div>
                        </>
                    }

                    {props.images.length === 3 &&
                        <>
                            <div className="col-span-6 row-span-2">
                                <img className="h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                     src={props.images[0]} alt=""/>
                            </div>
                            <div className="col-span-6 row-span-1">
                                <img className="h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                     src={props.images[1]} alt=""/>
                            </div>
                            <div className="col-span-6 row-span-1">
                                <img className="h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                     src={props.images[2]} alt=""/>
                            </div>
                        </>
                    }

                    {props.images.length === 4 &&
                        <>
                            <div className="col-span-6 row-span-1">
                                <img className="h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                     src={props.images[0]} alt=""/>
                            </div>
                            <div className="col-span-6 row-span-1">
                                <img className="h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                     src={props.images[1]} alt=""/>
                            </div>
                            <div className="col-span-6 row-span-1">
                                <img className="h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                     src={props.images[2]} alt=""/>
                            </div>
                            <div className="col-span-6 row-span-1">
                                <img className="h-full w-full rounded-lg object-cover hover:blur-sm hover:cursor-pointer duration-200"
                                     src={props.images[3]} alt=""/>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    )
}