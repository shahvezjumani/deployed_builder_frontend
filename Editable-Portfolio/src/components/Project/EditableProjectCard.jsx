import React, { useEffect, useState } from "react";
import useUserContext from "../contexts/UserContext";
import { useRef } from "react";
import axios from "axios";

function EditableProjectCard({ projectToUpdate }) {
  const { users, updateUser } = useUserContext();
  const [project, setProject] = useState({
    imgUrl: "/images/check_4824138.png",
    title: "Your Project Title",
    keywords: [],
    url: "",
    imgUrlFile: "",
  });
  const [keyword, setKeyword] = useState();

  const name = useRef();

  useEffect(() => {
    if (projectToUpdate) {
      setProject({ ...projectToUpdate, edit: true });
    }
  }, [projectToUpdate]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleUpdate(e.target.result);
      };
      reader.readAsDataURL(file);
      setProject((prev) => ({ ...prev, imgUrlFile: file }));
    }
  };

  const handleImageDoubleClick = (keyName) => {
    name.current = keyName;
    console.log(name.current);

    document.getElementById("ProjectFileInput").click();
  };

  const handleUpdate = (value) => {
    setProject((prev) => ({ ...prev, [name.current]: value }));
  };

  const handleSave = async () => {
    const { imgUrl, ...remainingProject } = project;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/project/create-project`,
        remainingProject,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProject((prev) => ({
        ...prev,
        imgUrl: "/images/check_4824138.png",
        title: "Your Project Title",
        keywords: [],
        url: "",
        imgUrlFile: "",
      }));
      setKeyword("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProject = async () => {
    const { imgUrl, ...remainingProject } = project;
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/project/update-project/${
          project.id
        }`,
        remainingProject,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProject((prev) => ({
        ...prev,
        imgUrl: "/images/check_4824138.png",
        title: "Your Project Title",
        keywords: [],
        url: "",
        imgUrlFile: "",
        edit: false,
      }));
      setKeyword("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={
        " relative p-4 rounded-2xl bg-skin-secondaryBackgroundColor hover:bg-skin-skillHover active:bg-skin-skillBackgroundColor transition-colors ring-1 ring-inset ring-skin-default"
      }
    >
      <input
        id="ProjectFileInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <figure className="img-box aspect-square rounded-lg mb-4">
        <img
          src={project.imgUrl}
          name="imgUrl"
          alt={"h"}
          loading="lazy"
          className="img-cover"
          onDoubleClick={
            users.isAppEditable
              ? (e) => handleImageDoubleClick(e.target.name)
              : undefined
          }
        />
      </figure>
      <div className="flex items-center justify-between gap-4">
        <div>
          {/* <h3 className="title-1 mb-3">{users.projects[0].title}</h3> */}
          <h3>
            <input
              name="availabilityHeading"
              type="text"
              // className="text-[32px] text-black outline-none"
              value={project.title}
              //   readOnly={!users.isAppEditable}
              className="bg-transparent border-none outline-none p-0 mb-3 text-lg font-inherit max-w-inherit"
              onChange={(e) =>
                setProject((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </h3>
        </div>

        {/* <div className="w-11 h-11 grid place-content-center bg-skin-imgBoxBgColor rounded-lg shrink-0">
          <span className="material-symbols-rounded" aria-hidden="true">
            arrow_outward_
          </span>
        </div> */}
      </div>
      {/* <div>

      </div> */}

      {/* <a href={""} target='_blank' className='absolute inset-0'></a> */}
      <div className="mt-4">
        <label htmlFor="keywords" className="label">
          Enter Your Project Keywords
        </label>
        <div className="flex items-center justify-between">
          <div className={`${users.isAppEditable ? "" : "hidden"}`}>
            <input
              type="text"
              id="keywords"
              className="text-field"
              placeholder="Web"
              value={keyword}
              // disabled={!users.isAppEditable}
              onChange={(e) => setKeyword(e.target.value.toUpperCase())}
            />
          </div>
          <button
            className="btn btn-primary [&]:max-w-[25%] w-[25%] "
            onClick={() =>
              setProject((prev) => ({
                ...prev,
                keywords: prev.keywords.includes(keyword)
                  ? prev.keywords
                  : [...prev.keywords, keyword],
              }))
            }
          >
            Add
          </button>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap items-center mt-4">
        {project.keywords.map((tag, index) => (
          <span
            key={index}
            className="h-8 text-sm text-skin-secondary bg-skin-backgroundColor grid items-center px-3 rounded-lg"
            onClick={() =>
              setProject((prev) => ({
                ...prev,
                keywords: prev.keywords
                  ? prev.keywords.filter((t) => t !== tag)
                  : [],
              }))
            }
          >
            {tag}
          </span>
        ))}
      </div>
      <div className={`mb-4 mt-4 ${users.isAppEditable ? "" : "hidden"}`}>
        <label htmlFor="url" className="label">
          Enter Your Project Link
        </label>
        <input
          type="text"
          id="url"
          autoComplete="url"
          className="text-field"
          value={project.url}
          placeholder="https://github.com/shahvezjumani/Library-Project"
          // disabled={!users.isAppEditable}
          onChange={(e) =>
            setProject((prev) => ({ ...prev, url: e.target.value }))
          }
        />
      </div>
      <div className="flex gap-2 items-center justify-between">
        <button
          className="btn btn-primary [&]:max-w-full w-full flex items-center justify-center"
          onClick={() => {
            users.projects.find((f) => f.title === project.title)
              ? updateUser("projects", [...users.projects])
              : updateUser("projects", [...users.projects, { ...project }]);
            if (project?.edit) {
              handleUpdateProject();
            } else {
              handleSave();
            }
          }}
        >
          {project?.edit ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default EditableProjectCard;
