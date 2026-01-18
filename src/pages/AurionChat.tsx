/**
 * Aurion Chat Page
 * 
 * Provides access to the AI-powered chat interface.
 * URL managed centrally in src/config/tools.ts
 */

import { IframePage } from "@/components/common";
import { getToolById } from "@/config/tools";

const tool = getToolById('aurion-chat');

const AurionChat = () => (
  <IframePage
    title={tool?.name || "Aurion Chat"}
    src={tool?.url || "https://bolt.new"}
  />
);

export default AurionChat;