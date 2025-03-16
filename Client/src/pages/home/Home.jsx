import React from "react";
import { Link } from "react-router-dom";
import IconCard from "../../components/IconCard.jsx";

export default function Home() {
  const data = {
    projects: [
      {
        id: 1,
        icon: "⚛️",
        name: "React Project",
        techStack: "React, Node.js",
        highlight: false,
      },
      {
        id: 2,
        icon: "💻",
        name: "Fullstack App",
        techStack: "Express, MongoDB",
        highlight: true,
      },
      {
        id: 3,
        icon: "⚡",
        name: "API Service",
        techStack: "Node, GraphQL",
        highlight: false,
      },
      {
        id: 4,
        icon: "🎨",
        name: "UI Prototype",
        techStack: "HTML, CSS",
        highlight: false,
      },
    ],
    ideas: [
      {
        id: 1,
        icon: "💡",
        name: "Vue Idea",
        techStack: "Vue, Vuex, Firebase",
        highlight: false,
      },
      {
        id: 2,
        icon: "🔧",
        name: "Tooling Concept",
        techStack: "Webpack, Babel",
        highlight: false,
      },
      {
        id: 3,
        icon: "🧩",
        name: "Plugin System",
        techStack: "Node.js, TS",
        highlight: true,
      },
    ],
    events: [
      {
        id: 1,
        icon: "⚙️",
        name: "Angular Event",
        techStack: "Angular, NgRx",
        highlight: false,
      },
      {
        id: 2,
        icon: "🎉",
        name: "Hackathon",
        techStack: "React, Next.js",
        highlight: false,
      },
      {
        id: 3,
        icon: "🚀",
        name: "Product Launch",
        techStack: "SaaS, Stripe",
        highlight: true,
      },
    ],
  };

  const Section = ({ title, items }) => (
    <section className="w-full py-12 bg-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          {title}
        </h2>

        <div className="overflow-x-auto">
          <div className="flex flex-nowrap gap-6">
            {items.map((item) => (
              <IconCard
                key={item.id}
                icon={item.icon}
                name={item.name}
                techStack={item.techStack}
                highlight={item.highlight}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="flex gap-4 justify-center p-4 border-b">
        <Link
          to="/saved-projects"
          className="border-2 border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
        >
          Saved Projects
        </Link>
        <Link
          to="/my-projects"
          className="border-2 border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
        >
          My Projects
        </Link>
        <Link
          to="/create-idea"
          className="border-2 border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
        >
          Create Idea
        </Link>
      </div>

      {/* Sections */}
      <Section title="Projects" items={data.projects} />
      <div className="border border-black"></div>
      <Section title="Ideas" items={data.ideas} />
      <div className="border border-black"></div>
      <Section title="Events" items={data.events} />
    </div>
  );
}
