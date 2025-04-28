import React, { useEffect } from "react";
import SkillCard from "./SkillCard";

import { useState } from "react";
import useUserContext from "../contexts/UserContext";

function Skill() {
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input
  const [skillItem, setSkillItem] = useState([]);

  const { users, updateUser } = useUserContext();
  useEffect(() => {
    fetch("/skills_100.json")
      .then((res) => res.json())
      .then((data) => {
        setSkillItem(data);
        console.log(skillItem);
      });
  }, []);
  // const skillItem = [
  //   {
  //     id: 1,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
  //     label: "Figma",
  //     desc: "Design tool",
  //   },
  //   {
  //     id: 2,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
  //     label: "CSS",
  //     desc: "User Interface",
  //   },
  //   {
  //     id: 3,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
  //     label: "JavaScript",
  //     desc: "Interaction",
  //   },
  //   {
  //     id: 4,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
  //     label: "NodeJS",
  //     desc: "Web Server",
  //   },
  //   {
  //     id: 5,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png",
  //     label: "ExpressJS",
  //     desc: "Node Framework",
  //   },
  //   {
  //     id: 6,
  //     imgSrc: "https://upload.wikimedia.org/wikipedia/en/4/45/MongoDB-Logo.svg",
  //     label: "MongoDB",
  //     desc: "Database",
  //   },
  //   {
  //     id: 7,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  //     label: "React",
  //     desc: "Framework",
  //   },
  //   {
  //     id: 8,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
  //     label: "TailwindCSS",
  //     desc: "User Interface",
  //   },
  //   {
  //     id: 9,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/3/3f/Git_icon.svg",
  //     label: "Git",
  //     desc: "Version Control",
  //   },
  //   {
  //     id: 10,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
  //     label: "GitHub",
  //     desc: "Code Hosting",
  //   },
  //   {
  //     id: 11,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg",
  //     label: "Docker",
  //     desc: "Containerization",
  //   },
  //   {
  //     id: 12,
  //     imgSrc: "https://upload.wikimedia.org/wikipedia/commons/4/49/Redux.png",
  //     label: "Redux",
  //     desc: "State Management",
  //   },
  //   {
  //     id: 13,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
  //     label: "Python",
  //     desc: "Programming Language",
  //   },
  //   {
  //     id: 14,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
  //     label: "TypeScript",
  //     desc: "Typed JavaScript",
  //   },
  //   {
  //     id: 15,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg",
  //     label: "Angular",
  //     desc: "Frontend Framework",
  //   },
  //   {
  //     id: 16,
  //     imgSrc: "https://upload.wikimedia.org/wikipedia/commons/9/91/Webpack.svg",
  //     label: "Webpack",
  //     desc: "Module Bundler",
  //   },
  //   {
  //     id: 17,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/0/0e/SQL_Database_Logo.svg",
  //     label: "MySQL",
  //     desc: "Relational Database",
  //   },
  //   {
  //     id: 18,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg",
  //     label: "Bootstrap",
  //     desc: "CSS Framework",
  //   },
  //   {
  //     id: 19,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/f/fd/Jest_logo.svg",
  //     label: "Jest",
  //     desc: "Testing Framework",
  //   },
  //   {
  //     id: 20,
  //     imgSrc:
  //       "https://upload.wikimedia.org/wikipedia/commons/1/17/GraphQL_Logo.svg",
  //     label: "GraphQL",
  //     desc: "API Query Language",
  //   },
  // ];

  const filteredSkills = skillItem.filter((skill) =>
    skill.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSkillClick = (skill) => {
    if (!users.skills.find((s) => s.id === skill.id)) {
      updateUser("skills", [...users.skills, { ...skill }]);
    }
  };
  return (
    <section className="section" id="skills">
      <div className="container">
        <h2 className="headline-2 headline">Essential Tools I use</h2>
        <p className="text-skin-textColor mt-4 mb-8 max-w-[50ch] text-justify">
          Discover the powerful tools and technologies I use to create
          exceptional, high-performing websites & applications.
        </p>
        <div className={`${users.isAppEditable ? "" : "hidden"}`}>
          <h1 className="headline-2a headline">Search and Add Skills</h1>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search for a skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded-md bg-transparent ring-1 ring-inset ring-skin-navbarRing shadow-sm focus:outline-none mt-4 focus:ring-skin-btnRing focus:ring text-skin-secondary"
            />
          </div>
          {searchTerm && filteredSkills.length > 0 && (
            <ul className="mb-6 rounded-xl p-4 bg-skin-secondaryBackgroundColor shadow-sm">
              {filteredSkills.map((skill) => (
                <li
                  key={skill.id}
                  className="cursor-pointer p-2 hover:bg-skin-backgroundColor hover:rounded-xl flex justify-between items-center transition-colors"
                  onClick={() => handleSkillClick(skill)}
                >
                  <span>{skill.label}</span>
                  <span className="text-sm text-skin-secondary">
                    {skill.desc}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {searchTerm && filteredSkills.length === 0 && (
            <p className="text-center text-gskin-base mb-4">No skills found.</p>
          )}
        </div>
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]">
          {users.skills.map(({ imgSrc, label, desc, id }) => (
            <SkillCard
              key={id}
              imgSrc={imgSrc}
              label={label}
              desc={desc}
              id={id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skill;
