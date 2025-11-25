# OPS.TaTTTy

**OPS.TaTTTy** is an AI-powered image management platform with advanced visibility controls and semantic search capabilities.

## ✨ Features

- 🎨 **Interactive Dashboard** with gallery, settings, and data visualization
- 🔒 **Private/Public Image Visibility** - Separate user-generated content from public images
- 🖼️ **Gallery Management** - Browse, search, and manage images through intuitive sidebar navigation
- 🤖 **AI-Powered Descriptions** using Grok 2 Vision with metadata enhancement
- 🔍 **Semantic Search** with Upstash Vector Search and visibility filtering
- 🔄 **Resilient Processing** with Vercel Workflow automatic retries and error handling
- 🚀 **Modern UI** built with shadcn/ui and Tailwind CSS
- 📊 **Dashboard Analytics** with interactive charts and data insights

## 🎯 Core Use Case

OPS.TaTTTy manages different types of image collections:

1. **Private Images** - AI-generated images shown immediately to users, stored temporarily with admin access
2. **Public Images** - Pre-generated or discarded images made available to all users
3. **Admin Oversight** - Staff can review and moderate all content regardless of visibility

## 🏗️ Architecture

### Image Lifecycle

```
1. Image Generation → Private storage (visibility: "private")
2. Initial Display → User sees immediate private access
3. User Decision:
   ├── Save/Download → Image remains private
   └── Discard → After 7+ days → Transitions to public (visibility: "public")
```

### Workflow Steps

**Upload/Generation Flow:**
1. 📤 **Upload Image** - Store in Vercel Blob Storage
2. 🤖 **Generate Description** - AI analysis with Grok 2 Vision
3. 🏷️ **Index with Metadata** - Upstash semantic search with visibility controls

**Search Flow:**
- **Public Search**: `visibility = 'public'` (open access)
- **Private Search**: `userId = 'xyz' AND visibility = 'private'` (user-specific)
- **Admin Search**: Access all images regardless of visibility

## 🛠️ Tech Stack

- ⚡ **Framework**: Next.js 15 with App Router and React 19
- 🔄 **Workflow**: Vercel Workflow with visibility metadata
- 🤖 **AI**: Grok 2 Vision via Vercel AI SDK
- 🔍 **Search Engine**: Upstash Vector Search with metadata filtering
- 💾 **Storage**: Vercel Blob Storage
- 🎨 **UI**: shadcn/ui + Tailwind CSS 4
- 📊 **Charts**: Interactive data visualization components
- 🔒 **Type Safety**: TypeScript with enhanced error handling

## 🚀 Quick Start

### Prerequisites
- 🟢 Node.js 18+
- 📦 pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/Tattzy25/ops-tattty.git
cd ops-tattty

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local

# Configure required services
```

### Environment Setup

```bash
# Upstash Search (for semantic search + metadata)
UPSTASH_SEARCH_URL="https://..."
UPSTASH_SEARCH_TOKEN="..."

# Vercel Blob (for image storage)
BLOB_READ_WRITE_TOKEN="..."

# AI Gateway Key (for local development)
XAI_API_KEY="..."

# Start development server
pnpm dev
```

Visit [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to access the gallery interface.

## 🗂️ Project Structure

```
ops-tattty/
├── app/
│   ├── dashboard/
│   │   ├── gallery/             # Main gallery page with ResultsClient
│   │   ├── gallery-data/        # Gallery analytics & insights
│   │   ├── settings/            # Configuration & preferences
│   │   ├── layout.tsx           # Dashboard layout with sidebar
│   │   └── page.tsx             # Dashboard overview
│   ├── actions/
│   │   └── search.ts            # Enhanced search with visibility filtering
│   └── api/upload/
│       ├── process-image.ts     # Main workflow starting point
│       ├── upload-image.ts      # Step 1: Blob storage
│       ├── generate-description.ts # Step 2: AI description
│       └── index-image.ts       # Step 3: Upstash indexing with metadata
├── components/
│   ├── app-sidebar.tsx          # Dashboard navigation
│   ├── results.client.tsx       # Gallery component with search
│   ├── chart-area-interactive.tsx # Dashboard data visualization
│   └── upload-button.tsx        # Image upload interface
└── .github/instructions.md      # Development guidelines
```

## 🔧 Key Features

### Visibility Control System
- **Private Images**: User-specific content, temporary storage
- **Public Images**: Shared content available to all users
- **Admin Override**: Staff access to all content types

### Semantic Search with Filtering
```typescript
// Example search queries with filters
const publicResults = await search({ query: "lions", visibility: "public" });
const privateResults = await search({
  query: "cats",
  visibility: "private",
  userId: "user123"
});
```

### Workflow Observability
- 🔄 `[WORKFLOW]` - Process-level timing and success tracking
- 🔧 `[stepId]` - Individual step execution with retry counts
- 🌐 Network and error handling with detailed logging

## 🤝 Contributing

This project follows AI-first development practices as outlined in `.github/instructions.md`. Contributions should maintain code quality, visibility controls, and workflow reliability.

## 📄 License

This project is part of the Tattzy25 portfolio repository.
