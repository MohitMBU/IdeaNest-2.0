import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: "Technology & Software", icon: "💻" },
  { name: "Healthcare & Biotechnology", icon: "🏥" },
  { name: "Aerospace & Defense", icon: "🚀" },
  { name: "Environment & Sustainability", icon: "🌱" },
  { name: "Infrastructure & Smart Cities", icon: "🏗️" },
  { name: "Business & Finance", icon: "💰" },
  { name: "Education & EdTech", icon: "📚" },
  { name: "Media & Entertainment", icon: "🎨" },
  { name: "Food & Agriculture", icon: "🌾" },
  { name: "Automotive & Transportation", icon: "🚘" },
  { name: "Retail & E-Commerce", icon: "🛍️" },
];

const CreateIdea = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    problemStatement: "",
    description: "",
    category: "",
    technology: "",
    referenceLinks: "",
    media: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setFormData((prev) => ({ ...prev, category: categoryName })); // Sync with formData
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, media: Array.from(e.target.files) }); // Convert FileList to Array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // **Validation Check**
    if (
      !formData.title ||
      !formData.problemStatement ||
      !formData.description ||
      !formData.category || // Now properly set
      formData.media.length === 0
    ) {
      alert("All fields are required. Please fill out everything.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("problemStatement", formData.problemStatement);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("technology", formData.technology);
    data.append("referenceLinks", formData.referenceLinks);
    // ✅ Use Clerk user ID dynamically
  if (user) {
    data.append("userObject", user.id);
  } else {
    alert("User not authenticated. Please log in.");
    return;
  }

    formData.media.forEach((file) => data.append("media", file));

    try {
      const response = await fetch("http://localhost:3000/api/ideas", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (result.success) {
        alert("Idea submitted successfully!");
        navigate('/ideas');
      } else {
        alert(`Error: ${result.message}`);
        console.error("Error details:", result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error! Check console for details.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-xl"
    >
      <h2 className="text-2xl font-bold mb-4">Submit Your Idea</h2>

      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Title"
        onChange={handleChange}
        required
        className="block w-full mb-3 p-3 border rounded-lg"
      />

      {/* Problem Statement */}
      <textarea
        name="description"
        placeholder="Describe your idea.."
        onChange={handleChange}
        required
        className="block w-full mb-3 p-3 border rounded-lg"
      ></textarea>

      {/* Description */}
      <textarea
        name="problemStatement"
        placeholder="Problem Statement (What issue does it solve?)"
        onChange={handleChange}
        required
        className="block w-full mb-3 p-3 border rounded-lg"
      ></textarea>

      {/* Category Selection */}
      <h3 className="text-lg font-semibold mb-2">Select a Category:</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {categories.map((category) => (
          <button
            type="button"
            key={category.name}
            onClick={() => handleCategorySelect(category.name)}
            className={`p-4 rounded-lg border transition w-full ${
              formData.category === category.name
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="text-2xl">{category.icon}</span>
            <p className="mt-2 font-semibold">{category.name}</p>
          </button>
        ))}
      </div>

      {/* Tech Stacks */}
      <input
        type="text"
        name="technology"
        placeholder="Technology (comma-separated)"
        onChange={handleChange}
        className="block w-full mb-3 p-3 border rounded-lg"
      />

            {/* Reference links */}
            <input
        type="text"
        name="referenceLinks"
        placeholder="Any reference links.."
        onChange={handleChange}
        className="block w-full mb-3 p-3 border rounded-lg"
      />

      {/* File Upload */}
      <input
        type="file"
        name="media"
        multiple
        onChange={handleFileChange}
        className="block w-full mb-3 p-3 border rounded-lg"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold"
      >
        Submit Idea
      </button>
    </form>
  );
};

export default CreateIdea;
