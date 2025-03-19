import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Star, GitFork, Eye } from "lucide-react";

const ProjectDetails = ({ projectId: propProjectId }) => {
  const { id: routeId } = useParams();
  const projectId = propProjectId || routeId;
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubRepoData, setGithubRepoData] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [commitCount, setCommitCount] = useState(null);

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
              // Fetch repository data
              const repoResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}`
              );
              const repoData = await repoResponse.json();
              setGithubRepoData(repoData);

              // Fetch contributors
              const contributorsResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contributors`
              );
              const contributorsData = await contributorsResponse.json();
              setContributors(
                Array.isArray(contributorsData) ? contributorsData : []
              );

              // Fetch commit count by requesting 1 commit per page and reading the Link header
              const commitsResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`
              );
              const linkHeader = commitsResponse.headers.get("Link");
              if (linkHeader) {
                const lastPageMatch = linkHeader.match(
                  /page=(\d+)>; rel="last"/
                );
                if (lastPageMatch) {
                  setCommitCount(parseInt(lastPageMatch[1]));
                }
              } else {
                const commitsData = await commitsResponse.json();
                setCommitCount(commitsData.length);
              }
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

  // Process technology field: split by commas if it's a string.
  const technologyItems =
    typeof project?.technology === "string"
      ? project.technology
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : Array.isArray(project?.technology)
      ? project.technology
      : [];

  // Process techStacks field if available.
  const techStacks =
    typeof project?.techStacks === "string"
      ? project.techStacks
      : Array.isArray(project?.techStacks)
      ? project.techStacks.join(", ")
      : "";

  // Use the first media item for the figure.
  const media = project?.media?.[0] || "";

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
    <div className="md:mx-[10%] mx-auto p-6">
      <header className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-6">
          <span className="text-5xl">{project.icon || "📁"}</span>
          <div>
            <span className="text-2xl font-bold">{project.title}</span>
            <p className="text-sm text-gray-500">
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div>
          {project.approved && (
            <div className="flex items-center bg-green-600 text-white px-3 py-2 rounded-full">
              <Check className="w-6 h-6" />
              approved
            </div>
          )}
        </div>
      </header>

      {project.media?.length > 0 && getFileType(media) === "image" && (
        <figure className="relative aspect-video mx-24 my-10 bg-gray-200">
          <img
            src={media}
            alt="Project media"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </figure>
      )}

      <div className="mt-6 flex justify-between">
        {/* Left Section: All Project Details */}
        <div className="space-y-5">
          <h3 className="text-xl font-semibold mb-6 flex-1">Project Details</h3>
          <p className="text-gray-600 mt-2">
            <b>Category:</b> <br /> {project.category || "N/A"}
          </p>
          <p className="text-gray-600 mt-2 ">
            <b>Feasibility Score:</b> <br /> {project.feasibilityScore}
          </p>
          <p className="text-gray-600 mt-2">
            <b>Description:</b> <br /> {project.description}
          </p>
          {technologyItems.length > 0 && (
            <div className="">
              <h3 className="text-lg font-semibold">Tech stacks:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {technologyItems.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-300 rounded-full rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Repository Details */}
        <div className="border border-gray-300 bg-white p-5 pb-8 rounded-2xl md:max-w-[380px] overflow-hidden">
          <h3 className="text-lg font-semibold mb-2">Repository:</h3>
          {Array.isArray(project.referenceLinks) &&
          project.referenceLinks.length > 0 ? (
            <p className="text-blue-500 underline truncate">
              <a
                href={project.referenceLinks.find((link) =>
                  link.includes("github.com")
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.referenceLinks.find((link) =>
                  link.includes("github.com")
                )}
              </a>
            </p>
          ) : (
            <p>No repository link available</p>
          )}
          {githubRepoData && (
            <div className="mt-4 space-y-2.5">
              <p className="text-gray-900 mt-1 flex gap-2">
                <Star /> <p className="font-semibold">Stars:</p>{" "}
                {githubRepoData.stargazers_count}
              </p>
              <p className="text-gray-900 mt-1 flex gap-2">
                <GitFork />
                <p className="font-semibold">Forks:</p>{" "}
                {githubRepoData.forks_count}
              </p>
              <p className="text-gray-900 mt-1 flex gap-2">
                <Eye />
                <p className="font-semibold">Watchers:</p>{" "}
                {githubRepoData.watchers_count}
              </p>
              <p className="text-gray-900 mt-1  flex gap-2">
                <b className="font-semibold">Total Contributors:</b>{" "}
                {contributors.length}
              </p>

              {commitCount !== null && (
                <p className="text-gray-900 mt-1 flex gap-2">
                  <p className="font-semibold">Total Commits:</p> {commitCount}
                </p>
              )}
              <p className="text-gray-900 mt-1 flex gap-2">
                <p className="font-semibold">Repo Created:</p>{" "}
                {new Date(githubRepoData.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
