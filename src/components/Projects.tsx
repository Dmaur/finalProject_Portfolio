"use client"

import Image from "next/image";
import { Project, Tech } from "@/tools/data.model";


interface AboutProps {
    isLarge: boolean;
    setSiteState: (index: number) => void;
    projects: Project[]
}
export default function Projects({ isLarge, setSiteState, projects }: AboutProps) {



    return (
        <>
            <div className="m-2 p-4 h-[50vh] bg-space_cadet text-ash_gray-800 rounded-md shadow-md shadow-ash_gray-200 overflow-y-auto">
                <div className="relative flex flex-row justify-center items-center">

                    <button
                        onClick={() => setSiteState(0)}
                        className="absolute font-medium top-0 right-0 mr-2 text-s text-white hover:bg-gray-100 hover:text-black hover:text-opacity-100 hover:rounded-full hover:opacity-25 p-3">
                        X
                    </button>
                </div>


                <h1 className="underline mb-5 mt-10 text-2xl lg:text-4xl font-bold text-center">Projects</h1>


                <section className="m-3">
                    {projects.map((project: Project, n: number) =>

                        <div key={n} className="flex flex-col items-center mb-2 lg:flex-row lg:justify-around lg:items-start lg:text-start">
                            <a href={project.link} target="_blank">
                                <Image
                                    className="mb-4 mx-auto rounded-lg"
                                    height={isLarge ? 200 : 150}
                                    width={isLarge ? 200 : 150}
                                    src={project.imgSrc}
                                    alt={project.projName + " img"}
                                />
                            </a>

                            <div className="w-[55vw] lg:w-[45vw]">
                                <h1 className="text-2xl mb-2">{project.projName}</h1>
                                <ul className="flex flex-wrap-reverse content-center gap-2 mb-2 lg:mb-10">
                                    {project.tech.map((t: Tech, n: number) =>
                                        <li key={n} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md">{t.techName}</li>
                                    )}
                                </ul>

                                <p >{project.description}</p>
                            </div>
                            <div className={`${isLarge ? "hidden" : "border-y-2 border-black w-full h-5 my-4"}`}></div>
                        </div>


                    )}
                  
                </section>





            </div>
        </>
    )
}