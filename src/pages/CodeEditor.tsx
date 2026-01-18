/**
 * Code Editor Page
 * 
 * Provides access to the AI-powered code editor.
 * URL managed centrally in src/config/tools.ts
 */

import { IframePage } from "@/components/common";
import { getToolById } from "@/config/tools";

const tool = getToolById('code-editor');

const CodeEditor = () => (
  <IframePage
    title={tool?.name || "Code Editor"}
    src={tool?.url || "https://bolt.new"}
  />
);

export default CodeEditor;