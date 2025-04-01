"use client"

import Image from "next/image"




interface AboutProps {
    isLarge: boolean;
    setSiteState: (index: number) => void;
}
export default function About({ isLarge, setSiteState }: AboutProps) {


    return (
        <>
            <div className="m-2 p-4 h-[50vh] bg-ash_gray-100 text-ash_gray-800 rounded-md shadow-md shadow-ash_gray-200 overflow-y-auto">

                <div className="relative flex flex-row justify-center items-center">
                  
                    <button
                        onClick={() => setSiteState(0)}
                        className="absolute font-medium top-0 right-0 mr-2 text-s text-white hover:bg-gray-100 hover:text-black hover:text-opacity-100 hover:rounded-full hover:opacity-25 p-3">
                        X
                    </button>
                </div>



                <div className="lg:mt-10 flex flex-col lg:flex-row justify-self-center" >

                    <Image
                        className="p-0 mt-5 shadow-lg shadow-ash_gray-200 flex lg:mr-8 rounded-full self-center"
                        src="/image/betterimage.png"
                        alt="selfImage"
                        height={isLarge ? 250 : 150}
                        width={isLarge ? 250 : 150} />
                     


                    <div className=" mt-3 lg:mt-2 just justify-self-center flex flex-col lg:justify-between max-w-2xl">
                        <h1 className=" mb-4 underline text-center lg:text-start lg:mb-4 text-2xl lg:text-4xl font-bold">Derrick Maurais</h1>
                        <p className={`${isLarge? "ml-4" : "text-left"}`}>Soon to be 2025 NSCC Truro Web Development graduate</p>
                        <br/>
                        <p className={`${isLarge? "ml-8": "text-left"}`}>Interested in Dev-ops and back-end development</p>
                        <br/>
                        <p className={`${isLarge? "ml-4": "text-left"}`}>Eager to embrace new challenges and expand my skill set</p>
                        <br/>
                        <p >Want to know more? Download my resume <a href="/dwnld/DMResume2025.pdf" download={"DMaurais_Resume"} className="underline hover:text-blue-800">here </a>&#128072; </p>

        
                       
                    </div>

                   


                </div>



            </div>
        </>
    )
}