import Landing from "@/components/Landing";
import { getProjects } from "@/tools/datamanager";
import { Project } from "@/tools/data.model";


export default async function Home() {

  const projects: Project[] = await getProjects();
  
  return (
    <>
      lets see if i made the proper changes to jenkins
      <Landing projects={projects}/>
      

       
    </>
  );
}
