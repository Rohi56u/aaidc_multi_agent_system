import axios from "axios";

/**
 * Fetch repository README content from GitHub
 */
export async function fetchRepositoryReadme(
  owner: string,
  repo: string
): Promise<string> {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.v3.raw",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.warn(`Could not fetch README for ${owner}/${repo}:`, error);
    return "README not found";
  }
}

/**
 * Fetch repository structure and metadata
 */
export async function fetchRepositoryStructure(
  owner: string,
  repo: string
): Promise<string> {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`
    );

    const data = response.data;
    const structure = `
Repository: ${data.name}
Description: ${data.description || "No description"}
URL: ${data.html_url}
Language: ${data.language || "Not specified"}
Stars: ${data.stargazers_count}
Forks: ${data.forks_count}
Open Issues: ${data.open_issues_count}
Topics: ${(data.topics || []).join(", ") || "None"}
License: ${data.license?.name || "No license"}
Created: ${data.created_at}
Updated: ${data.updated_at}
`;

    return structure;
  } catch (error) {
    console.warn(
      `Could not fetch repository structure for ${owner}/${repo}:`,
      error
    );
    return "Repository structure not found";
  }
}

/**
 * Parse GitHub URL to extract owner and repo
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    // Handle various GitHub URL formats
    const patterns = [
      /github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/,
      /github\.com\/([^/]+)\/([^/]+?)\/$/,
      /github\.com\/([^/]+)\/([^/]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2],
        };
      }
    }
  } catch (error) {
    console.error("Error parsing GitHub URL:", error);
  }

  return null;
}

/**
 * Fetch top files from repository to understand code structure
 */
export async function fetchRepositoryFiles(
  owner: string,
  repo: string
): Promise<string> {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const files = response.data
      .filter((item: any) => item.type === "file")
      .slice(0, 20)
      .map((item: any) => `${item.name} (${item.size} bytes)`)
      .join("\n");

    return `Root directory files:\n${files}`;
  } catch (error) {
    console.warn(`Could not fetch repository files for ${owner}/${repo}:`, error);
    return "Could not fetch repository files";
  }
}

/**
 * Perform web search for similar projects (mock implementation)
 */
export async function searchSimilarProjects(
  query: string
): Promise<string> {
  try {
    // This is a mock implementation - in production, you'd use a real search API
    const searchQuery = encodeURIComponent(query);
    console.log(`[Web Search] Searching for: ${query}`);

    // Return mock results
    return `Search results for "${query}":
1. Similar project addressing ${query}
2. Framework/library for ${query}
3. Best practices guide for ${query}

Note: This is a demonstration. In production, integrate with Google Custom Search API or similar.`;
  } catch (error) {
    console.error("Web search error:", error);
    return "Web search unavailable";
  }
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string): string[] {
  // Simple keyword extraction - in production, use NLP library
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
  ]);

  const keywords = words
    .filter((word) => word.length > 3 && !stopWords.has(word))
    .slice(0, 20);

  const uniqueKeywords = Array.from(new Set(keywords));
  return uniqueKeywords;
}
