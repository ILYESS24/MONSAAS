import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useUser, SignOutButton, UserButton } from "@clerk/clerk-react";
import { isAuthConfigured } from "@/lib/env";
import { 
  useLiveStats, 
  useLiveActivity, 
  useToolStatus, 
  useCurrentTime,
  useProjects,
  useTasksDueToday,
  formatRelativeTime 
} from "@/hooks/useLiveData";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  BarChart3,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Menu,
  X,
  LogOut,
  Code,
  FileText,
  Bot,
  Activity,
  Wifi,
  WifiOff,
  ExternalLink,
  RefreshCw,
  MessageSquare,
  PenTool,
  Layers,
  Loader2,
  Package,
  Megaphone,
  UserCircle,
  ChevronDown,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Types
import type { ToolStatus } from "@/hooks/useLiveData";

// Tool icon mapping
const TOOL_ICONS: Record<string, React.ElementType> = {
  'code-editor': Code,
  'app-builder': Layers,
  'agent-ai': Bot,
  'aurion-chat': MessageSquare,
  'intelligent-canvas': PenTool,
  'text-editor': FileText,
};

// Tool route mapping
const TOOL_ROUTES: Record<string, string> = {
  'code-editor': '/code-editor',
  'app-builder': '/app-builder',
  'agent-ai': '/agent-ai',
  'aurion-chat': '/aurion-chat',
  'intelligent-canvas': '/intelligent-canvas',
  'text-editor': '/text-editor',
};

// Lime/Yellow-Green accent color from reference
const ACCENT_COLOR = "#D4FF00";
const ACCENT_DARK = "#B8E600";

// Navigation tabs (matching reference image)
const navTabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, active: true },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'insights', label: 'Customer Insights', icon: UserCircle },
  { id: 'reports', label: 'Analytics Reports', icon: BarChart3 },
];

// Category tabs
const categoryTabs = ['All', 'Accounting', 'Logistics', 'Engagement'];

// Weekly sales data for bar chart
const weeklySalesData = [
  { day: 'Sat', value: 40 },
  { day: 'Sun', value: 65 },
  { day: 'Mon', value: 85 },
  { day: 'Tue', value: 50 },
  { day: 'Wed', value: 70 },
  { day: 'Thu', value: 90 },
  { day: 'Fri', value: 100 },
];

// Weekly engagement donut data
const engagementData = [
  { name: 'Mobile App', value: 30, color: ACCENT_COLOR },
  { name: 'Website', value: 70, color: '#22C55E' },
];

// Active campaigns line chart data
const campaignData = [
  { day: 'Day 1', value: 200 },
  { day: 'Day 2', value: 350 },
  { day: 'Day 3', value: 280 },
  { day: 'Day 4', value: 450 },
  { day: 'Day 5', value: 580 },
];

// Sales trends area chart data
const salesTrendsData = [
  { month: 'Jan', value: 2800 },
  { month: 'Feb', value: 3200 },
  { month: 'Mar', value: 2900 },
  { month: 'Apr', value: 4100 },
  { month: 'May', value: 3800 },
  { month: 'Jun', value: 5230 },
];

// Tool Status Card Component
const ToolStatusCard: React.FC<{ tool: ToolStatus; onClick: () => void }> = ({ tool, onClick }) => {
  const Icon = TOOL_ICONS[tool.id] || Code;
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 p-3 bg-[#1a1a1a] border border-white/10 rounded-xl hover:bg-[#222] transition-colors w-full text-left"
    >
      <div className={`p-2 rounded-lg ${
        tool.status === 'online' ? 'bg-green-500/20' : 
        tool.status === 'offline' ? 'bg-red-500/20' : 'bg-white/10'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{tool.name}</p>
        <div className="flex items-center gap-1.5">
          {tool.status === 'online' ? (
            <>
              <Wifi className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">Online</span>
            </>
          ) : tool.status === 'offline' ? (
            <>
              <WifiOff className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-400">Offline</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3 h-3 text-white/40 animate-spin" />
              <span className="text-xs text-white/40">Checking...</span>
            </>
          )}
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-white/30" />
    </motion.button>
  );
};

// Helper hook to safely use Clerk auth only when configured
// Wrapper component for when Clerk auth IS configured
function DashboardWithAuth() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  
  const userName = clerkUser?.firstName || clerkUser?.username || "User";
  
  return (
    <DashboardContent 
      isSignedIn={isSignedIn}
      isLoaded={isLoaded}
      userName={userName}
      authEnabled={true}
    />
  );
}

// Wrapper component for demo mode (no Clerk)
function DashboardDemo() {
  return (
    <DashboardContent 
      isSignedIn={false}
      isLoaded={true}
      userName="User"
      authEnabled={false}
    />
  );
}

// Main Dashboard export
const Dashboard = () => {
  if (isAuthConfigured()) {
    return <DashboardWithAuth />;
  }
  return <DashboardDemo />;
};

// The actual dashboard content
interface DashboardContentProps {
  isSignedIn: boolean;
  isLoaded: boolean;
  userName: string;
  authEnabled: boolean;
}

const DashboardContent = ({ isSignedIn, isLoaded, userName, authEnabled }: DashboardContentProps) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeCategory, setActiveCategory] = useState('All');

  // Live data hooks (connected to Supabase)
  const liveStats = useLiveStats(30000);
  const liveActivities = useLiveActivity(8, 45000);
  const toolStatus = useToolStatus();
  const currentTime = useCurrentTime();
  const { projects: recentProjects, isLoading: projectsLoading } = useProjects(4);
  const { tasksCount: tasksDueToday, isLoading: tasksLoading } = useTasksDueToday();

  // Handlers
  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleToolClick = useCallback((toolId: string) => {
    const route = TOOL_ROUTES[toolId];
    if (route) {
      navigate(route);
    }
  }, [navigate]);

  // Format live stats for display
  const totalSales = useMemo(() => {
    if (liveStats.isLoading) return "...";
    const revenue = liveStats.revenue || 23000;
    return `$${(revenue / 1000).toFixed(1)}K`;
  }, [liveStats]);

  const activeCampaigns = useMemo(() => {
    return liveStats.isLoading ? "..." : (liveStats.totalProjects || 24).toString();
  }, [liveStats]);

  const onlineToolsCount = useMemo(() => 
    toolStatus.filter(t => t.status === 'online').length,
  [toolStatus]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-white font-body text-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-[#D4FF00] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-body">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
            onClick={handleCloseSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="fixed top-0 left-0 h-full w-[220px] bg-[#0d0d0d] border-r border-white/10 z-50 lg:translate-x-0 lg:z-30"
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#D4FF00] flex items-center justify-center">
              <span className="text-black font-bold text-lg">S</span>
            </div>
            <Link to="/" className="text-xl font-bold text-white">
              Stockify
            </Link>
            <button
              onClick={handleCloseSidebar}
              className="lg:hidden ml-auto p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dashboard Title */}
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Quick Actions */}
          <div className="space-y-2 mt-auto">
            <Link to="/code-editor">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Code className="w-4 h-4" />
                <span className="text-sm">Code Editor</span>
              </motion.div>
            </Link>
            <Link to="/agent-ai">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Bot className="w-4 h-4" />
                <span className="text-sm">AI Assistant</span>
              </motion.div>
            </Link>
          </div>

          {/* User Section */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              {authEnabled ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
                    }
                  }}
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
              </div>
              {authEnabled ? (
                <SignOutButton>
                  <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4 text-white/40" />
                  </button>
                </SignOutButton>
              ) : (
                <Link to="/" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  <LogOut className="w-4 h-4 text-white/40" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-[220px]">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 bg-[#0d0d0d]/90 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            {/* Mobile Menu */}
            <button
              onClick={handleToggleSidebar}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                    tab.active || activeTab === tab.id
                      ? 'bg-[#D4FF00] text-black font-medium'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Filter Tags */}
              <div className="hidden lg:flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs">
                  Weekly
                  <X className="w-3 h-3 cursor-pointer hover:text-[#D4FF00]" />
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs">
                  Last 1 hour
                  <X className="w-3 h-3 cursor-pointer hover:text-[#D4FF00]" />
                </span>
              </div>
              
              {/* Search */}
              <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors">
                <Search className="w-5 h-5" />
              </button>
              
              {/* Notifications */}
              <button className="relative p-2.5 hover:bg-white/10 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* More Options */}
              <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors bg-white/5">
                <Menu className="w-5 h-5" />
              </button>

              {/* User Avatar */}
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20">
                {authEnabled ? (
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-full h-full",
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                    U
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-4 md:p-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-4 mb-6">
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`text-sm transition-colors ${
                  activeCategory === tab
                    ? 'text-white font-medium border-b-2 border-[#D4FF00] pb-1'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-12 gap-4">
            {/* Total Sales Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-12 md:col-span-4 lg:col-span-3 bg-[#1a1a1a] border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                    <FolderOpen className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-white/60 text-sm">Total Sales</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40" />
              </div>
              <p className="text-4xl font-bold mb-4">
                <span className="text-white/60 text-2xl">$ </span>
                {totalSales.replace('$', '')}
              </p>
              
              {/* Mini Bar Chart */}
              <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklySalesData} barGap={2}>
                    <Bar 
                      dataKey="value" 
                      fill={ACCENT_COLOR}
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-[10px] text-white/40 mt-1">
                {weeklySalesData.map(d => (
                  <span key={d.day}>{d.day}</span>
                ))}
              </div>
            </motion.div>

            {/* Active Campaign Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="col-span-12 md:col-span-4 lg:col-span-3 bg-[#D4FF00] rounded-2xl p-5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-black/60 text-sm font-medium">Active Campaign</span>
                <ArrowUpRight className="w-4 h-4 text-black/40" />
              </div>
              
              {/* Decorative patterns */}
              <div className="absolute top-3 right-3 w-16 h-16 bg-[#B8E600] rounded-lg opacity-60" />
              <div className="absolute top-12 right-12 w-10 h-10 bg-black/10 rounded-lg bg-[radial-gradient(circle,_black_1px,_transparent_1px)] bg-[size:4px_4px]" />
              
              <div className="mt-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold text-black">{activeCampaigns}</span>
                </div>
                <p className="text-black/60 text-sm mt-2">Total active Campaign</p>
              </div>
              
              {/* Progress indicators */}
              <div className="flex gap-3 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-8 h-1 bg-black/20 rounded-full" />
                  <span className="text-black/60 text-xs">30%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-1 bg-black rounded-full" />
                  <span className="text-black text-xs font-medium">40%</span>
                </div>
              </div>
            </motion.div>

            {/* Weekly Engagement Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-12 md:col-span-4 lg:col-span-3 bg-[#1a1a1a] border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white text-sm font-medium">Weekly Engagement</span>
                <div className="flex items-center gap-1 text-white/60">
                  <span className="text-xs">70</span>
                </div>
              </div>
              
              {/* Donut Chart */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={engagementData}
                        cx="50%"
                        cy="50%"
                        innerRadius={28}
                        outerRadius={40}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {engagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-white/60">30</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#D4FF00]" />
                    <span className="text-xs text-white/60">Mobile App</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-white/60">Website</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2 mt-4">
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Menu className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Calendar className="w-4 h-4" />
                </button>
                <ArrowUpRight className="w-4 h-4 text-white/40 ml-auto" />
              </div>
            </motion.div>

            {/* Active Campaigns Chart Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="col-span-12 lg:col-span-3 bg-[#1a1a1a] border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">Active Campaigns</span>
                <ChevronDown className="w-4 h-4 text-white/40" />
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Gadget Galaxy</h3>
              
              {/* Campaign Days */}
              <div className="space-y-1 mb-4">
                {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'].map((day, index) => (
                  <div key={day} className="flex items-center justify-between text-xs">
                    <span className="text-white/40 w-12">{day}</span>
                    <div className="flex-1 h-1 mx-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white/40 rounded-full"
                        style={{ width: `${(index + 1) * 20}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Line Chart */}
              <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={campaignData}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={ACCENT_COLOR}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-white/40">26 sep</span>
                <div className="text-right">
                  <span className="text-2xl font-bold">580</span>
                  <span className="text-xs text-white/40 ml-1">person</span>
                </div>
              </div>
            </motion.div>

            {/* Sales Trends Overview - Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="col-span-12 lg:col-span-6 bg-[#1a1a1a] border border-white/10 rounded-2xl p-5"
            >
              <h3 className="text-sm font-medium text-white/60 mb-4">Sales Trends Overview</h3>
              
              {/* Area Chart */}
              <div className="h-40 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesTrendsData}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={ACCENT_COLOR} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#666', fontSize: 10 }}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        background: '#1a1a1a', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={ACCENT_COLOR}
                      strokeWidth={2}
                      fill="url(#salesGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                
                {/* Value Indicator */}
                <div className="absolute top-0 left-1/4 bg-[#D4FF00] text-black text-xs px-2 py-1 rounded font-medium">
                  $ 5,230
                </div>
              </div>

              {/* Big Stats */}
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-5xl font-bold">$34.2K</p>
                  <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    80% Growth
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Summer Steals / Product Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="col-span-12 lg:col-span-6 space-y-4"
            >
              {/* Summer Steals */}
              <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Summer Steals</h3>
                  <ChevronDown className="w-4 h-4 text-white/40" />
                </div>
                
                {/* Product list would go here - simplified */}
                <div className="text-white/40 text-sm">
                  Trending products and deals...
                </div>
              </div>

              {/* Product Performance */}
              <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Product Performance</h3>
                  <ArrowUpRight className="w-4 h-4 text-white/40" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/40">360 CC Camera</p>
                    <p className="text-lg font-semibold mt-1">{liveStats.isLoading ? '...' : liveStats.totalProjects || 12}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/40">Airpods 2nd Gen</p>
                    <p className="text-lg font-semibold mt-1">{liveStats.isLoading ? '...' : liveStats.activeUsers || 45}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Connected Tools Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="col-span-12 bg-[#1a1a1a] border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-medium">Connected Tools</h3>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                    {onlineToolsCount}/{toolStatus.length} online
                  </span>
                </div>
                <button className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {toolStatus.map((tool) => (
                  <ToolStatusCard 
                    key={tool.id} 
                    tool={tool} 
                    onClick={() => handleToolClick(tool.id)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Live Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="col-span-12 lg:col-span-4 bg-[#1a1a1a] border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">Live Activity</h3>
                  {liveActivities.length > 0 && (
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
                <span className="text-xs text-white/40">See all</span>
              </div>
              
              <div className="space-y-3">
                {liveActivities.length === 0 ? (
                  <div className="text-center py-6">
                    <Activity className="w-8 h-8 text-white/20 mx-auto mb-2" />
                    <p className="text-white/40 text-xs">No recent activity</p>
                  </div>
                ) : (
                  liveActivities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-medium flex-shrink-0">
                        {activity.user.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs">
                          <span className="font-medium">{activity.user}</span>{" "}
                          <span className="text-white/40">{activity.action}</span>{" "}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-[10px] text-white/30 mt-0.5 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-[10px] text-white/30 text-center">
                  Last updated: {formatRelativeTime(liveStats.lastUpdated)}
                </p>
              </div>
            </motion.div>

            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="col-span-12 lg:col-span-8 bg-[#1a1a1a] border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Recent Projects</h3>
                <button className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
                  View all
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              
              <div className="space-y-3">
                {projectsLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-white/40" />
                  </div>
                ) : recentProjects.length === 0 ? (
                  <div className="text-center py-6">
                    <FolderOpen className="w-8 h-8 text-white/20 mx-auto mb-2" />
                    <p className="text-white/40 text-xs">No projects yet</p>
                  </div>
                ) : (
                  recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <FolderOpen className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{project.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ 
                                width: `${project.progress}%`,
                                backgroundColor: ACCENT_COLOR
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-white/40">{project.progress}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-white/40">
                        <Users className="w-3 h-3" />
                        {project.team}
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/30" />
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Tasks Due Today Banner */}
          {!tasksLoading && tasksDueToday > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-4 bg-gradient-to-r from-[#D4FF00]/20 to-green-500/20 border border-[#D4FF00]/30 rounded-2xl p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#D4FF00]/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-[#D4FF00]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#D4FF00]">
                      {tasksDueToday} task{tasksDueToday !== 1 ? 's' : ''} due today
                    </h4>
                    <p className="text-white/60 text-sm mt-1">
                      Review and complete them to stay on track.
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#D4FF00] text-black px-5 py-2.5 rounded-xl font-medium text-sm"
                >
                  View Tasks
                </motion.button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
