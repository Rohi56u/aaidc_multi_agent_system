import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Clock } from "lucide-react";

interface Analysis {
  id: number;
  repositoryName: string;
  repositoryOwner: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: Date;
}

interface AnalysisHistoryProps {
  analyses: Analysis[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function AnalysisHistory({
  analyses,
  activeId,
  onSelect,
  onDelete,
}: AnalysisHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600/30 text-green-200 border-green-500/30";
      case "processing":
        return "bg-blue-600/30 text-blue-200 border-blue-500/30";
      case "pending":
        return "bg-yellow-600/30 text-yellow-200 border-yellow-500/30";
      case "failed":
        return "bg-red-600/30 text-red-200 border-red-500/30";
      default:
        return "bg-slate-600/30 text-slate-200 border-slate-500/30";
    }
  };

  if (analyses.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50 p-6 text-center">
        <p className="text-slate-400">No analyses yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {analyses.map((analysis) => (
        <Card
          key={analysis.id}
          className={`bg-slate-800/50 border-slate-700/50 p-4 cursor-pointer transition-colors ${
            activeId === analysis.id ? "border-blue-500/50 bg-slate-800" : ""
          } hover:bg-slate-800/70`}
          onClick={() => onSelect(analysis.id)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">
                {analysis.repositoryName}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {analysis.repositoryOwner}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(analysis.status)}>
                  {analysis.status}
                </Badge>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(analysis.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(analysis.id);
              }}
              className="text-red-400 hover:bg-red-600/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
