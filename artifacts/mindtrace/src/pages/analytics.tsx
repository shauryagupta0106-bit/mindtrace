import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useGetAnalytics, getGetAnalyticsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, TrendingUp, Zap, Tag, Calendar, Target } from "lucide-react";
import { getEmotionDetails } from "@/lib/emotion-utils";

const CHART_COLORS = [
  "hsl(250 82% 70%)",
  "hsl(330 81% 60%)",
  "hsl(172 60% 50%)",
  "hsl(38 92% 55%)",
  "hsl(197 71% 52%)",
  "hsl(280 68% 60%)",
  "hsl(16 90% 58%)",
];

const TOOLTIP_STYLE = {
  background: "hsl(228 22% 10%)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "hsl(220 18% 92%)",
  fontSize: 12,
  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
};

const TICK_COLOR = "hsl(220 10% 48%)";
const GRID_COLOR = "rgba(255,255,255,0.04)";

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" as const },
});

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useGetAnalytics({
    query: { queryKey: getGetAnalyticsQueryKey() },
  });
  const safeAnalytics = analytics
    ? {
        totalThoughts: Number(analytics.totalThoughts ?? 0),
        avgIntensity: Number(analytics.avgIntensity ?? 0),
        streak: Number(analytics.streak ?? 0),
        cognitiveScore: Number(analytics.cognitiveScore ?? 0),
        mostActiveDay: analytics.mostActiveDay ?? "",
        topTags: Array.isArray(analytics.topTags) ? analytics.topTags : [],
        dailyActivity: Array.isArray(analytics.dailyActivity) ? analytics.dailyActivity : [],
        emotionBreakdown: Array.isArray(analytics.emotionBreakdown) ? analytics.emotionBreakdown : [],
      }
    : null;

  if (isLoading) {
    return (
      <div className="space-y-6 pb-10">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (!safeAnalytics) {
    return (
      <div className="glass-card p-14 text-center flex flex-col items-center">
        <Brain className="w-14 h-14 text-primary/40 mx-auto mb-4 float-icon" />
        <h3 className="font-semibold mb-1">No data yet</h3>
        <p className="text-muted-foreground text-sm">Log some thoughts to see your analytics.</p>
      </div>
    );
  }

  const statCards = [
    { icon: Brain,    label: "Total Thoughts", value: String(safeAnalytics.totalThoughts),            color: "text-primary",   orb: "bg-primary/15",     iconBg: "bg-primary/20 border-primary/20" },
    { icon: TrendingUp, label: "Avg Intensity", value: safeAnalytics.avgIntensity.toFixed(1),        color: "text-accent",    orb: "bg-accent/15",      iconBg: "bg-accent/20 border-accent/20" },
    { icon: Zap,      label: "Current Streak",  value: `${safeAnalytics.streak}d`,                   color: "text-amber-400", orb: "bg-amber-500/15",   iconBg: "bg-amber-500/20 border-amber-500/20" },
    { icon: Target,   label: "Cognitive Score", value: `${safeAnalytics.cognitiveScore.toFixed(0)}%`, color: safeAnalytics.cognitiveScore >= 60 ? "text-emerald-400" : "text-orange-400", orb: safeAnalytics.cognitiveScore >= 60 ? "bg-emerald-500/15" : "bg-orange-500/15", iconBg: safeAnalytics.cognitiveScore >= 60 ? "bg-emerald-500/20 border-emerald-500/20" : "bg-orange-500/20 border-orange-500/20" },
    { icon: Calendar, label: "Most Active Day",  value: safeAnalytics.mostActiveDay || "—",           color: "text-blue-400",  orb: "bg-blue-500/15",    iconBg: "bg-blue-500/20 border-blue-500/20" },
    { icon: Tag,      label: "Top Tags",         value: safeAnalytics.topTags.slice(0, 2).join(", ") || "—", color: "text-violet-400", orb: "bg-violet-500/15", iconBg: "bg-violet-500/20 border-violet-500/20" },
  ];

  const dateFormatter = (d: string) => {
    const dt = new Date(d);
    return `${dt.getMonth() + 1}/${dt.getDate()}`;
  };

  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">Your cognitive patterns and insights</p>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            {...stagger(i)}
            className="stat-card p-5"
            data-testid={`stat-${s.label.toLowerCase().replace(/ /g, "-")}`}
          >
            <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-xl ${s.orb}`} />
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border mb-4 ${s.iconBg}`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-xs text-muted-foreground mb-1 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold tracking-tight truncate ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Intensity Over Time ── */}
      {safeAnalytics.dailyActivity.length > 0 && (
        <motion.div {...stagger(6)} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
            </div>
            <h3 className="font-semibold">Emotion Intensity Over Time</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={safeAnalytics.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: TICK_COLOR }} tickFormatter={dateFormatter} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: TICK_COLOR }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="avgIntensity"
                stroke="hsl(250 82% 70%)"
                strokeWidth={2.5}
                dot={{ fill: "hsl(250 82% 70%)", r: 3.5, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "hsl(330 81% 60%)", strokeWidth: 0 }}
                name="Avg Intensity"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* ── Thoughts Per Day ── */}
      {safeAnalytics.dailyActivity.length > 0 && (
        <motion.div {...stagger(7)} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <h3 className="font-semibold">Thoughts Per Day</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={safeAnalytics.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: TICK_COLOR }} tickFormatter={dateFormatter} />
              <YAxis tick={{ fontSize: 11, fill: TICK_COLOR }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="count" fill="hsl(330 81% 60%)" radius={[5, 5, 0, 0]} name="Thoughts" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* ── Emotion Distribution + Insights ── */}
      {safeAnalytics.emotionBreakdown.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div {...stagger(8)} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <h3 className="font-semibold">Emotion Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={safeAnalytics.emotionBreakdown}
                  dataKey="count"
                  nameKey="emotion"
                  cx="50%" cy="50%"
                  innerRadius={56} outerRadius={88}
                  paddingAngle={3}
                >
                  {safeAnalytics.emotionBreakdown.map((entry: any, i: number) => (
                    <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend
                  formatter={(v) => (
                    <span style={{ color: TICK_COLOR, textTransform: "capitalize", fontSize: 11 }}>
                      {getEmotionDetails(v).emoji} {v}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Insight Cards */}
          <motion.div {...stagger(9)} className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">Insights</h3>

            {safeAnalytics.mostActiveDay && (
              <div className="glass-card p-4 border-accent/20 hover:border-accent/35 transition-colors">
                <p className="text-[10px] text-accent uppercase tracking-widest mb-1.5 font-bold">Peak Day</p>
                <p className="text-sm">
                  You think most often on{" "}
                  <span className="text-accent font-semibold">{safeAnalytics.mostActiveDay}s</span>
                </p>
              </div>
            )}

            {safeAnalytics.emotionBreakdown[0] && (
              <div className="glass-card p-4 border-primary/20 hover:border-primary/35 transition-colors">
                <p className="text-[10px] text-primary uppercase tracking-widest mb-1.5 font-bold">Dominant Emotion</p>
                <p className="text-sm capitalize">
                  <span className="text-primary font-semibold mr-1">
                    {getEmotionDetails(safeAnalytics.emotionBreakdown[0].emotion).emoji} {safeAnalytics.emotionBreakdown[0].emotion}
                  </span>
                  appears {safeAnalytics.emotionBreakdown[0].count}×
                </p>
              </div>
            )}

            <div className="glass-card p-4 border-emerald-500/20 hover:border-emerald-500/35 transition-colors">
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1.5 font-bold">Cognitive Health</p>
              <p className="text-sm">
                Positive ratio:{" "}
                <span className={`font-bold ${safeAnalytics.cognitiveScore >= 60 ? "text-emerald-400" : "text-orange-400"}`}>
                  {safeAnalytics.cognitiveScore.toFixed(0)}%
                </span>
                {safeAnalytics.cognitiveScore >= 60 ? " — great work!" : " — try positive reflection."}
              </p>
            </div>

            {safeAnalytics.topTags.length > 0 && (
              <div className="glass-card p-4 border-violet-500/20 hover:border-violet-500/35 transition-colors">
                <p className="text-[10px] text-violet-400 uppercase tracking-widest mb-2 font-bold">Frequent Themes</p>
                <div className="flex flex-wrap gap-1.5">
                  {safeAnalytics.topTags.slice(0, 6).map((tag: any) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-full text-xs capitalize"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
