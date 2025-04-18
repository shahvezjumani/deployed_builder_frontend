import React from "react";
import useUserContext from "../contexts/UserContext";

function ProjectCard({ imgSrc, title, tags, id, classes, projectLink }) {
  const { users, updateUser } = useUserContext();
  return (
    <div
      className={
        classes +
        " relative p-4 rounded-2xl bg-skin-secondaryBackgroundColor hover:bg-skin-skillHover active:bg-skin-skillBackgroundColor transition-colors ring-1 ring-inset ring-skin-default"
      }
    >
      <figure className="img-box aspect-square rounded-lg mb-4">
        <img src={imgSrc} alt={title} loading="lazy" className="img-cover" />
      </figure>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="title-1 mb-3">{title}</h3>
          <div className="flex gap-2 flex-wrap items-center">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="h-8 text-sm text-skin-secondary bg-skin-backgroundColor grid items-center px-3 rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="w-11 h-11 grid place-content-center bg-skin-imgBoxBgColor rounded-lg shrink-0">
          <span className="material-symbols-rounded" aria-hidden="true">
            arrow_outward_
          </span>
        </div>
      </div>

      {users.isAppEditable ? (
        <div>
          <button
            className="btn-primary btn [&]:max-w-full w-full flex items-center justify-center mt-3"
            onClick={() =>
              updateUser(
                "projects",
                users.projects.filter((project) => project.url !== projectLink)
              )
            }
          >
            Delete
          </button>
        </div>
      ) : (
        <a href={projectLink} target="_blank" className="absolute inset-0"></a>
      )}
    </div>
  );
}

export default ProjectCard;
