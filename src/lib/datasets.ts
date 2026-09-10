import { Dataset, DatasetId } from "./types";

export const DATASETS: Dataset[] = [
  {
    id: "search-terms",
    label: "Search Terms Report",
    emoji: "🔍",
    description: "Every query that triggered an ad. The receipts.",
    mockRowRange: [800, 14000],
  },
  {
    id: "product-performance",
    label: "Product Performance",
    emoji: "📦",
    description: "Shopping / PMax product-level spend, sales, ROAS.",
    mockRowRange: [40, 3200],
  },
  {
    id: "feed-export",
    label: "Feed Export",
    emoji: "🗂️",
    description: "Raw product feed — titles, attributes, gaps.",
    mockRowRange: [40, 3200],
  },
  {
    id: "asset-performance",
    label: "Asset Performance",
    emoji: "🎨",
    description: "Headlines, descriptions, images — what's pulling weight.",
    mockRowRange: [20, 900],
  },
  {
    id: "auction-insights",
    label: "Auction Insights",
    emoji: "🕵️",
    description: "Who else is bidding, and who's winning.",
    mockRowRange: [5, 60],
  },
  {
    id: "change-logs",
    label: "Change History",
    emoji: "🧾",
    description: "Every edit anyone ever made to this account.",
    mockRowRange: [120, 6000],
  },
  {
    id: "campaign-performance",
    label: "Campaign Performance",
    emoji: "📈",
    description: "Daily campaign-level spend and results over time.",
    mockRowRange: [90, 2400],
  },
  {
    id: "notes",
    label: "Account Notes",
    emoji: "📝",
    description: "Whatever the team scribbled down and forgot about.",
    mockRowRange: [3, 140],
  },
  {
    id: "client-context",
    label: "Client Context",
    emoji: "📋",
    description: "Briefs, goals, promises made in kickoff calls.",
    mockRowRange: [1, 40],
  },
];

export const DATASET_MAP: Record<DatasetId, Dataset> = Object.fromEntries(
  DATASETS.map((d) => [d.id, d])
) as Record<DatasetId, Dataset>;
