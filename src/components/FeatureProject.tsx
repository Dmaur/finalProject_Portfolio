
import Image from "next/image";


export default function Feature() {

    return (
        <>
           <div className="m-2 p-4 w-[60vw] h-[50vh] mx-5 text-ash_gray-800 justify-self-center overflow-y-auto">
                <h1 className="underline mb-5 justify-self-center text-4xl font-bold">What I&apos;m Working on Now</h1>
                <div className="">
                        <p className="mb-4">
                        Currently, this portfolio website is my most original piece of work, as I have built it from the ground up using Next.js, Tailwind CSS, and MongoDB.
                        </p>
                        <p className="mb-4">
                        As part of my final semester studies, I had to choose a topic to learn independently. I decided to explore DevOps, focusing on key concepts such as Docker
                         and containerization, CI/CD pipelines, Linux administration, and virtualization. To build my knowledge, I am utilizing resources like LinkedIn Learning, 
                         YouTube, and various online materials.
                        </p>
                        <p className="mb-4">
                        I plan to apply what I learn directly to my portfolio by implementing admin functionality for managing portfolio assets, integrating website monitoring tools
                        and configuring CI/CD pipelines for automated deployment.
                        </p>
                        <p className="mb-4">
                        I will be continuously updating my portfolio as I implement these changes, so be sure to check back regularly to see new features in action!
                        </p>
                </div>


            </div>
        </>

    );

}