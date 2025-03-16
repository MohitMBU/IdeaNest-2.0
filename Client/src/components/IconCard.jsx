import React from "react";

function IconCard({ icon, name, techStack, highlight }) {
  return (
    <div
      className={`min-w-[220px] p-6 rounded-lg shadow-md transition-colors 
        ${highlight ? "bg-violet-50" : "bg-white"}`}
    >
      <div className="text-4xl mb-4 text-center">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800 text-center">
        {name}
      </h3>
      <p className="text-gray-600 text-center">{techStack}</p>
    </div>
  );
}

export default IconCard;
