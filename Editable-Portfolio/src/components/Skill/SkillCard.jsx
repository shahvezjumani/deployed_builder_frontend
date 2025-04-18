// import React from "react";

// function SkillCard({ imgSrc, label, desc, classes }) {
//   return (
//     <div
//       className={
//         "flex items-center gap-3 ring-inset ring-2 ring-skin-default rounded-2xl p-3 hover:bg-skin-skillHover transition-colors group " +
//         classes
//       }
//     >
//       <figure className="bg-skin-skillBackgroundColor rounded-lg overflow-hidden w-12 h-12 p-2 group-hover:bg-skin-backgroundColor transition-colors">
//         <img src={imgSrc} alt={label} width={32} height={32} />
//       </figure>
//       <div className="">
//         <h3>{label}</h3>
//         <p className="text-skin-secondary">{desc}</p>
//       </div>
//     </div>
//   );
// }

// export default SkillCard;


import React from "react";
import useUserContext from "../contexts/UserContext";

function SkillCard({ imgSrc, label, desc, id, classes }) {

  const {users, updateUser} = useUserContext();

  const handleDelete = (id) => {
    updateUser("skills", users.skills.filter((skill) => skill.id !== id));
  };
  return (
    <div
      className={
        "flex items-center gap-3 ring-inset ring-2 ring-skin-default rounded-2xl p-3 hover:bg-skin-skillHover transition-colors group " +
        classes
      }
    >
      <figure className="bg-skin-skillBackgroundColor rounded-lg overflow-hidden w-12 h-12 p-2 group-hover:bg-skin-backgroundColor transition-colors">
        <img src={imgSrc} alt={label} width={32} height={32} />
      </figure>
      <div className="flex-1">
        <h3>{label}</h3>
        <p className="text-skin-secondary">{desc}</p>
      </div>
      <button
        className={`text-red-500 hover:text-red-700 transition-colors ${users.isAppEditable ? "" : "hidden"}`}
        onClick={() => handleDelete(id)}
      >
        Delete
      </button>
    </div>
  );
}

export default SkillCard;

