import { invokeLLM } from "../_core/llm";
import {
  fetchRepositoryReadme,
  fetchRepositoryStructure,
  fetchRepositoryFiles,
  parseGitHubUrl,
} from "./tools";

export interface AnalysisResult {
  repoAnalysis: string;
  titleSuggestion: string;
  summaryImprovement: string;
  suggestedTags: string[];
  suggestedCategories: string[];
  missingSections: string[];
  visualEnhancements: string[];
  overallScore: number;
}

/**
 * Execute the multi-agent analysis workflow
 */
export async function executeMultiAgentAnalysis(
  repositoryUrl: string,
  onProgress?: (agent: string, status: string) => void
): Promise<AnalysisResult> {
  // Parse GitHub URL
  const parsed = parseGitHubUrl(repositoryUrl);
  if (!parsed) {
    throw new Error("Invalid GitHub repository URL");
  }

  const { owner, repo } = parsed;

  // Step 1: Fetch repository data
  onProgress?.("fetcher", "Fetching repository data...");
  const readme = await fetchRepositoryReadme(owner, repo);
  const structure = await fetchRepositoryStructure(owner, repo);
  const files = await fetchRepositoryFiles(owner, repo);

  // Step 2: Repo Analyzer Agent
  onProgress?.("analyzer", "Analyzing repository structure...");
  const repoAnalysis = await repoAnalyzerAgent(
    repo,
    owner,
    readme,
    structure,
    files
  );

  // Step 3: Content Improver Agent
  onProgress?.("improver", "Suggesting content improvements...");
  const contentImprovements = await contentImproverAgent(
    repo,
    repoAnalysis
  );

  // Step 4: Metadata Recommender Agent
  onProgress?.("recommender", "Recommending metadata...");
  const metadata = await metadataRecommenderAgent(
    repo,
    repoAnalysis,
    contentImprovements.titleSuggestion
  );

  return {
    repoAnalysis,
    titleSuggestion: contentImprovements.titleSuggestion,
    summaryImprovement: contentImprovements.summaryImprovement,
    suggestedTags: metadata.tags,
    suggestedCategories: metadata.categories,
    missingSections: contentImprovements.documentationImprovements,
    visualEnhancements: metadata.visualEnhancements,
    overallScore: metadata.overallScore,
  };
}

/**
 * Repo Analyzer Agent - Analyzes repository structure and README
 */
async function repoAnalyzerAgent(
  repoName: string,
  owner: string,
  readme: string,
  structure: string,
  files: string
): Promise<string> {
  const prompt = `You are a GitHub repository analyzer. Analyze the following repository information and provide a detailed analysis.

Repository: ${repoName} by ${owner}

Repository Structure:
${structure}

README Content (first 2000 chars):
${readme.substring(0, 2000)}

Root Files:
${files}

Provide a comprehensive analysis including:
1. Project purpose and goals
2. Technology stack used
3. Code quality observations
4. Documentation quality
5. Overall repository health score (1-100)

Be specific and constructive in your analysis.`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are an expert GitHub repository analyzer. Provide detailed, constructive analysis of repositories.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0]?.message?.content?.toString() || "Analysis failed";
}

/**
 * Content Improver Agent - Suggests improvements to titles, summaries, and descriptions
 */
async function contentImproverAgent(
  repoName: string,
  analysis: string
): Promise<{
  titleSuggestion: string;
  summaryImprovement: string;
  documentationImprovements: string[];
}> {
  const prompt = `You are a content improvement specialist for GitHub projects. Based on the repository analysis, suggest improvements.

Repository: ${repoName}
Analysis: ${analysis}

Provide:
1. A better project title (if current one is generic or unclear)
2. An improved project summary (2-3 sentences, compelling and clear)
3. Better introduction text for the README
4. Key features to highlight
5. Suggested improvements to documentation

Format your response as JSON with these exact keys:
{
  "titleSuggestion": "...",
  "summaryImprovement": "...",
  "readmeIntroduction": "...",
  "keyFeatures": [...],
  "documentationImprovements": [...]
}`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are an expert content writer specializing in GitHub project documentation. Always respond with valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "content_improvements",
        strict: true,
        schema: {
          type: "object",
          properties: {
            titleSuggestion: { type: "string" },
            summaryImprovement: { type: "string" },
            readmeIntroduction: { type: "string" },
            keyFeatures: { type: "array", items: { type: "string" } },
            documentationImprovements: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: [
            "titleSuggestion",
            "summaryImprovement",
            "readmeIntroduction",
            "keyFeatures",
            "documentationImprovements",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content?.toString() || "{}";
  return JSON.parse(content);
}

/**
 * Metadata Recommender Agent - Suggests tags, categories, and metadata
 */
async function metadataRecommenderAgent(
  repoName: string,
  analysis: string,
  titleSuggestion: string
): Promise<{
  tags: string[];
  categories: string[];
  visualEnhancements: string[];
  overallScore: number;
}> {
  const prompt = `You are a metadata specialist for GitHub projects. Based on the repository information, recommend appropriate metadata.

Repository: ${repoName}
Analysis: ${analysis}
Suggested Title: ${titleSuggestion}

Provide:
1. Relevant tags (5-10 tags that describe the project)
2. Project categories (e.g., "Machine Learning", "Web Framework", "Data Science")
3. Target audience
4. Related technologies/frameworks
5. Suggested visual enhancements (diagrams, badges, etc.)
6. Overall quality score (1-100)

Format your response as JSON with these exact keys:
{
  "tags": [...],
  "categories": [...],
  "targetAudience": "...",
  "relatedTechnologies": [...],
  "visualEnhancements": [...],
  "overallScore": 75
}`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are an expert in GitHub project metadata and discoverability. Always respond with valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "metadata_recommendations",
        strict: true,
        schema: {
          type: "object",
          properties: {
            tags: { type: "array", items: { type: "string" } },
            categories: { type: "array", items: { type: "string" } },
            targetAudience: { type: "string" },
            relatedTechnologies: { type: "array", items: { type: "string" } },
            visualEnhancements: { type: "array", items: { type: "string" } },
            overallScore: { type: "number" },
          },
          required: [
            "tags",
            "categories",
            "targetAudience",
            "relatedTechnologies",
            "visualEnhancements",
            "overallScore",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content?.toString() || "{}";
  return JSON.parse(content);
}
