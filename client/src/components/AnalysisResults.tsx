import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, Lightbulb, Tag } from "lucide-react";

interface AnalysisData {
  analysis: {
    repositoryName: string;
    repositoryOwner: string;
    repositoryUrl: string;
    status: string;
  };
  results: {
    titleSuggestion?: string | null;
    summaryImprovement?: string | null;
    suggestedTags?: string | null;
    suggestedCategories?: string | null;
    missingSections?: string | null;
    visualEnhancements?: string | null;
    readmeAnalysis?: string | null;
    overallScore?: number | null;
  } | null;
}

export default function AnalysisResults({ data }: { data: AnalysisData }) {
  const parseJSON = (str: string | undefined | null) => {
    if (!str) return [];
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  };

  if (!data.results) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50 p-6">
        <p className="text-slate-400">No results available yet</p>
      </Card>
    );
  }

  const tags = parseJSON(data.results.suggestedTags);
  const categories = parseJSON(data.results.suggestedCategories);
  const missingSections = parseJSON(data.results.missingSections);
  const visualEnhancements = parseJSON(data.results.visualEnhancements);

  return (
    <div className="space-y-6">
      {/* Repository Info */}
      <Card className="bg-slate-800/50 border-slate-700/50 p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">
            {data.analysis.repositoryName}
          </h3>
          <p className="text-sm text-slate-400">
            by {data.analysis.repositoryOwner}
          </p>
          <a
            href={data.analysis.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            View on GitHub →
          </a>
        </div>
      </Card>

      {/* Score */}
      {data.results.overallScore !== undefined && data.results.overallScore !== null && (
        <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300 mb-2">Overall Quality Score</p>
              <p className="text-4xl font-bold text-white">
                {data.results.overallScore}
                <span className="text-xl text-slate-400">/100</span>
              </p>
            </div>
            <CheckCircle2 className="w-16 h-16 text-blue-400 opacity-50" />
          </div>
        </Card>
      )}

      {/* Tabs for different sections */}
      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="bg-slate-800/50 border-slate-700/50">
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          {data.results.titleSuggestion && (
            <Card className="bg-slate-800/50 border-slate-700/50 p-6">
              <div className="flex gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Better Title Suggestion
                  </h4>
                  <p className="text-slate-300">
                    {data.results.titleSuggestion}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {data.results.summaryImprovement && (
            <Card className="bg-slate-800/50 border-slate-700/50 p-6">
              <div className="flex gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Improved Summary
                  </h4>
                  <p className="text-slate-300">
                    {data.results.summaryImprovement}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {missingSections.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700/50 p-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-3">
                    Missing Sections
                  </h4>
                  <ul className="space-y-2">
                    {missingSections.map((section: string, idx: number) => (
                      <li key={idx} className="text-slate-300 flex gap-2">
                        <span className="text-orange-400">•</span>
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {visualEnhancements.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700/50 p-6">
              <div className="flex gap-3">
                <Lightbulb className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-3">
                    Visual Enhancements
                  </h4>
                  <ul className="space-y-2">
                    {visualEnhancements.map((enhancement: string, idx: number) => (
                      <li key={idx} className="text-slate-300 flex gap-2">
                        <span className="text-cyan-400">•</span>
                        {enhancement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Metadata Tab */}
        <TabsContent value="metadata" className="space-y-4">
          {tags.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700/50 p-6">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-400" />
                Suggested Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, idx: number) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="bg-blue-600/30 text-blue-200 border-blue-500/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {categories.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700/50 p-6">
              <h4 className="font-semibold text-white mb-4">
                Suggested Categories
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category: string, idx: number) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="bg-purple-600/30 text-purple-200 border-purple-500/30"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          {data.results.readmeAnalysis && (
            <Card className="bg-slate-800/50 border-slate-700/50 p-6">
              <h4 className="font-semibold text-white mb-4">Repository Analysis</h4>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 whitespace-pre-wrap">
                  {data.results.readmeAnalysis}
                </p>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
