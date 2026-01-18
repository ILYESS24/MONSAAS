/**
 * Text Editor Page
 * 
 * Provides access to the AI-powered text editor.
 * URL managed centrally in src/config/tools.ts
 */

import { IframePage } from "@/components/common";
import { getToolById } from "@/config/tools";

const tool = getToolById('text-editor');

const TextEditor = () => (
  <IframePage
    title={tool?.name || "Text Editor"}
    src={tool?.url || "https://bolt.new"}
  />
);

export default TextEditor;