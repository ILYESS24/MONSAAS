/**
 * Subscription System
 * 
 * Manages subscription plans, quotas, and usage tracking.
 * Enforces limits based on user's subscription level.
 * 
 * @module subscription
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ============================================================================
// Types
// ============================================================================

export type SubscriptionPlanId = 'free' | 'creator' | 'pro' | 'enterprise';

export interface PlanLimits {
  // Projects
  maxProjects: number;
  // Storage in MB
  maxStorageMB: number;
  
  // Tool-specific limits
  codeEditor: {
    enabled: boolean;
    readOnly: boolean;
    aiAutocomplete: boolean;
    githubSync: boolean;
  };
  textEditor: {
    enabled: boolean;
    features: 'basic' | 'standard' | 'full';
    exportFormats: string[];
  };
  intelligentCanvas: {
    enabled: boolean;
    maxBoards: number;
  };
  aurionChat: {
    enabled: boolean;
    maxMessagesPerDay: number;
  };
  agentAI: {
    enabled: boolean;
    maxRequestsPerMonth: number;
  };
  appBuilder: {
    enabled: boolean;
    features: 'none' | 'prototype' | 'deploy';
  };
  workflow: {
    enabled: boolean;
    maxWorkflows: number;
  };
  monitoring: {
    enabled: boolean;
  };
}

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  price: number;
  period: 'month' | 'year';
  limits: PlanLimits;
}

export interface UsageData {
  // Current period usage
  projectsCount: number;
  storageUsedMB: number;
  
  // Daily/Monthly usage
  chatMessagesToday: number;
  agentAIRequestsThisMonth: number;
  canvasBoardsCount: number;
  workflowsCount: number;
  
  // Last reset dates
  lastDailyReset: string; // ISO date
  lastMonthlyReset: string; // ISO date
}

// ============================================================================
// Plan Configurations
// ============================================================================

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlanId, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Découverte',
    price: 0,
    period: 'month',
    limits: {
      maxProjects: 2,
      maxStorageMB: 500,
      codeEditor: {
        enabled: true,
        readOnly: true,
        aiAutocomplete: false,
        githubSync: false,
      },
      textEditor: {
        enabled: true,
        features: 'basic',
        exportFormats: ['txt'],
      },
      intelligentCanvas: {
        enabled: true,
        maxBoards: 3,
      },
      aurionChat: {
        enabled: true,
        maxMessagesPerDay: 10,
      },
      agentAI: {
        enabled: false,
        maxRequestsPerMonth: 0,
      },
      appBuilder: {
        enabled: false,
        features: 'none',
      },
      workflow: {
        enabled: false,
        maxWorkflows: 0,
      },
      monitoring: {
        enabled: false,
      },
    },
  },
  creator: {
    id: 'creator',
    name: 'Creator',
    price: 12,
    period: 'month',
    limits: {
      maxProjects: 10,
      maxStorageMB: 5120, // 5 Go
      codeEditor: {
        enabled: true,
        readOnly: false,
        aiAutocomplete: true,
        githubSync: false,
      },
      textEditor: {
        enabled: true,
        features: 'standard',
        exportFormats: ['txt', 'pdf', 'png'],
      },
      intelligentCanvas: {
        enabled: true,
        maxBoards: 10,
      },
      aurionChat: {
        enabled: true,
        maxMessagesPerDay: 100,
      },
      agentAI: {
        enabled: true,
        maxRequestsPerMonth: 50,
      },
      appBuilder: {
        enabled: true,
        features: 'prototype',
      },
      workflow: {
        enabled: false,
        maxWorkflows: 0,
      },
      monitoring: {
        enabled: false,
      },
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 39,
    period: 'month',
    limits: {
      maxProjects: Infinity,
      maxStorageMB: 51200, // 50 Go
      codeEditor: {
        enabled: true,
        readOnly: false,
        aiAutocomplete: true,
        githubSync: true,
      },
      textEditor: {
        enabled: true,
        features: 'full',
        exportFormats: ['txt', 'pdf', 'png', 'docx', 'html'],
      },
      intelligentCanvas: {
        enabled: true,
        maxBoards: Infinity,
      },
      aurionChat: {
        enabled: true,
        maxMessagesPerDay: Infinity,
      },
      agentAI: {
        enabled: true,
        maxRequestsPerMonth: 500,
      },
      appBuilder: {
        enabled: true,
        features: 'deploy',
      },
      workflow: {
        enabled: true,
        maxWorkflows: 20,
      },
      monitoring: {
        enabled: true,
      },
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 149,
    period: 'month',
    limits: {
      maxProjects: Infinity,
      maxStorageMB: Infinity,
      codeEditor: {
        enabled: true,
        readOnly: false,
        aiAutocomplete: true,
        githubSync: true,
      },
      textEditor: {
        enabled: true,
        features: 'full',
        exportFormats: ['txt', 'pdf', 'png', 'docx', 'html', 'md'],
      },
      intelligentCanvas: {
        enabled: true,
        maxBoards: Infinity,
      },
      aurionChat: {
        enabled: true,
        maxMessagesPerDay: Infinity,
      },
      agentAI: {
        enabled: true,
        maxRequestsPerMonth: Infinity,
      },
      appBuilder: {
        enabled: true,
        features: 'deploy',
      },
      workflow: {
        enabled: true,
        maxWorkflows: Infinity,
      },
      monitoring: {
        enabled: true,
      },
    },
  },
};

// ============================================================================
// Subscription Store
// ============================================================================

interface SubscriptionState {
  // Current plan
  currentPlan: SubscriptionPlanId;
  planStartDate: string | null;
  planEndDate: string | null;
  
  // Usage tracking
  usage: UsageData;
  
  // Actions
  setPlan: (planId: SubscriptionPlanId) => void;
  incrementChatMessages: () => boolean;
  incrementAgentAIRequests: () => boolean;
  incrementCanvasBoards: () => boolean;
  incrementWorkflows: () => boolean;
  incrementProjects: () => boolean;
  addStorageUsed: (mb: number) => boolean;
  resetDailyUsage: () => void;
  resetMonthlyUsage: () => void;
  getUsagePercentage: (type: 'chat' | 'agentAI' | 'projects' | 'storage' | 'canvas' | 'workflows') => number;
}

const initialUsage: UsageData = {
  projectsCount: 0,
  storageUsedMB: 0,
  chatMessagesToday: 0,
  agentAIRequestsThisMonth: 0,
  canvasBoardsCount: 0,
  workflowsCount: 0,
  lastDailyReset: new Date().toISOString().split('T')[0],
  lastMonthlyReset: new Date().toISOString().slice(0, 7), // YYYY-MM
};

export const useSubscriptionStore = create<SubscriptionState>()(
  devtools(
    persist(
      (set, get) => ({
        currentPlan: 'free',
        planStartDate: null,
        planEndDate: null,
        usage: initialUsage,

        setPlan: (planId: SubscriptionPlanId) => {
          const now = new Date();
          const endDate = new Date(now);
          endDate.setMonth(endDate.getMonth() + 1);
          
          set({
            currentPlan: planId,
            planStartDate: now.toISOString(),
            planEndDate: endDate.toISOString(),
          });
        },

        incrementChatMessages: () => {
          const state = get();
          const limits = SUBSCRIPTION_PLANS[state.currentPlan].limits;
          
          // Check daily reset
          const today = new Date().toISOString().split('T')[0];
          let currentUsage = state.usage.chatMessagesToday;
          
          if (state.usage.lastDailyReset !== today) {
            currentUsage = 0;
          }
          
          if (limits.aurionChat.maxMessagesPerDay !== Infinity && 
              currentUsage >= limits.aurionChat.maxMessagesPerDay) {
            return false; // Quota exceeded
          }
          
          set((s) => ({
            usage: {
              ...s.usage,
              chatMessagesToday: s.usage.lastDailyReset !== today ? 1 : s.usage.chatMessagesToday + 1,
              lastDailyReset: today,
            },
          }));
          
          return true;
        },

        incrementAgentAIRequests: () => {
          const state = get();
          const limits = SUBSCRIPTION_PLANS[state.currentPlan].limits;
          
          // Check monthly reset
          const currentMonth = new Date().toISOString().slice(0, 7);
          let currentUsage = state.usage.agentAIRequestsThisMonth;
          
          if (state.usage.lastMonthlyReset !== currentMonth) {
            currentUsage = 0;
          }
          
          if (!limits.agentAI.enabled) {
            return false; // Tool not enabled for this plan
          }
          
          if (limits.agentAI.maxRequestsPerMonth !== Infinity &&
              currentUsage >= limits.agentAI.maxRequestsPerMonth) {
            return false; // Quota exceeded
          }
          
          set((s) => ({
            usage: {
              ...s.usage,
              agentAIRequestsThisMonth: s.usage.lastMonthlyReset !== currentMonth ? 1 : s.usage.agentAIRequestsThisMonth + 1,
              lastMonthlyReset: currentMonth,
            },
          }));
          
          return true;
        },

        incrementCanvasBoards: () => {
          const state = get();
          const limits = SUBSCRIPTION_PLANS[state.currentPlan].limits;
          
          if (limits.intelligentCanvas.maxBoards !== Infinity &&
              state.usage.canvasBoardsCount >= limits.intelligentCanvas.maxBoards) {
            return false;
          }
          
          set((s) => ({
            usage: {
              ...s.usage,
              canvasBoardsCount: s.usage.canvasBoardsCount + 1,
            },
          }));
          
          return true;
        },

        incrementWorkflows: () => {
          const state = get();
          const limits = SUBSCRIPTION_PLANS[state.currentPlan].limits;
          
          if (!limits.workflow.enabled) {
            return false;
          }
          
          if (limits.workflow.maxWorkflows !== Infinity &&
              state.usage.workflowsCount >= limits.workflow.maxWorkflows) {
            return false;
          }
          
          set((s) => ({
            usage: {
              ...s.usage,
              workflowsCount: s.usage.workflowsCount + 1,
            },
          }));
          
          return true;
        },

        incrementProjects: () => {
          const state = get();
          const limits = SUBSCRIPTION_PLANS[state.currentPlan].limits;
          
          if (limits.maxProjects !== Infinity &&
              state.usage.projectsCount >= limits.maxProjects) {
            return false;
          }
          
          set((s) => ({
            usage: {
              ...s.usage,
              projectsCount: s.usage.projectsCount + 1,
            },
          }));
          
          return true;
        },

        addStorageUsed: (mb: number) => {
          const state = get();
          const limits = SUBSCRIPTION_PLANS[state.currentPlan].limits;
          
          if (limits.maxStorageMB !== Infinity &&
              state.usage.storageUsedMB + mb > limits.maxStorageMB) {
            return false;
          }
          
          set((s) => ({
            usage: {
              ...s.usage,
              storageUsedMB: s.usage.storageUsedMB + mb,
            },
          }));
          
          return true;
        },

        resetDailyUsage: () => {
          const today = new Date().toISOString().split('T')[0];
          set((s) => ({
            usage: {
              ...s.usage,
              chatMessagesToday: 0,
              lastDailyReset: today,
            },
          }));
        },

        resetMonthlyUsage: () => {
          const currentMonth = new Date().toISOString().slice(0, 7);
          set((s) => ({
            usage: {
              ...s.usage,
              agentAIRequestsThisMonth: 0,
              lastMonthlyReset: currentMonth,
            },
          }));
        },

        getUsagePercentage: (type) => {
          const state = get();
          const limits = SUBSCRIPTION_PLANS[state.currentPlan].limits;
          
          switch (type) {
            case 'chat':
              if (limits.aurionChat.maxMessagesPerDay === Infinity) return 0;
              return (state.usage.chatMessagesToday / limits.aurionChat.maxMessagesPerDay) * 100;
            case 'agentAI':
              if (!limits.agentAI.enabled || limits.agentAI.maxRequestsPerMonth === Infinity) return 0;
              return (state.usage.agentAIRequestsThisMonth / limits.agentAI.maxRequestsPerMonth) * 100;
            case 'projects':
              if (limits.maxProjects === Infinity) return 0;
              return (state.usage.projectsCount / limits.maxProjects) * 100;
            case 'storage':
              if (limits.maxStorageMB === Infinity) return 0;
              return (state.usage.storageUsedMB / limits.maxStorageMB) * 100;
            case 'canvas':
              if (limits.intelligentCanvas.maxBoards === Infinity) return 0;
              return (state.usage.canvasBoardsCount / limits.intelligentCanvas.maxBoards) * 100;
            case 'workflows':
              if (!limits.workflow.enabled || limits.workflow.maxWorkflows === Infinity) return 0;
              return (state.usage.workflowsCount / limits.workflow.maxWorkflows) * 100;
            default:
              return 0;
          }
        },
      }),
      {
        name: 'aurion-subscription-storage',
      }
    ),
    { name: 'SubscriptionStore' }
  )
);

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a tool is accessible for the current plan
 */
export function isToolAccessible(toolId: string, planId: SubscriptionPlanId): { 
  accessible: boolean; 
  reason?: string;
  upgradeRequired?: SubscriptionPlanId;
} {
  const limits = SUBSCRIPTION_PLANS[planId].limits;
  
  switch (toolId) {
    case 'code-editor':
      return { 
        accessible: limits.codeEditor.enabled,
        reason: limits.codeEditor.readOnly ? 'Mode lecture seule - Passez à Creator pour l\'édition' : undefined,
      };
    
    case 'text-editor':
      return { accessible: limits.textEditor.enabled };
    
    case 'intelligent-canvas':
      return { accessible: limits.intelligentCanvas.enabled };
    
    case 'aurion-chat':
      return { accessible: limits.aurionChat.enabled };
    
    case 'agent-ai':
      if (!limits.agentAI.enabled) {
        return { 
          accessible: false, 
          reason: 'Agent AI non disponible dans votre plan',
          upgradeRequired: 'creator',
        };
      }
      return { accessible: true };
    
    case 'app-builder':
      if (!limits.appBuilder.enabled || limits.appBuilder.features === 'none') {
        return { 
          accessible: false, 
          reason: 'App Builder non disponible dans votre plan',
          upgradeRequired: 'creator',
        };
      }
      return { accessible: true };
    
    case 'workflows':
      if (!limits.workflow.enabled) {
        return { 
          accessible: false, 
          reason: 'Workflows non disponibles dans votre plan',
          upgradeRequired: 'pro',
        };
      }
      return { accessible: true };
    
    case 'monitoring':
      if (!limits.monitoring.enabled) {
        return { 
          accessible: false, 
          reason: 'Monitoring Dashboard non disponible dans votre plan',
          upgradeRequired: 'pro',
        };
      }
      return { accessible: true };
    
    default:
      return { accessible: true };
  }
}

/**
 * Get limits for a specific tool
 */
export function getToolLimits(toolId: string, planId: SubscriptionPlanId) {
  const limits = SUBSCRIPTION_PLANS[planId].limits;
  
  switch (toolId) {
    case 'code-editor':
      return limits.codeEditor;
    case 'text-editor':
      return limits.textEditor;
    case 'intelligent-canvas':
      return limits.intelligentCanvas;
    case 'aurion-chat':
      return limits.aurionChat;
    case 'agent-ai':
      return limits.agentAI;
    case 'app-builder':
      return limits.appBuilder;
    case 'workflows':
      return limits.workflow;
    case 'monitoring':
      return limits.monitoring;
    default:
      return null;
  }
}

/**
 * Format limit value for display
 */
export function formatLimit(value: number): string {
  if (value === Infinity) return 'Illimité';
  if (value >= 1024) return `${(value / 1024).toFixed(1)} Go`;
  return value.toString();
}

export default {
  SUBSCRIPTION_PLANS,
  useSubscriptionStore,
  isToolAccessible,
  getToolLimits,
  formatLimit,
};
