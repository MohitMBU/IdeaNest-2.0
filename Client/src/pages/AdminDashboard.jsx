import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [event, setEvent] = useState({ name: "", date: "", description: "" });

  useEffect(() => {
    fetchUsers();
    fetchIdeas();
    fetchProjects();
  }, []);

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user || user.role !== "admin") {
//       navigate("/");
//     }
//   }, []);

  const fetchUsers = async () => {
    const res = await axios.get("/api/admin/users");
    setUsers(res.data);
  };

  const fetchIdeas = async () => {
    const res = await axios.get("/api/admin/ideas");
    setIdeas(res.data);
  };

  const fetchProjects = async () => {
    const res = await axios.get("/api/admin/projects");
    setProjects(res.data);
  };

  const createEvent = async (e) => {
    e.preventDefault();
    await axios.post("/api/admin/create-event", event);
    alert("Event Created!");
    setEvent({ name: "", date: "", description: "" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
    <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Admin Dashboard</h1>

    {/* Dashboard Summary - Users, Ideas, Projects */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Total Users</h2>
        <p className="text-4xl font-bold">{users.length}</p>
      </div>
      <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Total Ideas</h2>
        <p className="text-4xl font-bold">{ideas.length}</p>
      </div>
      <div className="bg-purple-500 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Total Projects</h2>
        <p className="text-4xl font-bold">{projects.length}</p>
      </div>
    </div>

    {/* Users Section */}
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* {users.map((user) => (
          <div key={user._id} className="p-4 bg-gray-100 rounded-lg shadow">
            <p className="font-bold">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
          </div>
        ))} */}
      </div>
    </div>

    {/* Ideas Section */}
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ideas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* {ideas.map((idea) => (
          <div key={idea._id} className="p-4 bg-gray-100 rounded-lg shadow">
            <p className="font-bold">{idea.title}</p>
          </div>
        ))} */}
      </div>
    </div>

    {/* Projects Section */}
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* {projects.map((project) => (
          <div key={project._id} className="p-4 bg-gray-100 rounded-lg shadow">
            <p className="font-bold">{project.title}</p>
          </div>
        ))} */}
      </div>
    </div>

    {/* Create Event Section */}
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create Event</h2>
      <form onSubmit={createEvent} className="space-y-4">
        <input
          type="text"
          placeholder="Event Name"
          value={event.name}
          onChange={(e) => setEvent({ ...event, name: e.target.value })}
          required
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={event.date}
          onChange={(e) => setEvent({ ...event, date: e.target.value })}
          required
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Event Description"
          value={event.description}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
          required
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg hover:shadow-lg transition duration-300 w-full"
        >
          Create Event
        </button>
      </form>
    </div>
  </div>
  );
}
