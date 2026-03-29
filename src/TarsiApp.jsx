// ╔══════════════════════════════════════════════════════════╗
// ║         TARSI FINANCE APP  ·  Single-file React          ║
// ║   Drop into Vite/Next.js  ·  Uses lucide-react+recharts  ║
// ╚══════════════════════════════════════════════════════════╝

import { useState, useEffect, useMemo } from "react";
import {
  Home, Wallet, Plus, BarChart3, Settings,
  ShoppingBag, Zap, Film, Heart, Briefcase, Gift,
  MoreHorizontal, Target, X, Bell,
  Utensils, Bus, PiggyBank, ChevronRight,
  Download, TrendingUp, TrendingDown, AlertTriangle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const T = {
  bg:         "#F0F5EC",
  card:       "#FFFFFF",
  primary:    "#2E7D32",
  primaryL:   "#43A047",
  accent:     "#E8F5E9",
  accentDark: "#C8E6C9",
  text:       "#1A2A1A",
  textSec:    "#4A6641",
  textMut:    "#8FAA8A",
  border:     "rgba(46,125,50,0.10)",
  red:        "#C62828",
  redL:       "#FFEBEE",
  amber:      "#E65100",
  amberL:     "#FFF3E0",
  shadow:     "0 2px 12px rgba(0,0,0,0.05)",
  shadowMd:   "0 6px 24px rgba(0,0,0,0.08)",
};

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
const CATS = [
  { id:"food",   label:"Food",      Icon:Utensils,   color:"#E64A19", bg:"#FBE9E7" },
  { id:"trans",  label:"Transport", Icon:Bus,        color:"#0277BD", bg:"#E1F5FE" },
  { id:"shop",   label:"Shopping",  Icon:ShoppingBag,color:"#6A1B9A", bg:"#F3E5F5" },
  { id:"bills",  label:"Bills",     Icon:Zap,        color:"#EF6C00", bg:"#FFF3E0" },
  { id:"health", label:"Health",    Icon:Heart,      color:"#C62828", bg:"#FFEBEE" },
  { id:"fun",    label:"Fun",       Icon:Film,       color:"#1565C0", bg:"#E3F2FD" },
  { id:"salary", label:"Salary",    Icon:Briefcase,  color:"#2E7D32", bg:"#E8F5E9" },
  { id:"gift",   label:"Gifts",     Icon:Gift,       color:"#AD1457", bg:"#FCE4EC" },
  { id:"save",   label:"Savings",   Icon:PiggyBank,  color:"#00695C", bg:"#E0F2F1" },
  { id:"other",  label:"Other",     Icon:MoreHorizontal, color:"#546E7A", bg:"#ECEFF1" },
];

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().slice(0, 10);
const D = (n) => {
  const d = new Date(Date.now() - n * 86400000);
  return d.toISOString().slice(0, 10);
};

const SEED = {
  wallets: [
    { id:"w1", name:"Cash",        emoji:"💵", type:"cash",    balance:2500,  color:"#43A047" },
    { id:"w2", name:"BDO Savings", emoji:"🏦", type:"bank",    balance:45000, color:"#1565C0" },
    { id:"w3", name:"GCash",       emoji:"📱", type:"ewallet", balance:3200,  color:"#0070EB" },
  ],
  transactions: [
    { id:"t1",  type:"expense", amount:250,   cat:"food",   walletId:"w1", note:"Lunch – Mang Inasal",   date:D(0)  },
    { id:"t2",  type:"income",  amount:25000, cat:"salary", walletId:"w2", note:"March salary",          date:D(4)  },
    { id:"t3",  type:"expense", amount:150,   cat:"trans",  walletId:"w1", note:"Grab to work",          date:D(1)  },
    { id:"t4",  type:"expense", amount:1200,  cat:"shop",   walletId:"w2", note:"New headphones",        date:D(2)  },
    { id:"t5",  type:"expense", amount:85,    cat:"food",   walletId:"w1", note:"Bo's Coffee",           date:D(2)  },
    { id:"t6",  type:"expense", amount:500,   cat:"bills",  walletId:"w2", note:"Electric bill",         date:D(3)  },
    { id:"t7",  type:"expense", amount:350,   cat:"health", walletId:"w1", note:"Vitamins + meds",       date:D(4)  },
    { id:"t8",  type:"income",  amount:2000,  cat:"gift",   walletId:"w3", note:"Birthday money",        date:D(5)  },
    { id:"t9",  type:"expense", amount:300,   cat:"fun",    walletId:"w3", note:"Netflix + Spotify",     date:D(6)  },
    { id:"t10", type:"expense", amount:450,   cat:"food",   walletId:"w1", note:"Dinner with family",    date:D(7)  },
    { id:"t11", type:"expense", amount:780,   cat:"shop",   walletId:"w2", note:"Clothes – SM",          date:D(8)  },
    { id:"t12", type:"income",  amount:5000,  cat:"gift",   walletId:"w2", note:"Freelance payment",     date:D(9)  },
  ],
  budgets: [
    { id:"b1", cat:"food",  limit:5000 },
    { id:"b2", cat:"trans", limit:2000 },
    { id:"b3", cat:"shop",  limit:3000 },
    { id:"b4", cat:"bills", limit:5000 },
  ],
  goals: [
    { id:"g1", name:"Emergency Fund", emoji:"🛡️", target:50000, saved:12000, deadline:"2026-12-31" },
    { id:"g2", name:"New Laptop",      emoji:"💻", target:35000, saved:8500,  deadline:"2026-06-30" },
    { id:"g3", name:"Japan Trip",      emoji:"✈️", target:80000, saved:22000, deadline:"2027-01-15" },
  ],
  debts: [
    { id:"d1", name:"Marco",  direction:"owe",  amount:1500, due:"2026-04-15", done:false },
    { id:"d2", name:"Kris",   direction:"owes", amount:800,  due:"2026-04-01", done:false },
  ],
};

// ─── STORE HOOK ───────────────────────────────────────────────────────────────
function useStore() {
  const [data, setData] = useState(() => {
    try {
      const s = localStorage.getItem("tarsi_v3");
      return s ? JSON.parse(s) : SEED;
    } catch { return SEED; }
  });

  useEffect(() => {
    try { localStorage.setItem("tarsi_v3", JSON.stringify(data)); } catch {}
  }, [data]);

  return {
    data,

    addTransaction(txn) {
      const t = { ...txn, id: "tx_" + Date.now() };
      setData(d => ({
        ...d,
        transactions: [t, ...d.transactions],
        wallets: d.wallets.map(w =>
          w.id !== txn.walletId ? w :
          { ...w, balance: w.balance + (txn.type === "income" ? txn.amount : -txn.amount) }
        ),
      }));
    },

    deleteTransaction(id) {
      setData(d => {
        const txn = d.transactions.find(t => t.id === id);
        if (!txn) return d;
        return {
          ...d,
          transactions: d.transactions.filter(t => t.id !== id),
          wallets: d.wallets.map(w =>
            w.id !== txn.walletId ? w :
            { ...w, balance: w.balance - (txn.type === "income" ? txn.amount : -txn.amount) }
          ),
        };
      });
    },

    contributeToGoal(goalId, amount, walletId) {
      setData(d => ({
        ...d,
        goals:   d.goals.map(g => g.id === goalId ? { ...g, saved: g.saved + amount } : g),
        wallets: d.wallets.map(w => w.id === walletId ? { ...w, balance: w.balance - amount } : w),
      }));
    },

    toggleDebt(id) {
      setData(d => ({
        ...d,
        debts: d.debts.map(x => x.id === id ? { ...x, done: !x.done } : x),
      }));
    },

    resetData() { setData(SEED); },
  };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt  = (n) => "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const pct  = (a, b) => b === 0 ? 0 : Math.min((a / b) * 100, 100);
const cat  = (id) => CATS.find(c => c.id === id) ?? CATS[CATS.length - 1];
const ym   = (date) => date?.slice(0, 7) ?? "";
const thisMonth = TODAY.slice(0, 7);

function relDate(d) {
  if (d === TODAY) return "Today";
  const yest = D(1);
  if (d === yest) return "Yesterday";
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}

// ─── UI ATOMS ─────────────────────────────────────────────────────────────────
function Card({ style, children }) {
  return (
    <div style={{
      background: T.card, borderRadius: 18, border: `1px solid ${T.border}`,
      boxShadow: T.shadow, ...style,
    }}>
      {children}
    </div>
  );
}

function Pill({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 16px", borderRadius: 99, fontSize: 13, fontWeight: 500, cursor: "pointer",
      border: `1.5px solid ${active ? (color ?? T.primary) : T.border}`,
      background: active ? (color ?? T.primary) : T.card,
      color: active ? "#fff" : T.textSec, transition: "all 0.15s",
    }}>
      {label}
    </button>
  );
}

function TxnRow({ txn, onClick }) {
  const c = cat(txn.cat);
  const Icon = c.Icon;
  const income = txn.type === "income";
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
      cursor: "pointer", transition: "background 0.12s",
    }}
    onMouseEnter={e => e.currentTarget.style.background = T.accent}
    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 13, flexShrink: 0,
        background: c.bg, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={18} color={c.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: T.text,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {txn.note || c.label}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: T.textMut }}>
          {c.label} · {relDate(txn.date)}
        </p>
      </div>
      <span style={{ fontWeight: 600, fontSize: 14, color: income ? T.primary : T.red, flexShrink: 0 }}>
        {income ? "+" : "−"}{fmt(txn.amount)}
      </span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: T.border, margin: "0 16px" }} />;
}

function SectionHeader({ label, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 16px", marginBottom: 8 }}>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.textMut,
        textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
      {right}
    </div>
  );
}

function BudgetBar({ budget, spent }) {
  const c = cat(budget.cat);
  const Icon = c.Icon;
  const p = pct(spent, budget.limit);
  const over = spent > budget.limit;
  const warn = !over && p > 80;
  const barColor = over ? T.red : warn ? T.amber : T.primary;

  return (
    <div style={{ padding: "10px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: c.bg,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={13} color={c.color} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{c.label}</span>
          {over && <span style={{ fontSize: 11, color: T.red, fontWeight: 600 }}>OVER</span>}
        </div>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: barColor }}>{fmt(spent)}</span>
          <span style={{ fontSize: 12, color: T.textMut }}> / {fmt(budget.limit)}</span>
        </div>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: T.accent, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, width: `${p}%`,
          background: barColor, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function GoalCard({ goal, onContribute }) {
  const p = pct(goal.saved, goal.target);
  const remaining = goal.target - goal.saved;
  const days = Math.ceil((new Date(goal.deadline) - new Date()) / 86400000);

  return (
    <Card style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 28 }}>{goal.emoji}</span>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text }}>{goal.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: T.textMut }}>
              {days > 0 ? `${days}d left` : "Deadline passed"} · {Math.round(p)}%
            </p>
          </div>
        </div>
        <button onClick={onContribute} style={{
          background: T.primary, color: "#fff", border: "none",
          borderRadius: 99, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>
          + Add
        </button>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: T.accent, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ height: "100%", borderRadius: 99, width: `${p}%`,
          background: `linear-gradient(90deg, ${T.primaryL}, ${T.primary})`,
          transition: "width 0.5s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: T.primary }}>{fmt(goal.saved)}</span>
        <span style={{ fontSize: 12, color: T.textMut }}>{fmt(remaining)} to go · {fmt(goal.target)}</span>
      </div>
    </Card>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardView({ data }) {
  const totalBalance = data.wallets.reduce((s, w) => s + w.balance, 0);
  const monthTxns = data.transactions.filter(t => ym(t.date) === thisMonth);
  const income  = monthTxns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = monthTxns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = D(6 - i);
    const exp  = data.transactions.filter(t => t.date === date && t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { day: new Date(date).toLocaleDateString("en", { weekday: "short" }), exp };
  });

  const recent = data.transactions.slice(0, 6);

  return (
    <div style={{ paddingBottom: 8 }}>

      {/* ── Balance Card ── */}
      <div style={{
        margin: "0 16px 20px",
        background: "linear-gradient(140deg, #2E7D32 0%, #1B5E20 100%)",
        borderRadius: 22, padding: "24px 24px 20px",
        boxShadow: "0 8px 32px rgba(46,125,50,0.28)",
      }}>
        <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.65)",
          letterSpacing: "0.08em", textTransform: "uppercase" }}>Total Balance</p>
        <p style={{ margin: "5px 0 22px", fontSize: 38, fontWeight: 800, color: "#fff",
          letterSpacing: "-0.03em", lineHeight: 1 }}>
          {fmt(totalBalance)}
        </p>
        <div style={{ display: "flex", gap: 24 }}>
          {[
            { label: "↑ Income",  val: income,  color: "#A5D6A7" },
            { label: "↓ Spent",   val: expense, color: "#FFCDD2" },
          ].map(row => (
            <div key={row.label}>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{row.label}</p>
              <p style={{ margin: "3px 0 0", fontSize: 16, fontWeight: 700, color: row.color }}>{fmt(row.val)}</p>
            </div>
          ))}
          <div style={{ flexGrow: 1 }} />
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Net</p>
            <p style={{ margin: "3px 0 0", fontSize: 16, fontWeight: 700,
              color: income - expense >= 0 ? "#A5D6A7" : "#FFCDD2" }}>
              {income - expense >= 0 ? "+" : "−"}{fmt(Math.abs(income - expense))}
            </p>
          </div>
        </div>
      </div>

      {/* ── Wallets Scroll ── */}
      <div style={{ marginBottom: 20 }}>
        <SectionHeader label="Wallets" />
        <div style={{ display: "flex", gap: 10, paddingLeft: 16, paddingRight: 16,
          overflowX: "auto", scrollbarWidth: "none" }}>
          {data.wallets.map(w => (
            <div key={w.id} style={{
              minWidth: 140, flexShrink: 0,
              background: T.card, borderRadius: 16, padding: "14px 16px",
              border: `1px solid ${T.border}`, boxShadow: T.shadow,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{w.emoji}</span>
                <span style={{ fontSize: 12, color: T.textMut, fontWeight: 500 }}>{w.name}</span>
              </div>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: T.text, letterSpacing: "-0.01em" }}>
                {fmt(w.balance)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Spending Chart ── */}
      <div style={{ margin: "0 16px 20px" }}>
        <Card style={{ padding: "16px 16px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text }}>7-Day Spending</p>
            <span style={{ fontSize: 12, color: T.textMut }}>Last week</span>
          </div>
          <ResponsiveContainer width="100%" height={90}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.primary} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={T.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: T.textMut }}
                axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => [fmt(v), "Spent"]}
                contentStyle={{ fontSize: 12, borderRadius: 10, border: `1px solid ${T.border}`,
                  background: T.card, color: T.text }}
                cursor={{ stroke: T.accentDark, strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="exp" stroke={T.primary} strokeWidth={2}
                fill="url(#gfill)" dot={false} activeDot={{ r: 4, fill: T.primary }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Budget Preview ── */}
      {data.budgets.length > 0 && (
        <div style={{ margin: "0 16px 20px" }}>
          <SectionHeader label="Budget" right={
            <span style={{ fontSize: 12, color: T.primary, fontWeight: 500 }}>This Month</span>
          } />
          <Card style={{ padding: "4px 16px 8px" }}>
            {data.budgets.slice(0, 3).map(b => {
              const spent = monthTxns.filter(t => t.cat === b.cat && t.type === "expense")
                .reduce((s, t) => s + t.amount, 0);
              return <BudgetBar key={b.id} budget={b} spent={spent} />;
            })}
          </Card>
        </div>
      )}

      {/* ── Recent Transactions ── */}
      <div style={{ margin: "0 16px" }}>
        <SectionHeader label="Recent" />
        <Card style={{ overflow: "hidden" }}>
          {recent.map((t, i) => (
            <div key={t.id}>
              <TxnRow txn={t} onClick={() => {}} />
              {i < recent.length - 1 && <Divider />}
            </div>
          ))}
        </Card>
      </div>

    </div>
  );
}

// ─── WALLETS VIEW ─────────────────────────────────────────────────────────────
function WalletView({ data }) {
  const total = data.wallets.reduce((s, w) => s + w.balance, 0);

  return (
    <div style={{ padding: "0 16px 16px" }}>
      <div style={{
        background: "linear-gradient(140deg, #1565C0, #0D47A1)",
        borderRadius: 22, padding: "22px 24px", marginBottom: 20,
        boxShadow: "0 8px 28px rgba(21,101,192,0.25)",
      }}>
        <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.6)",
          textTransform: "uppercase", letterSpacing: "0.08em" }}>All Wallets</p>
        <p style={{ margin: "5px 0 0", fontSize: 34, fontWeight: 800, color: "#fff",
          letterSpacing: "-0.02em" }}>{fmt(total)}</p>
      </div>

      {data.wallets.map(w => {
        const walletTxns = data.transactions.filter(t => t.walletId === w.id);
        const inc = walletTxns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const exp = walletTxns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
        const recent3 = walletTxns.slice(0, 3);

        return (
          <Card key={w.id} style={{ padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: w.color + "22",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  {w.emoji}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text }}>{w.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: T.textMut, textTransform: "capitalize" }}>
                    {w.type}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.text }}>{fmt(w.balance)}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: T.textMut }}>balance</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 0, borderRadius: 10, overflow: "hidden",
              border: `1px solid ${T.border}`, marginBottom: recent3.length ? 12 : 0 }}>
              {[
                { label: "Income", val: inc, color: T.primary },
                { label: "Spent",  val: exp, color: T.red },
              ].map((s, i) => (
                <div key={s.label} style={{ flex: 1, padding: "10px 14px",
                  borderRight: i === 0 ? `1px solid ${T.border}` : "none" }}>
                  <p style={{ margin: 0, fontSize: 11, color: T.textMut }}>{s.label}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 700, color: s.color }}>{fmt(s.val)}</p>
                </div>
              ))}
            </div>

            {recent3.length > 0 && (
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 8 }}>
                {recent3.map(t => {
                  const c = cat(t.cat);
                  return (
                    <div key={t.id} style={{ display: "flex", justifyContent: "space-between",
                      padding: "4px 0", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: T.textSec, overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>
                        {t.note || c.label}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600,
                        color: t.type === "income" ? T.primary : T.red }}>
                        {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ─── HISTORY VIEW ─────────────────────────────────────────────────────────────
function HistoryView({ data, onDelete }) {
  const [filter, setFilter]  = useState("all");
  const [catFilt, setCatFilt] = useState("all");

  const filtered = useMemo(() => {
    return data.transactions.filter(t => {
      if (filter !== "all" && t.type !== filter) return false;
      if (catFilt !== "all" && t.cat !== catFilt) return false;
      return true;
    });
  }, [data.transactions, filter, catFilt]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(t => { (g[t.date] ??= []).push(t); });
    return Object.entries(g).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const totalIncome  = filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <div style={{ paddingBottom: 8 }}>
      {/* Summary strip */}
      <div style={{ display: "flex", gap: 0, margin: "0 16px 16px",
        background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
        {[
          { label: "Income",  val: totalIncome,  color: T.primary },
          { label: "Expense", val: totalExpense, color: T.red },
          { label: "Net",     val: totalIncome - totalExpense, color: totalIncome >= totalExpense ? T.primary : T.red },
        ].map((s, i) => (
          <div key={s.label} style={{ flex: 1, padding: "12px 12px",
            borderRight: i < 2 ? `1px solid ${T.border}` : "none", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 11, color: T.textMut }}>{s.label}</p>
            <p style={{ margin: "3px 0 0", fontSize: 14, fontWeight: 700, color: s.color }}>
              {s.val >= 0 ? "" : "−"}{fmt(Math.abs(s.val))}
            </p>
          </div>
        ))}
      </div>

      {/* Type filter */}
      <div style={{ display: "flex", gap: 8, padding: "0 16px 12px" }}>
        {[["all","All"],["income","Income"],["expense","Expense"]].map(([v, l]) => (
          <Pill key={v} label={l} active={filter === v}
            color={v === "income" ? T.primary : v === "expense" ? T.red : T.primary}
            onClick={() => setFilter(v)} />
        ))}
      </div>

      {/* Cat filter */}
      <div style={{ display: "flex", gap: 8, paddingLeft: 16, paddingRight: 16,
        marginBottom: 16, overflowX: "auto", scrollbarWidth: "none" }}>
        <Pill label="All" active={catFilt === "all"} onClick={() => setCatFilt("all")} />
        {CATS.map(c => (
          <Pill key={c.id} label={c.label} active={catFilt === c.id}
            color={c.color} onClick={() => setCatFilt(c.id)} />
        ))}
      </div>

      {grouped.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: T.textMut }}>
          <p style={{ fontSize: 14 }}>No transactions found</p>
        </div>
      )}

      {grouped.map(([date, txns]) => (
        <div key={date} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "6px 16px 6px" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.textMut,
              textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {relDate(date)}
            </span>
            <span style={{ fontSize: 12, color: T.textMut }}>
              {txns.length} item{txns.length > 1 ? "s" : ""}
            </span>
          </div>
          <Card style={{ margin: "0 16px", overflow: "hidden" }}>
            {txns.map((t, i) => (
              <div key={t.id}>
                <TxnRow txn={t} onClick={() => {
                  if (window.confirm(`Delete "${t.note || cat(t.cat).label}"?`)) onDelete(t.id);
                }} />
                {i < txns.length - 1 && <Divider />}
              </div>
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
}

// ─── PLAN VIEW (Budget + Goals + Debts) ───────────────────────────────────────
function PlanView({ data, onContribute, onToggleDebt }) {
  const [tab, setTab] = useState("budgets");
  const monthTxns = data.transactions.filter(t => ym(t.date) === thisMonth);

  const totalBudget  = data.budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent   = monthTxns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const remaining    = totalBudget - totalSpent;

  return (
    <div style={{ paddingBottom: 8 }}>

      {/* Tab Switcher */}
      <div style={{ display: "flex", gap: 0, margin: "0 16px 16px",
        background: T.accent, borderRadius: 14, padding: 4 }}>
        {[["budgets","💰 Budget"],["goals","🎯 Goals"],["debts","🤝 Debts"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: "9px 6px", borderRadius: 11, fontSize: 13, fontWeight: 600,
            border: "none", cursor: "pointer", transition: "all 0.15s",
            background: tab === id ? T.card : "transparent",
            color: tab === id ? T.primary : T.textSec,
            boxShadow: tab === id ? T.shadow : "none",
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── BUDGETS ── */}
      {tab === "budgets" && (
        <>
          <div style={{ display: "flex", gap: 10, padding: "0 16px 16px" }}>
            {[
              { label: "Budget",    val: fmt(totalBudget), color: T.text },
              { label: "Spent",     val: fmt(totalSpent),  color: T.red },
              { label: "Left",      val: fmt(Math.abs(remaining)), color: remaining >= 0 ? T.primary : T.red },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: T.card, borderRadius: 14,
                border: `1px solid ${T.border}`, padding: "12px", textAlign: "center",
                boxShadow: T.shadow }}>
                <p style={{ margin: 0, fontSize: 11, color: T.textMut }}>{s.label}</p>
                <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 800, color: s.color }}>{s.val}</p>
              </div>
            ))}
          </div>
          <div style={{ margin: "0 16px" }}>
            <Card style={{ padding: "4px 16px 10px" }}>
              {data.budgets.map(b => {
                const spent = monthTxns.filter(t => t.cat === b.cat && t.type === "expense")
                  .reduce((s, t) => s + t.amount, 0);
                return <BudgetBar key={b.id} budget={b} spent={spent} />;
              })}
            </Card>
          </div>
        </>
      )}

      {/* ── GOALS ── */}
      {tab === "goals" && (
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {data.goals.map(g => (
            <GoalCard key={g.id} goal={g} onContribute={() => onContribute(g)} />
          ))}
        </div>
      )}

      {/* ── DEBTS ── */}
      {tab === "debts" && (
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {data.debts.map(d => {
            const due = new Date(d.due);
            const overdue = due < new Date() && !d.done;
            return (
              <Card key={d.id} style={{ padding: "14px 16px",
                opacity: d.done ? 0.55 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text }}>
                        {d.direction === "owe" ? `You owe ${d.name}` : `${d.name} owes you`}
                      </p>
                      {overdue && (
                        <span style={{ fontSize: 11, background: T.redL, color: T.red,
                          padding: "2px 7px", borderRadius: 99, fontWeight: 600 }}>
                          Overdue
                        </span>
                      )}
                    </div>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: T.textMut }}>
                      Due {due.toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 18, fontWeight: 800,
                      color: d.direction === "owe" ? T.red : T.primary }}>
                      {fmt(d.amount)}
                    </p>
                    <button onClick={() => onToggleDebt(d.id)} style={{
                      fontSize: 11, background: d.done ? T.accent : T.amberL,
                      color: d.done ? T.primary : T.amber,
                      border: "none", borderRadius: 99, padding: "3px 10px",
                      cursor: "pointer", fontWeight: 600, marginTop: 4,
                    }}>
                      {d.done ? "✓ Settled" : "Mark settled"}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
}

// ─── SETTINGS VIEW ────────────────────────────────────────────────────────────
function SettingsView({ data, onReset }) {
  const total = data.wallets.reduce((s, w) => s + w.balance, 0);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `tarsi_backup_${TODAY}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const items = [
    {
      section: "Data",
      rows: [
        { emoji: "📤", label: "Export Backup (JSON)", action: exportJSON },
        { emoji: "📊", label: "Export as CSV (coming soon)", action: () => {} },
      ],
    },
    {
      section: "Preferences",
      rows: [
        { emoji: "🌿", label: "Theme: Calm Green (default)", action: () => {} },
        { emoji: "💱", label: "Currency: PHP (₱)", action: () => {} },
        { emoji: "🔔", label: "Reminders", action: () => {} },
      ],
    },
    {
      section: "Danger Zone",
      rows: [
        { emoji: "🗑️", label: "Reset All Data", action: onReset, danger: true },
      ],
    },
  ];

  return (
    <div style={{ padding: "0 16px 16px" }}>
      <Card style={{ padding: "20px", marginBottom: 20,
        background: "linear-gradient(140deg, #2E7D32, #1B5E20)",
        border: "none", boxShadow: "0 6px 24px rgba(46,125,50,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 28,
            background: "rgba(255,255,255,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
            🌿
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#fff" }}>My Finances</p>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              {data.transactions.length} transactions · {fmt(total)} net balance
            </p>
          </div>
        </div>
      </Card>

      {items.map(section => (
        <div key={section.section} style={{ marginBottom: 16 }}>
          <p style={{ margin: "0 0 8px 4px", fontSize: 11, fontWeight: 700, color: T.textMut,
            textTransform: "uppercase", letterSpacing: "0.07em" }}>{section.section}</p>
          <Card style={{ overflow: "hidden" }}>
            {section.rows.map((row, i) => (
              <div key={row.label}>
                <button onClick={row.action} style={{
                  width: "100%", display: "flex", alignItems: "center",
                  justifyContent: "space-between", padding: "14px 16px",
                  background: "none", border: "none", cursor: "pointer",
                  color: row.danger ? T.red : T.text, textAlign: "left",
                  transition: "background 0.12s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = row.danger ? T.redL : T.accent}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{row.emoji}</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{row.label}</span>
                  </div>
                  <ChevronRight size={16} color={T.textMut} />
                </button>
                {i < section.rows.length - 1 && <Divider />}
              </div>
            ))}
          </Card>
        </div>
      ))}

      <p style={{ textAlign: "center", fontSize: 12, color: T.textMut, marginTop: 8 }}>
        Tarsi Finance · v1.0.0 · Local-first
      </p>
    </div>
  );
}

// ─── ADD TRANSACTION MODAL ────────────────────────────────────────────────────
function AddModal({ wallets, onClose, onAdd }) {
  const [type,     setType]     = useState("expense");
  const [amount,   setAmount]   = useState("");
  const [catId,    setCatId]    = useState("food");
  const [walletId, setWalletId] = useState(wallets[0]?.id ?? "");
  const [note,     setNote]     = useState("");
  const [date,     setDate]     = useState(TODAY);

  const KEYS = ["1","2","3","4","5","6","7","8","9",".","0","⌫"];

  function tap(k) {
    if (k === "⌫") { setAmount(a => a.slice(0, -1)); return; }
    if (k === "." && amount.includes(".")) return;
    if (amount.length >= 9) return;
    if (amount === "0" && k !== ".") { setAmount(k); return; }
    setAmount(a => a + k);
  }

  function submit() {
    const n = parseFloat(amount);
    if (!n || n <= 0 || !walletId) return;
    onAdd({ type, amount: n, cat: catId, walletId, note, date });
    onClose();
  }

  const validCats = type === "income"
    ? CATS.filter(c => ["salary","gift","other"].includes(c.id))
    : CATS.filter(c => c.id !== "salary");

  const numAmt = parseFloat(amount) || 0;
  const canAdd = numAmt > 0;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}
    onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: "100%", maxWidth: 480, background: T.card,
        borderRadius: "26px 26px 0 0", maxHeight: "92vh", overflow: "auto",
        boxShadow: "0 -12px 48px rgba(0,0,0,0.16)",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 38, height: 4, borderRadius: 99, background: T.accentDark }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "4px 20px 12px" }}>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: T.text }}>New Entry</p>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 99,
            background: T.accent, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color={T.textSec} />
          </button>
        </div>

        {/* Type toggle */}
        <div style={{ display: "flex", margin: "0 20px 14px",
          background: T.accent, borderRadius: 14, padding: 4 }}>
          {[["expense","− Expense"],["income","+ Income"]].map(([v, l]) => (
            <button key={v} onClick={() => { setType(v); setCatId(v==="income"?"salary":"food"); }}
              style={{
                flex: 1, padding: "9px", borderRadius: 11, fontSize: 14, fontWeight: 700,
                border: "none", cursor: "pointer", transition: "all 0.15s",
                background: type === v ? (v === "expense" ? T.red : T.primary) : "transparent",
                color: type === v ? "#fff" : T.textSec,
                boxShadow: type === v ? "0 2px 10px rgba(0,0,0,0.15)" : "none",
              }}>
              {l}
            </button>
          ))}
        </div>

        {/* Amount display */}
        <div style={{ textAlign: "center", padding: "2px 20px 12px" }}>
          <p style={{ margin: 0, fontSize: 11, color: T.textMut, textTransform: "uppercase",
            letterSpacing: "0.06em" }}>Amount</p>
          <p style={{ margin: "4px 0 0", fontSize: 44, fontWeight: 900,
            color: amount ? T.text : T.textMut, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            ₱{amount || "0"}
          </p>
        </div>

        {/* Category scroll */}
        <div style={{ display: "flex", gap: 8, padding: "0 20px 14px",
          overflowX: "auto", scrollbarWidth: "none" }}>
          {validCats.map(c => {
            const Icon = c.Icon;
            const sel  = catId === c.id;
            return (
              <button key={c.id} onClick={() => setCatId(c.id)} style={{
                minWidth: 60, display: "flex", flexDirection: "column", alignItems: "center",
                gap: 5, padding: "9px 8px", borderRadius: 13, flexShrink: 0, cursor: "pointer",
                border: `2px solid ${sel ? c.color : T.border}`,
                background: sel ? c.bg : T.card, transition: "all 0.12s",
              }}>
                <Icon size={17} color={c.color} />
                <span style={{ fontSize: 10, fontWeight: 600,
                  color: sel ? c.color : T.textMut, whiteSpace: "nowrap" }}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Wallet + Note */}
        <div style={{ display: "flex", gap: 10, padding: "0 20px 14px" }}>
          <select value={walletId} onChange={e => setWalletId(e.target.value)} style={{
            flex: 1, padding: "10px 12px", borderRadius: 11, fontSize: 13, fontWeight: 500,
            border: `1.5px solid ${T.border}`, background: T.accent, color: T.text,
            fontFamily: "inherit", appearance: "none",
          }}>
            {wallets.map(w => (
              <option key={w.id} value={w.id}>{w.emoji} {w.name}</option>
            ))}
          </select>
          <input value={note} onChange={e => setNote(e.target.value)}
            placeholder="Note (optional)" style={{
              flex: 1.6, padding: "10px 12px", borderRadius: 11, fontSize: 13,
              border: `1.5px solid ${T.border}`, background: T.accent, color: T.text,
              fontFamily: "inherit", outline: "none",
            }} />
        </div>

        {/* Date */}
        <div style={{ padding: "0 20px 14px" }}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 11, fontSize: 13,
              border: `1.5px solid ${T.border}`, background: T.accent, color: T.text,
              fontFamily: "inherit", boxSizing: "border-box", outline: "none",
            }} />
        </div>

        {/* Keypad */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)",
          gap: 8, padding: "0 20px 14px" }}>
          {KEYS.map(k => (
            <button key={k} onPointerDown={() => tap(k)} style={{
              padding: "15px 8px", borderRadius: 13, fontSize: k === "⌫" ? 20 : 20,
              fontWeight: k === "⌫" ? 400 : 600,
              border: `1px solid ${T.border}`, background: T.card, cursor: "pointer",
              color: T.text, userSelect: "none", transition: "background 0.08s",
              WebkitTapHighlightColor: "transparent",
            }}
            onPointerEnter={e => { if (e.buttons) e.currentTarget.style.background = T.accent; }}
            onPointerLeave={e => e.currentTarget.style.background = T.card}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Submit */}
        <div style={{ padding: "0 20px 24px" }}>
          <button onClick={submit} disabled={!canAdd} style={{
            width: "100%", padding: "17px", borderRadius: 16, fontSize: 16, fontWeight: 800,
            border: "none", cursor: canAdd ? "pointer" : "not-allowed", transition: "all 0.15s",
            background: !canAdd ? T.accent : type === "expense" ? T.red : T.primary,
            color: !canAdd ? T.textMut : "#fff",
            boxShadow: canAdd ? (type === "expense" ? "0 4px 16px rgba(198,40,40,0.35)" : "0 4px 16px rgba(46,125,50,0.35)") : "none",
          }}>
            {canAdd ? `Save ${type === "expense" ? "Expense" : "Income"} · ${fmt(numAmt)}` : "Enter amount"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CONTRIBUTE MODAL ─────────────────────────────────────────────────────────
function ContributeModal({ goal, wallets, onClose, onContribute }) {
  const [amount,   setAmount]   = useState("");
  const [walletId, setWalletId] = useState(wallets[0]?.id ?? "");
  const wallet = wallets.find(w => w.id === walletId);
  const n    = parseFloat(amount) || 0;
  const ok   = n > 0 && wallet && n <= wallet.balance;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(6px)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 20,
    }}
    onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ width: "100%", maxWidth: 360, background: T.card,
        borderRadius: 22, padding: 24, boxShadow: T.shadowMd }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: T.textMut,
              textTransform: "uppercase", letterSpacing: "0.07em" }}>Contribute to</p>
            <p style={{ margin: "3px 0 0", fontSize: 19, fontWeight: 800, color: T.text }}>
              {goal.emoji} {goal.name}
            </p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 99,
            background: T.accent, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} color={T.textSec} />
          </button>
        </div>

        <div style={{ background: T.accent, borderRadius: 12, padding: 12, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: T.textMut }}>Saved</span>
            <span style={{ fontSize: 12, color: T.textMut }}>Target</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: T.primary }}>{fmt(goal.saved)}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{fmt(goal.target)}</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: T.accentDark,
            overflow: "hidden", marginTop: 8 }}>
            <div style={{ height: "100%", borderRadius: 99,
              width: `${pct(goal.saved, goal.target)}%`,
              background: T.primary, transition: "width 0.4s" }} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: T.textMut, display: "block", marginBottom: 6 }}>Amount</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="₱0" style={{
              width: "100%", padding: "13px", borderRadius: 11, fontSize: 20, fontWeight: 800,
              border: `2px solid ${T.border}`, background: T.accent, color: T.text,
              fontFamily: "inherit", boxSizing: "border-box", outline: "none",
            }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: T.textMut, display: "block", marginBottom: 6 }}>From wallet</label>
          <select value={walletId} onChange={e => setWalletId(e.target.value)} style={{
            width: "100%", padding: "11px 12px", borderRadius: 11, fontSize: 14,
            border: `1.5px solid ${T.border}`, background: T.accent, color: T.text,
            fontFamily: "inherit",
          }}>
            {wallets.map(w => (
              <option key={w.id} value={w.id}>{w.emoji} {w.name} ({fmt(w.balance)})</option>
            ))}
          </select>
        </div>

        {wallet && n > wallet.balance && (
          <p style={{ margin: "0 0 10px", fontSize: 12, color: T.red, textAlign: "center" }}>
            Not enough balance in {wallet.name}
          </p>
        )}

        <button onClick={() => { if (ok) { onContribute(goal.id, n, walletId); onClose(); } }}
          disabled={!ok} style={{
            width: "100%", padding: "15px", borderRadius: 13, fontSize: 15, fontWeight: 800,
            border: "none", cursor: ok ? "pointer" : "not-allowed", transition: "all 0.15s",
            background: ok ? T.primary : T.accent, color: ok ? "#fff" : T.textMut,
            boxShadow: ok ? "0 4px 16px rgba(46,125,50,0.35)" : "none",
          }}>
          {ok ? `Contribute ${fmt(n)}` : "Enter valid amount"}
        </button>
      </div>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
const NAV = [
  { id:"home",    Icon:Home,    label:"Home"    },
  { id:"wallet",  Icon:Wallet,  label:"Wallets" },
  { id:"__fab",   Icon:null,    label:""        },
  { id:"history", Icon:BarChart3,label:"History" },
  { id:"plan",    Icon:Target,  label:"Plan"    },
];

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function TarsiApp() {
  const { data, addTransaction, deleteTransaction, contributeToGoal, toggleDebt, resetData } = useStore();
  const [view,    setView]    = useState("home");
  const [showAdd, setShowAdd] = useState(false);
  const [contGoal, setContGoal] = useState(null);

  // Load DM Sans
  useEffect(() => {
    const l = document.createElement("link");
    l.rel  = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap";
    document.head.appendChild(l);
    document.body.style.margin  = "0";
    document.body.style.padding = "0";
    return () => { try { document.head.removeChild(l); } catch {} };
  }, []);

  const VIEW_TITLE = {
    home:"Dashboard", wallet:"Wallets", history:"Transactions",
    plan:"Planning", settings:"Settings",
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning 🌤";
    if (h < 18) return "Good afternoon ☀️";
    return "Good evening 🌙";
  })();

  return (
    <div style={{
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      background: T.bg, minHeight: "100vh",
      display: "flex", justifyContent: "center",
    }}>
      {/* ── App Shell ── */}
      <div style={{
        width: "100%", maxWidth: 480, minHeight: "100vh",
        background: T.bg, position: "relative",
        display: "flex", flexDirection: "column",
      }}>

        {/* ── Top Bar ── */}
        <div style={{
          padding: "48px 20px 14px", background: T.bg,
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              {view === "home" ? (
                <>
                  <p style={{ margin: 0, fontSize: 13, color: T.textMut, fontWeight: 500 }}>{greeting}</p>
                  <p style={{ margin: "1px 0 0", fontSize: 22, fontWeight: 800, color: T.text }}>
                    Dashboard
                  </p>
                </>
              ) : (
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text }}>
                  {VIEW_TITLE[view]}
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setView("settings")} style={{
                width: 38, height: 38, borderRadius: 99, background: T.card,
                border: `1px solid ${T.border}`, display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", boxShadow: T.shadow,
              }}>
                <Settings size={17} color={view === "settings" ? T.primary : T.textSec} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Scrollable Content ── */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 84, scrollbarWidth: "none" }}>
          {view === "home"    && <DashboardView data={data} />}
          {view === "wallet"  && <WalletView    data={data} />}
          {view === "history" && <HistoryView   data={data} onDelete={deleteTransaction} />}
          {view === "plan"    && <PlanView      data={data}
                                    onContribute={g => setContGoal(g)}
                                    onToggleDebt={toggleDebt} />}
          {view === "settings" && <SettingsView data={data}
                                    onReset={() => { if (window.confirm("Reset all data?")) resetData(); }} />}
        </div>

        {/* ── FAB ── */}
        <button onClick={() => setShowAdd(true)} style={{
          position: "fixed",
          bottom: 74, left: "50%", transform: "translateX(-50%)",
          width: 58, height: 58, borderRadius: 29,
          background: `linear-gradient(135deg, ${T.primaryL}, ${T.primary})`,
          border: "none", cursor: "pointer", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(46,125,50,0.42)",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateX(-50%) scale(1.06)";
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(46,125,50,0.55)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateX(-50%)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(46,125,50,0.42)";
        }}
        >
          <Plus size={28} color="#fff" strokeWidth={2.5} />
        </button>

        {/* ── Bottom Nav ── */}
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 480,
          background: T.card, borderTop: `1px solid ${T.border}`,
          display: "flex", zIndex: 100,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}>
          {NAV.map(item => {
            if (item.id === "__fab") {
              return <div key="fab-spacer" style={{ flex: 1 }} />;
            }
            const active = view === item.id;
            const Icon   = item.Icon;
            return (
              <button key={item.id} onClick={() => setView(item.id)} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", padding: "10px 0 12px",
                background: "none", border: "none", cursor: "pointer", gap: 3,
              }}>
                <div style={{
                  width: 42, height: 28, borderRadius: 14,
                  background: active ? T.accent : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                }}>
                  <Icon size={22} color={active ? T.primary : T.textMut}
                    strokeWidth={active ? 2.2 : 1.6} />
                </div>
                <span style={{ fontSize: 10, fontWeight: active ? 700 : 400,
                  color: active ? T.primary : T.textMut }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* ── Modals ── */}
      {showAdd && (
        <AddModal
          wallets={data.wallets}
          onClose={() => setShowAdd(false)}
          onAdd={addTransaction}
        />
      )}
      {contGoal && (
        <ContributeModal
          goal={contGoal}
          wallets={data.wallets}
          onClose={() => setContGoal(null)}
          onContribute={contributeToGoal}
        />
      )}
    </div>
  );
}
