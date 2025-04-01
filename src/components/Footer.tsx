
import Image from "next/image";
export default function Footer() {

    return (
        <>
            
            <div id="footer" className="flex flex-row justify-evenly w-[100vw] p-5">

                <a href="https://www.linkedin.com/in/derrick-maurais-a37b3224a" target="_blank">
                    <Image
                        className="drop-shadow-2xl"
                        alt="linkedin icon"
                        height={50}
                        width={50}
                        src="/image/2644994_linkedin_media_social_icon.png" />
                </a>
                <a href="https://bsky.app/profile/dmauronionnet.bsky.social" target="_blank">
                    <Image
                        className="drop-shadow-xl mt-1"
                        alt="Twitter icon"
                        height={40}
                        width={40}
                        src="/image/Bluesky-Logo--Streamline-Flex.png" />


                </a>
                <a href="https://github.com/Dmaur" target="_blank">
                    <Image
                        className="drop-shadow-2xl"
                        alt="github icon"
                        height={50}
                        width={50}
                        src="/image/8666148_github_square_icon.png" />
                </a>
               

                



            </div>
          

        </>
    );

}

