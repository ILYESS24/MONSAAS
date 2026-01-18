/**
 * Zustand Store - Global State Management
 * 
 * Centralized state management for the application using Zustand.
 * Provides type-safe, performant global state with minimal boilerplate.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ============================================================================
// Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Tool {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'loading';
  lastChecked: Date;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// ============================================================================
// App Store - Global application state
// ============================================================================

interface AppState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Active view/tab
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Theme
        theme: 'dark',
        setTheme: (theme) => set({ theme }),
        
        // Sidebar
        sidebarOpen: true,
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        
        // Loading
        isLoading: false,
        setLoading: (loading) => set({ isLoading: loading }),
        
        // Active tab
        activeTab: 'overview',
        setActiveTab: (tab) => set({ activeTab: tab }),
      }),
      {
        name: 'aurion-app-storage',
        partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
      }
    ),
    { name: 'AppStore' }
  )
);

// ============================================================================
// User Store - User-related state
// ============================================================================

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'UserStore' }
  )
);

// ============================================================================
// Dashboard Store - Dashboard-specific state
// ============================================================================

interface DashboardStats {
  totalSales: number;
  activeCampaigns: number;
  weeklyEngagement: number;
  growth: number;
}

interface DashboardState {
  stats: DashboardStats;
  tools: Tool[];
  projects: Project[];
  isRefreshing: boolean;
  lastUpdated: Date | null;
  
  // Actions
  setStats: (stats: DashboardStats) => void;
  setTools: (tools: Tool[]) => void;
  setProjects: (projects: Project[]) => void;
  setRefreshing: (refreshing: boolean) => void;
  updateToolStatus: (toolId: string, status: Tool['status']) => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      stats: {
        totalSales: 23000,
        activeCampaigns: 24,
        weeklyEngagement: 70,
        growth: 80,
      },
      tools: [],
      projects: [],
      isRefreshing: false,
      lastUpdated: null,
      
      setStats: (stats) => set({ stats, lastUpdated: new Date() }),
      setTools: (tools) => set({ tools }),
      setProjects: (projects) => set({ projects }),
      setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
      updateToolStatus: (toolId, status) =>
        set((state) => ({
          tools: state.tools.map((tool) =>
            tool.id === toolId ? { ...tool, status, lastChecked: new Date() } : tool
          ),
        })),
    }),
    { name: 'DashboardStore' }
  )
);

// ============================================================================
// Notification Store - Notifications state
// ============================================================================

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set, get) => ({
        notifications: [],
        unreadCount: 0,
        
        addNotification: (notification) => {
          const newNotification: Notification = {
            ...notification,
            id: typeof crypto !== 'undefined' && crypto.randomUUID 
              ? crypto.randomUUID() 
              : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            read: false,
            createdAt: new Date(),
          };
          set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
          }));
        },
        
        markAsRead: (id) =>
          set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            if (notification && !notification.read) {
              return {
                notifications: state.notifications.map((n) =>
                  n.id === id ? { ...n, read: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
              };
            }
            return state;
          }),
        
        markAllAsRead: () =>
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
          })),
        
        removeNotification: (id) =>
          set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            return {
              notifications: state.notifications.filter((n) => n.id !== id),
              unreadCount: notification && !notification.read
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount,
            };
          }),
        
        clearAll: () => set({ notifications: [], unreadCount: 0 }),
      }),
      {
        name: 'aurion-notifications-storage',
      }
    ),
    { name: 'NotificationStore' }
  )
);

// ============================================================================
// Selectors - Optimized state selectors
// ============================================================================

// App selectors
export const selectTheme = (state: AppState) => state.theme;
export const selectSidebarOpen = (state: AppState) => state.sidebarOpen;
export const selectIsLoading = (state: AppState) => state.isLoading;

// User selectors
export const selectUser = (state: UserState) => state.user;
export const selectIsAuthenticated = (state: UserState) => state.isAuthenticated;

// Dashboard selectors
export const selectStats = (state: DashboardState) => state.stats;
export const selectTools = (state: DashboardState) => state.tools;
export const selectProjects = (state: DashboardState) => state.projects;

// Notification selectors
export const selectNotifications = (state: NotificationState) => state.notifications;
export const selectUnreadCount = (state: NotificationState) => state.unreadCount;
