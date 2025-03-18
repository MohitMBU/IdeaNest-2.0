import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProjectDetails = ({ projectId: propProjectId }) => {
  const { id: routeId } = useParams();
  const projectId = propProjectId || routeId;
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [githubRepoData, setGithubRepoData] = useState(null);
  const [contributors, setContributors] = useState([]);

  const parseGithubUrl = (url) => {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/;
    const match = url.match(regex);
    if (match && match.length >= 3) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
    }
    return null;
  };

  useEffect(() => {
    if (!projectId) {
      console.error("No project id provided");
      setLoading(false);
      return;
    }
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/projects/${projectId}`
        );
        const data = await response.json();
        if (data.success && data.project) {
          setProject(data.project);
        } else {
          console.error("Project not found or error occurred", data.message);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
      setLoading(false);
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const fetchGithubData = async () => {
      if (
        project &&
        project.referenceLinks &&
        project.referenceLinks.length > 0
      ) {
        const githubUrl = project.referenceLinks.find((link) =>
          link.includes("github.com")
        );
        if (githubUrl) {
          const parsed = parseGithubUrl(githubUrl);
          if (parsed) {
            const { owner, repo } = parsed;
            try {
              const repoResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}`
              );
              const repoData = await repoResponse.json();
              setGithubRepoData(repoData);

              const contributorsResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contributors`
              );
              const contributorsData = await contributorsResponse.json();
              setContributors(
                Array.isArray(contributorsData) ? contributorsData : []
              );
            } catch (error) {
              console.error("Error fetching GitHub data:", error);
            }
          }
        }
      }
    };
    fetchGithubData();
  }, [project]);

  const getFileType = (fileUrl) => {
    if (!fileUrl) return "unknown";
    if (fileUrl.match(/\.(jpg|jpeg|png)$/)) return "image";
    if (fileUrl.match(/\.(mp4|webm|mov)$/)) return "video";
    if (fileUrl.match(/\.pdf$/)) return "pdf";
    return "unknown";
  };

  const nextMedia = () => {
    setMediaIndex((prev) => (prev + 1) % project.media.length);
  };

  const prevMedia = () => {
    setMediaIndex(
      (prev) => (prev - 1 + project.media.length) % project.media.length
    );
  };

  const currentMedia = project?.media?.[mediaIndex] || "";

  if (loading) return <p className="text-center">Loading project...</p>;

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-500 mb-4">Project not found.</p>
        <Button onClick={() => navigate("/projects")}>
          ← Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between">
        <Button onClick={() => navigate("/projects")} className="mb-4">
          ← Back to Projects
        </Button>
      </div>

      <h2 className="text-3xl font-bold">{project.title}</h2>
      <p className="text-gray-600 mt-2">{project.description}</p>

      {/* Media Display */}
      {project.media?.length > 0 && (
        <div className="relative w-full h-72 mt-4 bg-gray-200 flex items-center justify-center">
          {getFileType(currentMedia) === "image" && (
            <img
              src={currentMedia}
              alt="Project Media"
              className="w-full h-72 object-cover"
            />
          )}
          {getFileType(currentMedia) === "video" && (
            <video controls className="w-full h-72 object-cover">
              <source src={currentMedia} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {getFileType(currentMedia) === "pdf" && (
            <a
              href={currentMedia}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 font-bold underline"
            >
              View PDF
            </a>
          )}

          {/* Navigation Arrows */}
          {project.media.length > 1 && (
            <>
              <button
                className="absolute left-2 bg-gray-800 text-white p-2 rounded-full"
                onClick={prevMedia}
              >
                ◀
              </button>
              <button
                className="absolute right-2 bg-gray-800 text-white p-2 rounded-full"
                onClick={nextMedia}
              >
                ▶
              </button>
            </>
          )}
        </div>
      )}

      {/* Project Details Section */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800">Project Details</h3>
        <p className="text-gray-600 mt-2">
          <b>ID:</b> {project._id}
        </p>
        <p className="text-gray-600 mt-2">
          <b>Title:</b> {project.title}
        </p>
        <p className="text-gray-600 mt-2">
          <b>Description:</b> {project.description}
        </p>
        <p className="text-gray-600 mt-2">
          <b>Category:</b> {project.category || "N/A"}
        </p>
        <p className="text-gray-600 mt-2">
          <b>Tech Stacks:</b>{" "}
          {Array.isArray(project.techStacks)
            ? project.techStacks.join(", ")
            : project.techStacks}
        </p>
        <p className="text-gray-600 mt-2">
          <b>Feasibility Score:</b> {project.feasibilityScore}
        </p>
        <p className="text-gray-600 mt-2">
          <b>Approved:</b> {project.approved ? "Yes" : "No"}
        </p>
        <p className="text-gray-600 mt-2">
          <b>Star Count:</b> {project.starCount}
        </p>
        <p className="text-gray-600 mt-2">
          <b>Technology:</b>{" "}
          {Array.isArray(project.technology)
            ? project.technology.join(", ")
            : project.technology}
        </p>
        <p className="text-gray-600 mt-2">
          <b>Reference Links:</b>{" "}
          {Array.isArray(project.referenceLinks) &&
          project.referenceLinks.length > 0
            ? project.referenceLinks.join(", ")
            : "None"}
        </p>
        <p className="text-gray-600 mt-2">
          <b>Created At:</b> {new Date(project.createdAt).toLocaleString()}
        </p>
        <p className="text-gray-600 mt-2">
          <b>Updated At:</b> {new Date(project.updatedAt).toLocaleString()}
        </p>
        <p className="text-gray-600 mt-2">
          <b>User Object:</b> {project.userObject}
        </p>
      </div>

      {/* GitHub Repository Details */}
      {githubRepoData && (
        <div className="p-5 mt-6 bg-gray-50 border border-gray-200 rounded">
          <h3 className="text-xl font-semibold text-gray-800">
            GitHub Repository Details
          </h3>
          <p className="text-gray-600 mt-2">
            <b>Repository:</b>{" "}
            <a
              href={githubRepoData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {githubRepoData.full_name}
            </a>
          </p>
          <p className="text-gray-600 mt-2">
            <b>Description:</b> {githubRepoData.description}
          </p>
          <p className="text-gray-600 mt-2">
            <b>Stars:</b> {githubRepoData.stargazers_count}
          </p>
          <p className="text-gray-600 mt-2">
            <b>Forks:</b> {githubRepoData.forks_count}
          </p>
          <p className="text-gray-600 mt-2">
            <b>Open Issues:</b> {githubRepoData.open_issues_count}
          </p>
          <p className="text-gray-600 mt-2">
            <b>Total Contributors:</b> {contributors.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
