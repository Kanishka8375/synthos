import {
  LayoutDashboard,
  FolderOpen,
  GitBranch,
  Workflow,
  Users,
  Globe2,
  Waves,
  Music2,
  Cpu,
  BookOpen,
  ShoppingBag,
  TrendingUp,
  Languages,
  Settings,
  CreditCard,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Production",
    items: [
      { href: "/projects", label: "Projects", icon: FolderOpen, comingSoon: true },
      { href: "/episode-pipeline", label: "Episode Pipeline", icon: GitBranch, comingSoon: true },
      { href: "/workflow-canvas", label: "Workflow Canvas", icon: Workflow, comingSoon: true },
    ],
  },
  {
    label: "Creative",
    items: [
      { href: "/character-dna-vault", label: "Character DNA Vault", icon: Users, comingSoon: true },
      { href: "/world-atlas", label: "World Atlas", icon: Globe2, comingSoon: true },
      { href: "/emotion-choreography", label: "Emotion Choreography", icon: Waves, comingSoon: true },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/soundtrack-forge", label: "Soundtrack Forge", icon: Music2, comingSoon: true },
      { href: "/render-queue", label: "Render Queue", icon: Cpu, comingSoon: true },
      { href: "/production-bible", label: "Production Bible", icon: BookOpen, comingSoon: true },
    ],
  },
  {
    label: "Discover",
    items: [
      { href: "/marketplace", label: "Marketplace", icon: ShoppingBag, comingSoon: true },
      { href: "/trend-radar", label: "Trend Radar", icon: TrendingUp, comingSoon: true },
      { href: "/multilingual-engine", label: "Multilingual Engine", icon: Languages, comingSoon: true },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/billing", label: "Billing", icon: CreditCard, comingSoon: true },
    ],
  },
];

export const OPENCLAW_AGENTS = [
  "Script Writer",
  "Storyboard Agent",
  "Voice Synthesizer",
  "Music Composer",
  "Bible Keeper",
  "Trend Analyzer",
  "Translation Engine",
  "Lip Sync Engine",
  "Render Optimizer",
] as const;

export const PRICING_TIERS = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Explore the studio",
    features: [
      "3 projects",
      "10 render hours/mo",
      "5GB storage",
      "Basic Synthos AI agents",
      "720p export",
      "Community support",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Creator",
    price: 29,
    period: "month",
    description: "For solo creators",
    features: [
      "Unlimited projects",
      "100 render hours/mo",
      "100GB storage",
      "All 9 Synthos AI agents",
      "1080p export",
      "Priority support",
      "Marketplace access",
    ],
    cta: "Start creating",
    highlighted: false,
  },
  {
    name: "Studio",
    price: 99,
    period: "month",
    description: "For professional teams",
    features: [
      "Unlimited everything",
      "500 render hours/mo",
      "1TB storage",
      "All agents + custom tuning",
      "4K export",
      "Dedicated support",
      "Full API access",
      "Team collaboration (10 seats)",
    ],
    cta: "Upgrade to Studio",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large studios",
    features: [
      "Unlimited + on-premise option",
      "Custom render infrastructure",
      "Unlimited storage",
      "Custom agent training",
      "SLA guarantee",
      "Dedicated account manager",
      "White-label option",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
] as const;

export const STATUS_COLORS = {
  Draft: "bg-gray-500/20 text-gray-400",
  "In Progress": "bg-blue-500/20 text-blue-400",
  Rendering: "bg-amber-500/20 text-amber-400",
  Completed: "bg-emerald-500/20 text-emerald-400",
  Queued: "bg-gray-500/20 text-gray-400",
  Failed: "bg-rose-500/20 text-rose-400",
  Waiting: "bg-gray-500/20 text-gray-400",
  Active: "bg-indigo-500/20 text-indigo-400",
  Error: "bg-rose-500/20 text-rose-400",
  Generating: "bg-amber-500/20 text-amber-400",
  Ready: "bg-emerald-500/20 text-emerald-400",
  Assigned: "bg-indigo-500/20 text-indigo-400",
  Pending: "bg-gray-500/20 text-gray-400",
  Processing: "bg-amber-500/20 text-amber-400",
  Complete: "bg-emerald-500/20 text-emerald-400",
} as const;
