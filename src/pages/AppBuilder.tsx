/**
 * App Builder Page
 * 
 * Provides access to the AI-powered application builder.
 * URL managed centrally in src/config/tools.ts
 */

import { IframePage } from "@/components/common";
import { getToolById } from "@/config/tools";

const tool = getToolById('app-builder');

const AppBuilder = () => (
  <IframePage
    title={tool?.name || "App Builder"}
    src={tool?.url || "https://bolt.new"}
  />
);

export default AppBuilder;