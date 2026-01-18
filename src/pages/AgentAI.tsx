/**
 * Agent AI Page
 * 
 * Provides access to the AI agent assistant.
 * URL managed centrally in src/config/tools.ts
 */

import { IframePage } from "@/components/common";
import { getToolById } from "@/config/tools";

const tool = getToolById('agent-ai');

const AgentAI = () => (
  <IframePage
    title={tool?.name || "Agent AI"}
    src={tool?.url || "https://bolt.new"}
  />
);

export default AgentAI;