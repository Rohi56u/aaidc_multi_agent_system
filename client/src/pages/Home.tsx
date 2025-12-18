import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { ArrowRight, Zap, Brain, Sparkles } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">RepoAssistant</span>
          </div>
          <div>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Sign In
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">AI-Powered Repository Analysis</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
            Transform Your GitHub
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Repository Profile
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Get intelligent, AI-powered suggestions to improve your project's documentation, metadata, and discoverability. Our multi-agent system analyzes your repository and provides actionable recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Analyzing <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            )}
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "Multi-Agent Analysis",
              description: "Three specialized AI agents work together to analyze your repository from different perspectives.",
            },
            {
              icon: Zap,
              title: "Instant Recommendations",
              description: "Get comprehensive suggestions for titles, summaries, tags, and documentation improvements.",
            },
            {
              icon: Sparkles,
              title: "Quality Scoring",
              description: "Receive an overall quality score and specific insights for enhancing your project's presentation.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
            >
              <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-lg border border-slate-700/50 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Improve Your Repository?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Paste your GitHub repository URL and let our AI agents provide comprehensive improvement suggestions.
          </p>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Open Dashboard
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Sign In to Get Started
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>AAIDC Module 2 Project: Multi-Agent Publication Assistant</p>
        </div>
      </footer>
    </div>
  );
}
