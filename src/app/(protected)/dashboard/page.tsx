"use client";

import { TaskSummaryCard } from "@/src/components/ui/Cards/TaskSummaryCard";
import { Card } from "@/src/components/ui/Cards/Card";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";

const burndownData = [
  { day: "D1", ideal: 100, actual: 100 },
  { day: "D2", ideal: 88, actual: 82 },
  { day: "D3", ideal: 75, actual: 70 },
  { day: "D4", ideal: 63, actual: 55 },
  { day: "D5", ideal: 50, actual: 62 },
  { day: "D6", ideal: 38, actual: null },
  { day: "D7", ideal: 25, actual: null },
  { day: "D8", ideal: 13, actual: null },
];

const tasks = [
  { text: "Implement JWT refresh token logic", done: false, priority: "High", pts: 5 },
  { text: "Set up project entity schema", done: true, priority: null, pts: 3 },
  { text: "Build sidebar role gating", done: false, priority: "Med", pts: 2 },
  { text: "Design dashboard layout", done: false, priority: "Low", pts: 1 },
  { text: "Auth API integration", done: true, priority: null, pts: 3 },
];

const bugs = [
  { title: "Login token not refreshing on expiry", severity: "Critical", status: "Open" },
  { title: "Company delete cascade fails", severity: "Critical", status: "Open" },
  { title: "Sidebar flickers on mobile", severity: "High", status: "In progress" },
  { title: "Table pagination resets on sort", severity: "Medium", status: "Open" },
];

const activity = [
  { user: "Sara", action: 'moved "Auth API integration" to Done', time: "2 min ago", color: "bg-brand" },
  { user: "You", action: "logged a critical bug on token refresh", time: "18 min ago", color: "bg-red-500" },
  { user: "Kamal", action: 'opened PR #38 · "feat: sidebar gating"', time: "1 hr ago", color: "bg-green-600" },
  { user: "Priya", action: "added 3 tasks to the backlog", time: "3 hr ago", color: "bg-yellow-600" },
];

const team = [
  { initials: "JD", name: "James Doe", role: "Developer", tasks: 7, color: "bg-purple-600" },
  { initials: "SK", name: "Sara Kim", role: "QA Engineer", tasks: 4, color: "bg-green-600" },
  { initials: "KR", name: "Kamal Rao", role: "Developer", tasks: 5, color: "bg-yellow-600" },
  { initials: "PL", name: "Priya Lim", role: "Product Owner", tasks: 2, color: "bg-pink-700" },
];

const priorityStyles: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Med: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

const severityStyles: Record<string, string> = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-yellow-100 text-yellow-700",
};

export default function Dashboard() {
  return (
    <div className="flex flex-col w-full flex-1 min-h-0 overflow-auto p-4 gap-4">

      <div className="flex w-full justify-between items-start">
        <div className="flex flex-col gap-0.5">
          <div className="text-text font-bold text-base">Good Morning, James 👋</div>
          <span className="text-muted text-xs">Alpha release · Sprint 3 active · 6 days left</span>
        </div>
        <button className="btn-primary">+ Add task</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <TaskSummaryCard title="My open tasks" noOfItems={7} subText="3 due this week" color="bg-purple-500" />
        <TaskSummaryCard title="Sprint progress" noOfItems="62%" subText="+8% since yesterday" color="bg-green-500" />
        <TaskSummaryCard title="Open bugs" noOfItems={4} subText="2 critical · 2 high" color="bg-red-500" />
        <TaskSummaryCard title="Open PRs" noOfItems={3} subText="Awaiting review" color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card title="Sprint 3 — board snapshot" linkText="Go to board" className="md:col-span-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-text">Alpha release · 6 days left</span>
            <span className="text-brand font-semibold">62%</span>
          </div>
          <div className="h-1.5 bg-brand-soft rounded-full overflow-hidden mb-3">
            <div className="h-full bg-brand rounded-full" style={{ width: "62%" }} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "To do", count: 5, done: false },
              { label: "In progress", count: 4, done: false },
              { label: "In review", count: 3, done: false },
              { label: "Done", count: 12, done: true },
            ].map((col) => (
              <div key={col.label} className={`rounded-lg p-2 ${col.done ? "bg-green-50" : "bg-brand-soft"}`}>
                <div className={`text-[9px] font-bold uppercase mb-1 ${col.done ? "text-green-700" : "text-muted"}`}>{col.label}</div>
                <div className={`text-lg font-bold ${col.done ? "text-green-800" : "text-text"}`}>{col.count}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Burndown">
          <div className="text-[10px] text-muted mb-2">pts remaining</div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={burndownData} barGap={1}>
              <XAxis dataKey="day" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <Bar dataKey="ideal" fill="rgb(var(--brand-soft))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="actual" radius={[2, 2, 0, 0]}>
                {burndownData.map((entry, i) => (
                  <Cell key={i} fill={entry.actual && entry.actual > (entry.ideal ?? 0) ? "#e24b4a" : "rgb(var(--brand))"} fillOpacity={0.6} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-3 mt-1">
            {[{ label: "Ideal", color: "bg-brand-soft border border-border" }, { label: "Actual", color: "bg-brand opacity-60" }, { label: "Behind", color: "bg-red-400 opacity-60" }].map((l) => (
              <div key={l.label} className="flex items-center gap-1 text-[9px] text-muted">
                <div className={`w-2 h-2 rounded-sm ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card title="My tasks" linkText="View all">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border-subtle last:border-0">
              <div className={`w-3 h-3 rounded flex-shrink-0 border ${task.done ? "bg-brand border-brand" : "border-border"}`} />
              <span className={`text-xs flex-1 ${task.done ? "line-through text-muted" : "text-text"}`}>{task.text}</span>
              {task.priority && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${priorityStyles[task.priority]}`}>{task.priority}</span>}
              <span className="text-[10px] text-muted bg-brand-soft px-1.5 py-0.5 rounded">{task.pts} pts</span>
            </div>
          ))}
        </Card>

        <Card title="Open bugs" linkText="View all">
          {bugs.map((bug, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border-subtle last:border-0">
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap ${severityStyles[bug.severity]}`}>{bug.severity}</span>
              <span className="text-xs text-text flex-1">{bug.title}</span>
              <span className="text-[10px] text-muted bg-brand-soft px-1.5 py-0.5 rounded whitespace-nowrap">{bug.status}</span>
            </div>
          ))}
        </Card>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card title="Recent activity">
          {activity.map((item, i) => (
            <div key={i} className="flex gap-2 py-1.5 border-b border-border-subtle last:border-0">
              <div className="flex flex-col items-center pt-1">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.color}`} />
                {i < activity.length - 1 && <div className="w-px flex-1 bg-border-subtle mt-1" />}
              </div>
              <div className="flex-1">
                <div className="text-xs text-text"><strong>{item.user}</strong> {item.action}</div>
                <div className="text-[10px] text-muted mt-0.5">{item.time}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card title="Team workload" linkText="Manage">
          {team.map((member, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border-subtle last:border-0">
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white ${member.color}`}>{member.initials}</div>
              <div className="flex-1">
                <div className="text-xs font-medium text-text">{member.name}</div>
                <div className="text-[10px] text-muted">{member.role}</div>
              </div>
              <span className="text-xs font-semibold text-brand">{member.tasks} tasks</span>
            </div>
          ))}
        </Card>
      </div>

    </div>
  );
}