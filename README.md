# AAIDC Module 2: Multi-Agent Publication Assistant

A sophisticated multi-agent system that leverages artificial intelligence to analyze GitHub repositories and provide comprehensive improvement suggestions for project documentation, metadata, and discoverability.

## Overview

This project implements a **multi-agent orchestration system** that demonstrates the core concepts from the Agentic AI Developer Certification (AAIDC) Module 2. The system uses three specialized AI agents working in concert to analyze repositories and deliver actionable recommendations for improving how AI/ML projects are presented to the community.

### Key Features

- **Multi-Agent Architecture**: Three specialized agents (Repo Analyzer, Content Improver, Metadata Recommender) coordinate to provide comprehensive analysis
- **Intelligent Repository Analysis**: Fetches and analyzes README files, code structure, and project metadata from GitHub
- **Structured Recommendations**: Provides organized suggestions across multiple categories including titles, summaries, tags, and missing documentation sections
- **Quality Scoring**: Generates an overall quality score (0-100) for each repository
- **Export Functionality**: Download analysis results as formatted markdown reports
- **Persistent Storage**: Save and revisit analysis history with database persistence
- **Elegant Web Interface**: Modern, responsive UI built with React and Tailwind CSS
- **Real-Time Progress**: Visual indicators showing which agent is currently processing

## Architecture

### Multi-Agent System

The system orchestrates three specialized agents that work sequentially:

1. **Repo Analyzer Agent**: Examines repository structure, README content, and code organization to understand the project's purpose, technology stack, and documentation quality.

2. **Content Improver Agent**: Analyzes the repository analysis and suggests improvements to titles, summaries, and documentation. Provides specific recommendations for enhancing clarity and appeal.

3. **Metadata Recommender Agent**: Recommends relevant tags, categories, and visual enhancements based on the repository's characteristics and content.

### Technology Stack

**Backend**:
- Node.js with Express.js
- tRPC for type-safe API procedures
- LangChain for LLM integration
- MySQL/TiDB for data persistence
- Drizzle ORM for database management

**Frontend**:
- React 19 with TypeScript
- Tailwind CSS 4 for styling
- shadcn/ui components for consistent design
- Wouter for lightweight routing
- Sonner for notifications

**AI & Integration**:
- OpenAI LLM API for agent reasoning
- GitHub API for repository data fetching
- Manus OAuth for authentication

## Project Structure

```
aaidc_multi_agent_system/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Dashboard.tsx       # Main analysis interface
│   │   │   └── NotFound.tsx        # 404 page
│   │   ├── components/
│   │   │   ├── AnalysisResults.tsx # Results display component
│   │   │   ├── AnalysisHistory.tsx # History sidebar component
│   │   │   └── ui/                 # shadcn/ui components
│   │   ├── App.tsx                 # Main app component with routing
│   │   └── lib/trpc.ts             # tRPC client setup
│   └── index.html
├── server/                          # Node.js backend
│   ├── agents/
│   │   ├── multiAgentSystem.ts     # Main orchestration logic
│   │   └── tools.ts                # GitHub API and utility tools
│   ├── db.ts                        # Database query helpers
│   ├── routers.ts                   # tRPC procedure definitions
│   └── _core/                       # Framework infrastructure
├── drizzle/
│   ├── schema.ts                    # Database schema definitions
│   └── migrations/                  # Database migrations
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Database Schema

### Analysis History Table
Tracks all repository analyses performed by users with status tracking and timestamps.

### Analysis Results Table
Stores detailed improvement suggestions including titles, summaries, tags, categories, missing sections, and visual enhancements.

## Getting Started

### Prerequisites

- Node.js 22.13.0 or higher
- pnpm package manager
- GitHub account (for OAuth)
- MySQL/TiDB database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aaidc_multi_agent_system.git
cd aaidc_multi_agent_system
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Create .env file with required variables
DATABASE_URL=your_database_url
VITE_APP_ID=your_manus_app_id
JWT_SECRET=your_jwt_secret
# Additional environment variables are auto-injected by Manus platform
```

4. Run database migrations:
```bash
pnpm db:push
```

5. Start development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Usage

### Analyzing a Repository

1. Navigate to the Dashboard after logging in
2. Enter a GitHub repository URL (e.g., `https://github.com/owner/repo`)
3. Click "Analyze" to start the multi-agent analysis
4. View real-time progress as agents process the repository
5. Review comprehensive suggestions organized by category
6. Export results as a markdown report

### Viewing Analysis History

- Access your analysis history from the sidebar
- Click on any past analysis to view its results
- Delete analyses you no longer need

### Exporting Results

- Click the "Export" button to download analysis results as markdown
- Use the markdown file to document improvements or share with team members

## API Endpoints

### tRPC Procedures

**Analysis Operations**:
- `analysis.initiate` - Start a new repository analysis
- `analysis.getResults` - Retrieve results for a specific analysis
- `analysis.history` - Get user's analysis history
- `analysis.delete` - Delete an analysis
- `analysis.export` - Export analysis as markdown

**Authentication**:
- `auth.me` - Get current user information
- `auth.logout` - Log out current user

## Agent Specifications

### Repo Analyzer Agent

**Input**: Repository name, owner, README content, file structure

**Output**: Comprehensive analysis including:
- Project purpose and goals
- Technology stack identification
- Code quality observations
- Documentation quality assessment
- Repository health score (1-100)

**Tools Used**: GitHub API for repository data fetching

### Content Improver Agent

**Input**: Repository analysis from Repo Analyzer

**Output**: Content improvement suggestions including:
- Better project title (if current is generic)
- Improved project summary (2-3 compelling sentences)
- Better README introduction
- Key features to highlight
- Documentation improvement suggestions

**Tools Used**: LLM for content generation and analysis

### Metadata Recommender Agent

**Input**: Repository analysis and content improvements

**Output**: Metadata recommendations including:
- Relevant tags (5-10 tags)
- Project categories
- Target audience identification
- Related technologies/frameworks
- Visual enhancement suggestions
- Overall quality score (1-100)

**Tools Used**: LLM for metadata generation and categorization

## Testing

Run the test suite:
```bash
pnpm test
```

Run type checking:
```bash
pnpm check
```

## Deployment

The project is configured for deployment on the Manus platform:

1. Create a checkpoint:
```bash
# Checkpoint is created automatically when publishing
```

2. Click the "Publish" button in the Management UI

3. Configure custom domain if desired

## Performance Considerations

- Repository analysis typically takes 30-60 seconds depending on repository size
- Results are cached in the database for quick retrieval
- Real-time progress updates keep users informed during processing
- Optimistic UI updates provide instant feedback

## Security

- All API calls are authenticated via Manus OAuth
- Database queries use parameterized statements to prevent SQL injection
- Sensitive data (API keys) are stored in environment variables
- HTTPS is enforced in production

## Future Enhancements

- Batch analysis capability for multiple repositories
- MCP (Model Context Protocol) integration for extended tool access
- Caching layer for frequently analyzed repositories
- Admin dashboard for monitoring system health
- Rate limiting to prevent abuse
- Shareable analysis links with optional password protection

## Contributing

This is an educational project for the AAIDC certification program. Contributions are welcome for improvements and bug fixes.

## License

MIT License - See LICENSE file for details

## Project Submission

This project fulfills the AAIDC Module 2 requirements:

✅ **Multi-Agent System**: Three agents with distinct roles working together
✅ **Tool Integration**: GitHub API, LLM integration, text analysis tools
✅ **Orchestration Framework**: Sequential agent coordination with state management
✅ **Clear Communication**: Agents hand off results through structured data
✅ **Meaningful Problem**: Helps improve GitHub project discoverability and presentation

## References

- [AAIDC Module 2 Project Requirements](https://ready-tensor.com)
- [LangChain Documentation](https://python.langchain.com)
- [tRPC Documentation](https://trpc.io)
- [React Documentation](https://react.dev)
- [GitHub API Documentation](https://docs.github.com/en/rest)

## Contact

For questions or feedback about this project, please refer to the AAIDC program documentation.

---

**Created for**: Agentic AI Developer Certification Program - Module 2
**Project Type**: Multi-Agent System with Web Interface
**Status**: Complete and Ready for Review
