export type ChatMode = "resume" | "consult";

export interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface UserInsightSummary {
  displayName: string | null;
  knownName: string | null;
  email: string | null;
  whoTheySeemToBe: string;
  topicsDiscussed: string[];
  peopleOrCompaniesNamed: string[];
  toolsInterestedIn: string[];
  lastIntent: string;
  notesForShivanshu: string;
  updatedAt: number;
  messageCount: number;
}

export interface ToolRequestPayload {
  name: string;
  toolsWanted: string;
  email: string;
  positionCompany: string;
  problem: string;
}
