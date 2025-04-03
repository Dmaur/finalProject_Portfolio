import Landing from "@/components/Landing";
import { getProjects } from "@/tools/datamanager";
import { Project } from "@/tools/data.model";


export default async function Home() {

  const projects: Project[] = await getProjects();
  
  return (
    <>
    im slowly going crazy, slowlt slowly

      <Landing projects={projects}/>
      

       
    </>
  );
}

