import React from "react";
import ProjectCard from "./ProjectCard";
import useUserContext from "../contexts/UserContext";
import EditableProjectCard from "./EditableProjectCard";

function Project() {
  const { users, updateUser } = useUserContext();
  const works = [
    {
      id: 1,
      imgSrc: "/images/project-1.jpg",
      title: "Full stack music app",
      tags: ["API", "MVC", "Development"],
      projectLink: "https://musify-5al0.onrender.com/",
    },
    // {
    //   id: 2,
    //   imgSrc: '/images/project-2.jpg',
    //   title: 'Free stock photo app',
    //   tags: ['API', 'SPA'],
    //   projectLink: 'https://pixstock-official.vercel.app/'
    // },
    // {
    //     id: 3,
    //   imgSrc: '/images/project-3.jpg',
    //   title: 'Recipe app',
    //   tags: ['Development', 'API'],
    //   projectLink: ''
    // },
    // {
    //     id: 4,
    //   imgSrc: '/images/project-4.jpg',
    //   title: 'Real state website',
    //   tags: ['Web-design', 'Development'],
    //   projectLink: 'https://github.com/codewithsadee-org/wealthome'
    // },
    // {
    //     id: 5,
    //   imgSrc: '/images/project-5.jpg',
    //   title: 'eCommerce website',
    //   tags: ['eCommerce', 'Development'],
    //   projectLink: 'https://github.com/codewithsadee/anon-ecommerce-website'
    // },
    // {
    //     id: 6,
    //   imgSrc: '/images/project-6.jpg',
    //   title: 'vCard Personal portfolio',
    //   tags: ['Web-design', 'Development'],
    //   projectLink: 'https://github.com/codewithsadee/vcard-personal-portfolio'
    // },
  ];
  return (
    <section id="work" className="section">
      <div className="container">
        <div>
          <h2 className="headline headline-2">My portfolio highlights</h2>

          {users.isAppEditable && (
            <div className="grid gap-x-4 gap-y-5 grid-cols-1 max-w-[352px] justify-self-center mt-8 mb-4">
              <EditableProjectCard />
            </div>
            // <ProjectCard
            //   imgSrc="/images/check_4824138.png"
            //   title="Hello World"
            //   projectLink="https://github.com/codewithsadee/vcard-personal-portfolio"
            //   tags={["Web-design", "Development"]}
            // />
          )}

          <div className="grid gap-x-4 gap-y-5 grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] mt-8">
            {users.projects &&
              users.projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  imgSrc={project.imgUrl}
                  title={project.title}
                  tags={project.keywords}
                  // id={id}
                  projectLink={project.url}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Project;
