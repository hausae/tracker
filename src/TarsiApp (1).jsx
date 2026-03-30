// ╔══════════════════════════════════════════════════════════════╗
// ║    TARSI FINANCE  ·  src/TarsiApp.jsx                        ║
// ║    Drop into Vite+React project  ·  npm install && npm run dev║
// ╚══════════════════════════════════════════════════════════════╝

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Home, Wallet, Plus, BarChart3, Settings,
  ShoppingBag, Zap, Film, Heart, Briefcase, Gift,
  MoreHorizontal, Target, X,
  Utensils, Bus, PiggyBank, ChevronRight,
  Trash2, Check, CreditCard, Banknote, Smartphone,
  PiggyBank as PiggyIcon, AlertCircle, Edit3,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

// ─── THEME ───────────────────────────────────────────────────────────────────
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
  { id:"food",   label:"Food",      Icon:Utensils,      color:"#E64A19", bg:"#FBE9E7" },
  { id:"trans",  label:"Transport", Icon:Bus,           color:"#0277BD", bg:"#E1F5FE" },
  { id:"shop",   label:"Shopping",  Icon:ShoppingBag,   color:"#6A1B9A", bg:"#F3E5F5" },
  { id:"bills",  label:"Bills",     Icon:Zap,           color:"#EF6C00", bg:"#FFF3E0" },
  { id:"health", label:"Health",    Icon:Heart,         color:"#C62828", bg:"#FFEBEE" },
  { id:"fun",    label:"Fun",       Icon:Film,          color:"#1565C0", bg:"#E3F2FD" },
  { id:"salary", label:"Salary",    Icon:Briefcase,     color:"#2E7D32", bg:"#E8F5E9" },
  { id:"gift",   label:"Gifts",     Icon:Gift,          color:"#AD1457", bg:"#FCE4EC" },
  { id:"save",   label:"Savings",   Icon:PiggyBank,     color:"#00695C", bg:"#E0F2F1" },
  { id:"other",  label:"Other",     Icon:MoreHorizontal,color:"#546E7A", bg:"#ECEFF1" },
];

// ─── WALLET TYPES ─────────────────────────────────────────────────────────────
const WALLET_TYPES = [
  { id:"debit",   label:"Debit / Savings", Icon:Wallet,     defaultEmoji:"🏦" },
  { id:"credit",  label:"Credit Card",     Icon:CreditCard, defaultEmoji:"💳" },
  { id:"cash",    label:"Cash",            Icon:Banknote,   defaultEmoji:"💵" },
  { id:"ewallet", label:"E-Wallet",        Icon:Smartphone, defaultEmoji:"📱" },
];

const WALLET_EMOJIS = ["🏦","💳","💵","📱","💰","🪙","👛","💼","🏧","💹","🎰","💴","💶","💷","🏪","📊"];
const WALLET_COLORS = ["#43A047","#1565C0","#0070EB","#E65100","#AD1457","#6A1B9A","#00695C","#546E7A","#C62828","#37474F"];

const GOAL_EMOJIS   = ["🛡️","💻","✈️","🏠","🚗","📚","💍","🎓","🏋️","🌴","🎮","🎵","🛒","🎁","👶","🐶","🏖️","⚽"];

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const NOW = new Date();
const D = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
const TODAY = D(0);
const THIS_MONTH = TODAY.slice(0, 7);

const SEED = {
  wallets: [
    { id:"w1", name:"Cash",        emoji:"💵", type:"cash",    balance:0, color:"#43A047" },
    { id:"w2", name:"Bank",        emoji:"🏦", type:"bank",    balance:0, color:"#1565C0" },
    { id:"w3", name:"E-Wallet",    emoji:"📱", type:"ewallet", balance:0, color:"#0070EB" },
  ],
  transactions: [],
  budgets: [],
  goals: [],
  debts: [],
};

// ─── STORE ───────────────────────────────────────────────────────────────────
function useStore() {
  const [data, setData] = useState(() => {
    try { const s = localStorage.getItem("tarsi_v4"); return s ? JSON.parse(s) : SEED; }
    catch { return SEED; }
  });
  useEffect(() => {
    try { localStorage.setItem("tarsi_v4", JSON.stringify(data)); } catch {}
  }, [data]);

  return {
    data,

    // ── Wallets ──
    addWallet(w) {
      setData(d => ({ ...d, wallets: [...d.wallets, { ...w, id: "w_" + Date.now() }] }));
    },
    updateWallet(id, changes) {
      setData(d => ({ ...d, wallets: d.wallets.map(w => w.id === id ? { ...w, ...changes } : w) }));
    },
    deleteWallet(id) {
      setData(d => ({
        ...d,
        wallets: d.wallets.filter(w => w.id !== id),
        transactions: d.transactions.filter(t => t.walletId !== id),
      }));
    },

    // ── Transactions ──
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

    // ── Budgets ──
    addBudget(b) {
      setData(d => ({ ...d, budgets: [...d.budgets, { ...b, id: "b_" + Date.now() }] }));
    },
    updateBudget(id, changes) {
      setData(d => ({ ...d, budgets: d.budgets.map(b => b.id === id ? { ...b, ...changes } : b) }));
    },
    deleteBudget(id) {
      setData(d => ({ ...d, budgets: d.budgets.filter(b => b.id !== id) }));
    },

    // ── Goals ──
    addGoal(g) {
      setData(d => ({ ...d, goals: [...d.goals, { ...g, id: "g_" + Date.now(), saved: 0 }] }));
    },
    deleteGoal(id) {
      setData(d => ({ ...d, goals: d.goals.filter(g => g.id !== id) }));
    },
    contributeToGoal(goalId, amount, walletId) {
      setData(d => ({
        ...d,
        goals:   d.goals.map(g => g.id === goalId ? { ...g, saved: Math.min(g.saved + amount, g.target) } : g),
        wallets: d.wallets.map(w => w.id === walletId ? { ...w, balance: w.balance - amount } : w),
      }));
    },

    // ── Debts ──
    addDebt(debt) {
      setData(d => ({ ...d, debts: [...d.debts, { ...debt, id: "d_" + Date.now(), done: false }] }));
    },
    toggleDebt(id) {
      setData(d => ({ ...d, debts: d.debts.map(x => x.id === id ? { ...x, done: !x.done } : x) }));
    },
    deleteDebt(id) {
      setData(d => ({ ...d, debts: d.debts.filter(x => x.id !== id) }));
    },

    resetData() { setData(SEED); },
  };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt  = (n) => "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const pctF = (a, b) => b === 0 ? 0 : Math.min((a / b) * 100, 100);
const getCat = (id) => CATS.find(c => c.id === id) ?? CATS[CATS.length - 1];
const getWType = (id) => WALLET_TYPES.find(t => t.id === id) ?? WALLET_TYPES[0];

function relDate(d) {
  if (d === TODAY) return "Today";
  if (d === D(1)) return "Yesterday";
  return new Date(d + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}

// ─── BASE COMPONENTS ─────────────────────────────────────────────────────────
function Card({ style, children, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: T.card, borderRadius: 18,
      border: `1px solid ${T.border}`, boxShadow: T.shadow, ...style,
    }}>
      {children}
    </div>
  );
}

function Pill({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 16px", borderRadius: 99, fontSize: 13, fontWeight: 500,
      cursor: "pointer", whiteSpace: "nowrap",
      border: `1.5px solid ${active ? (color ?? T.primary) : T.border}`,
      background: active ? (color ?? T.primary) : T.card,
      color: active ? "#fff" : T.textSec, transition: "all 0.15s",
    }}>
      {label}
    </button>
  );
}

function Divider({ inset = 14 }) {
  return <div style={{ height: 1, background: T.border, margin: `0 ${inset}px` }} />;
}

function EmptyState({ emoji, title, subtitle, action, actionLabel }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 24px" }}>
      <p style={{ fontSize: 44, marginBottom: 12 }}>{emoji}</p>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text }}>{title}</p>
      <p style={{ margin: "6px 0 18px", fontSize: 13, color: T.textMut }}>{subtitle}</p>
      {action && (
        <button onClick={action} style={{
          background: T.primary, color: "#fff", border: "none",
          borderRadius: 12, padding: "11px 24px", fontSize: 14,
          fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 14px rgba(46,125,50,0.3)",
        }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function TxnRow({ txn, onDelete }) {
  const c = getCat(txn.cat);
  const income = txn.type === "income";
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
        cursor: "pointer", transition: "background 0.12s" }}
      onMouseEnter={e => e.currentTarget.style.background = T.accent}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      onClick={() => { if (window.confirm(`Delete "${txn.note || c.label}"?`)) onDelete(txn.id); }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
        background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <c.Icon size={16} color={c.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {txn.note || c.label}
        </p>
        <p style={{ margin: "1px 0 0", fontSize: 11, color: T.textMut }}>
          {c.label} · {relDate(txn.date)}
        </p>
      </div>
      <span style={{ fontWeight: 700, fontSize: 13,
        color: income ? T.primary : T.red, flexShrink: 0 }}>
        {income ? "+" : "−"}{fmt(txn.amount)}
      </span>
    </div>
  );
}

// ─── BUDGET BAR ───────────────────────────────────────────────────────────────
function BudgetBar({ budget, spent, onDelete, onEdit }) {
  const c = getCat(budget.cat);
  const p = pctF(spent, budget.limit);
  const over = spent > budget.limit;
  const warn = !over && p > 80;
  const barColor = over ? T.red : warn ? T.amber : T.primary;

  return (
    <div style={{ padding: "10px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: c.bg,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <c.Icon size={13} color={c.color} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{c.label}</span>
          {over && (
            <span style={{ fontSize: 10, color: T.red, fontWeight: 700,
              background: T.redL, padding: "1px 6px", borderRadius: 99 }}>OVER</span>
          )}
          {warn && !over && (
            <span style={{ fontSize: 10, color: T.amber, fontWeight: 700,
              background: T.amberL, padding: "1px 6px", borderRadius: 99 }}>NEAR LIMIT</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: barColor }}>{fmt(spent)}</span>
            <span style={{ fontSize: 11, color: T.textMut }}> / {fmt(budget.limit)}</span>
          </div>
          <button onClick={onDelete} style={{
            width: 24, height: 24, borderRadius: 99, background: T.redL,
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Trash2 size={11} color={T.red} />
          </button>
        </div>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: T.accent, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, width: `${p}%`,
          background: barColor, transition: "width 0.5s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 10, color: T.textMut }}>{Math.round(p)}% used</span>
        <span style={{ fontSize: 10, color: T.textMut }}>
          {over ? `${fmt(spent - budget.limit)} over` : `${fmt(budget.limit - spent)} left`}
        </span>
      </div>
    </div>
  );
}

// ─── GOAL CARD ────────────────────────────────────────────────────────────────
function GoalCard({ goal, onContribute, onDelete }) {
  const p = pctF(goal.saved, goal.target);
  const remaining = goal.target - goal.saved;
  const days = Math.ceil((new Date(goal.deadline) - new Date()) / 86400000);
  const completed = goal.saved >= goal.target;

  return (
    <Card style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 26 }}>{goal.emoji}</span>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>
              {goal.name}
              {completed && <span style={{ marginLeft: 6, fontSize: 11, color: T.primary,
                background: T.accent, padding: "1px 7px", borderRadius: 99 }}>Done!</span>}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: T.textMut }}>
              {completed ? "Goal reached 🎉" : days > 0 ? `${days}d left` : "Deadline passed"} · {Math.round(p)}%
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {!completed && (
            <button onClick={onContribute} style={{
              background: T.primary, color: "#fff", border: "none",
              borderRadius: 99, padding: "5px 12px", fontSize: 11,
              fontWeight: 700, cursor: "pointer",
            }}>
              + Add
            </button>
          )}
          <button onClick={onDelete} style={{
            width: 28, height: 28, borderRadius: 99, background: T.redL,
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Trash2 size={12} color={T.red} />
          </button>
        </div>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: T.accent,
        overflow: "hidden", marginBottom: 8 }}>
        <div style={{
          height: "100%", borderRadius: 99, width: `${p}%`,
          background: completed ? "#43A047" : `linear-gradient(90deg, ${T.primaryL}, ${T.primary})`,
          transition: "width 0.5s ease",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: T.primary }}>{fmt(goal.saved)}</span>
        <span style={{ fontSize: 11, color: T.textMut }}>
          {completed ? "Completed!" : `${fmt(remaining)} to go`} · {fmt(goal.target)}
        </span>
      </div>
    </Card>
  );
}

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
function DashboardView({ data }) {
  const total   = data.wallets.reduce((s, w) => s + w.balance, 0);
  const mTxns   = data.transactions.filter(t => t.date.startsWith(THIS_MONTH));
  const income  = mTxns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = mTxns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const recent  = data.transactions.slice(0, 6);

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = D(6 - i);
    const exp  = data.transactions
      .filter(t => t.date === date && t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { day: new Date(date + "T00:00:00").toLocaleDateString("en", { weekday: "short" }), exp };
  });

  return (
    <div style={{ paddingBottom: 8 }}>
      {/* Balance Card */}
      <div style={{
        margin: "0 14px 16px",
        background: "linear-gradient(140deg, #2E7D32, #1B5E20)",
        borderRadius: 22, padding: "22px 22px 18px",
        boxShadow: "0 8px 28px rgba(46,125,50,0.28)",
      }}>
        <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.65)",
          letterSpacing: "0.08em", textTransform: "uppercase" }}>Total Balance</p>
        <p style={{ margin: "4px 0 18px", fontSize: 36, fontWeight: 900, color: "#fff",
          letterSpacing: "-0.03em", lineHeight: 1 }}>{fmt(total)}</p>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "↑ Income",  val: income,  color: "#A5D6A7" },
            { label: "↓ Spent",   val: expense, color: "#FFCDD2" },
            { label: "Net",       val: income - expense,
              color: income - expense >= 0 ? "#A5D6A7" : "#FFCDD2" },
          ].map(r => (
            <div key={r.label}>
              <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{r.label}</p>
              <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, color: r.color }}>
                {r.val >= 0 ? "" : "−"}{fmt(Math.abs(r.val))}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Scroll */}
      <p style={{ margin: "0 14px 8px", fontSize: 11, fontWeight: 700, color: T.textMut,
        textTransform: "uppercase", letterSpacing: "0.06em" }}>Wallets</p>
      <div style={{ display: "flex", gap: 8, paddingLeft: 14, paddingRight: 14,
        marginBottom: 16, overflowX: "auto", scrollbarWidth: "none" }}>
        {data.wallets.map(w => (
          <div key={w.id} style={{ minWidth: 120, flexShrink: 0, background: T.card,
            borderRadius: 14, padding: "12px 14px",
            border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>{w.emoji}</span>
              <span style={{ fontSize: 11, color: T.textMut, fontWeight: 500 }}>{w.name}</span>
            </div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: T.text }}>{fmt(w.balance)}</p>
          </div>
        ))}
      </div>

      {/* Spending Chart */}
      <div style={{ margin: "0 14px 16px" }}>
        <Card style={{ padding: "14px 14px 6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 8 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.text }}>7-Day Spending</p>
            <span style={{ fontSize: 11, color: T.textMut }}>Tap bar to see amount</span>
          </div>
          <ResponsiveContainer width="100%" height={88}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={T.primary} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={T.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: T.textMut }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => [fmt(v), "Spent"]}
                contentStyle={{ fontSize: 12, borderRadius: 10,
                  border: `1px solid ${T.border}`, background: T.card, color: T.text }}
                cursor={{ stroke: T.accentDark, strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="exp" stroke={T.primary} strokeWidth={2.2}
                fill="url(#gfill)" dot={false} activeDot={{ r: 4, fill: T.primary }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Budget Preview */}
      {data.budgets.length > 0 && (
        <div style={{ margin: "0 14px 16px" }}>
          <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: T.textMut,
            textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Budget · {new Date(THIS_MONTH + "-01").toLocaleDateString("en", { month: "long" })}
          </p>
          <Card style={{ padding: "4px 14px 8px" }}>
            {data.budgets.slice(0, 3).map(b => {
              const spent = mTxns
                .filter(t => t.cat === b.cat && t.type === "expense")
                .reduce((s, t) => s + t.amount, 0);
              return <BudgetBar key={b.id} budget={b} spent={spent} onDelete={() => {}} onEdit={() => {}} />;
            })}
          </Card>
        </div>
      )}

      {/* Recent Transactions */}
      <div style={{ margin: "0 14px" }}>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: T.textMut,
          textTransform: "uppercase", letterSpacing: "0.06em" }}>Recent</p>
        <Card style={{ overflow: "hidden" }}>
          {recent.length === 0 ? (
            <div style={{ padding: "24px", textAlign: "center", color: T.textMut, fontSize: 13 }}>
              No transactions yet — tap + to add one
            </div>
          ) : (
            recent.map((t, i) => (
              <div key={t.id}>
                <TxnRow txn={t} onDelete={() => {}} />
                {i < recent.length - 1 && <Divider />}
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── WALLET VIEW ──────────────────────────────────────────────────────────────
function WalletView({ data, onAddWallet, onDeleteWallet }) {
  const total = data.wallets.reduce((s, w) => s + w.balance, 0);
  const [menuId, setMenuId] = useState(null);

  return (
    <div style={{ paddingBottom: 14 }}>
      {/* Hero Balance */}
      <div style={{ margin: "0 14px 4px" }}>
        <p style={{ margin: 0, fontSize: 12, color: T.textMut, fontWeight: 500 }}>
          Manage your wallets and balances
        </p>
      </div>

      {/* Total Balance Card */}
      <div style={{
        margin: "10px 14px 4px",
        background: T.card,
        borderRadius: 18, padding: "16px 18px",
        border: `1px solid ${T.border}`, boxShadow: T.shadow,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: T.accent, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32,
          }}>
            🤑
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 10, color: T.textMut, textTransform: "uppercase",
              letterSpacing: "0.07em", fontWeight: 700 }}>Total Balance</p>
            <p style={{ margin: "3px 0 0", fontSize: 26, fontWeight: 900,
              color: T.text, letterSpacing: "-0.02em" }}>{fmt(total)}</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 10, color: T.textMut }}>{data.wallets.length} account{data.wallets.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Insight blurb */}
      <div style={{ display: "flex", gap: 10, margin: "10px 14px 14px" }}>
        <Card style={{ flex: 2, padding: "12px 14px" }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.text, lineHeight: 1.4 }}>
            {total > 20000 ? "Past 20k. One month+\nfor many." : "Keep saving.\nYou're on track!"}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: T.textMut }}>
            {total > 20000 ? "Most don't have that—\nyou're good." : "Every peso counts."}
          </p>
        </Card>
        <Card style={{ flex: 1, padding: "12px 14px" }}>
          <p style={{ margin: "0 0 6px", fontSize: 10, color: T.textMut, fontWeight: 600 }}>
            BALANCE / DAY
          </p>
          <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 32 }}>
            {Array.from({ length: 7 }, (_, i) => {
              const h = 8 + Math.random() * 24;
              return (
                <div key={i} style={{
                  flex: 1, borderRadius: 3, height: h,
                  background: i === 6 ? T.primary : T.accentDark,
                }} />
              );
            })}
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 9, color: T.textMut }}>T W T F S S M</p>
        </Card>
      </div>

      {/* Account List */}
      <div style={{ padding: "0 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {data.wallets.map(w => {
          const wType = getWType(w.type);
          const wTxns = data.transactions.filter(t => t.walletId === w.id);
          const monthInc = wTxns
            .filter(t => t.type === "income" && t.date.startsWith(THIS_MONTH))
            .reduce((s, t) => s + t.amount, 0);
          const monthExp = wTxns
            .filter(t => t.type === "expense" && t.date.startsWith(THIS_MONTH))
            .reduce((s, t) => s + t.amount, 0);

          return (
            <Card key={w.id} style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between",
                alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 13,
                    background: w.color + "22",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>
                    {w.emoji}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>
                      {w.name}
                    </p>
                    <p style={{ margin: "1px 0 0", fontSize: 11, color: T.textMut }}>
                      {wType.label}
                    </p>
                  </div>
                </div>

                {/* Three-dots menu */}
                <div style={{ position: "relative" }}>
                  <button onClick={() => setMenuId(menuId === w.id ? null : w.id)} style={{
                    width: 30, height: 30, borderRadius: 99, background: "none",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <MoreHorizontal size={18} color={T.textMut} />
                  </button>
                  {menuId === w.id && (
                    <div style={{
                      position: "absolute", right: 0, top: 34, zIndex: 50,
                      background: T.card, borderRadius: 12, border: `1px solid ${T.border}`,
                      boxShadow: T.shadowMd, overflow: "hidden", minWidth: 150,
                    }}>
                      <button onClick={() => {
                        setMenuId(null);
                        if (window.confirm(`Delete "${w.name}"? All its transactions will also be removed.`)) {
                          onDeleteWallet(w.id);
                        }
                      }} style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 8,
                        padding: "11px 14px", background: "none", border: "none",
                        cursor: "pointer", color: T.red, fontSize: 13, fontWeight: 600,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = T.redL}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        <Trash2 size={14} color={T.red} />
                        Delete Account
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <p style={{ margin: 0, fontSize: 10, color: T.textMut }}>Current Balance</p>
                <p style={{ margin: "2px 0 0", fontSize: 24, fontWeight: 900, color: T.text,
                  letterSpacing: "-0.02em" }}>{fmt(w.balance)}</p>
              </div>

              {/* Monthly mini-stats */}
              <div style={{ display: "flex", gap: 0, marginTop: 10, borderRadius: 10,
                overflow: "hidden", border: `1px solid ${T.border}` }}>
                {[
                  { label: "This month in",  val: monthInc, color: T.primary },
                  { label: "This month out", val: monthExp, color: T.red },
                ].map((s, i) => (
                  <div key={s.label} style={{ flex: 1, padding: "8px 12px",
                    borderRight: i === 0 ? `1px solid ${T.border}` : "none" }}>
                    <p style={{ margin: 0, fontSize: 10, color: T.textMut }}>{s.label}</p>
                    <p style={{ margin: "1px 0 0", fontSize: 13, fontWeight: 700, color: s.color }}>
                      {fmt(s.val)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        {/* Add Account Button */}
        <button onClick={onAddWallet} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "14px", borderRadius: 18, width: "100%",
          border: `2px dashed ${T.accentDark}`, background: "transparent",
          cursor: "pointer", color: T.primary, fontWeight: 700, fontSize: 14,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = T.accent}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <Plus size={18} color={T.primary} />
          Add Account
        </button>
      </div>

      {/* Close menu on outside click */}
      {menuId && (
        <div style={{ position: "fixed", inset: 0, zIndex: 40 }}
          onClick={() => setMenuId(null)} />
      )}
    </div>
  );
}

// ─── HISTORY VIEW ─────────────────────────────────────────────────────────────
function HistoryView({ data, onDelete }) {
  const [filter, setFilter]   = useState("all");
  const [catFilt, setCatFilt] = useState("all");

  const filtered = useMemo(() =>
    data.transactions.filter(t =>
      (filter === "all" || t.type === filter) &&
      (catFilt === "all" || t.cat === catFilt)
    ),
    [data.transactions, filter, catFilt]
  );

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(t => { (g[t.date] ??= []).push(t); });
    return Object.entries(g).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const inc = filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const exp = filtered.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <div style={{ paddingBottom: 8 }}>
      {/* Summary strip */}
      <div style={{ display: "flex", margin: "0 14px 12px",
        background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
        {[
          { label: "Income",  val: inc,      color: T.primary },
          { label: "Expense", val: exp,      color: T.red },
          { label: "Net",     val: inc - exp, color: inc >= exp ? T.primary : T.red },
        ].map((s, i) => (
          <div key={s.label} style={{ flex: 1, padding: "11px 10px",
            borderRight: i < 2 ? `1px solid ${T.border}` : "none", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 10, color: T.textMut }}>{s.label}</p>
            <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 700, color: s.color }}>
              {s.val < 0 ? "−" : ""}{fmt(Math.abs(s.val))}
            </p>
          </div>
        ))}
      </div>

      {/* Type filter */}
      <div style={{ display: "flex", gap: 6, padding: "0 14px 10px" }}>
        {[["all","All"],["income","Income"],["expense","Expense"]].map(([v, l]) => (
          <Pill key={v} label={l} active={filter === v}
            color={v === "expense" ? T.red : T.primary}
            onClick={() => setFilter(v)} />
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 6, paddingLeft: 14, paddingRight: 14,
        marginBottom: 14, overflowX: "auto", scrollbarWidth: "none" }}>
        <Pill label="All" active={catFilt === "all"} onClick={() => setCatFilt("all")} />
        {CATS.map(c => (
          <Pill key={c.id} label={c.label} active={catFilt === c.id}
            color={c.color} onClick={() => setCatFilt(c.id)} />
        ))}
      </div>

      {grouped.length === 0 ? (
        <EmptyState emoji="📋" title="No transactions found"
          subtitle="Try changing your filters or add a transaction." />
      ) : (
        grouped.map(([date, txns]) => (
          <div key={date} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between",
              padding: "4px 14px 5px" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.textMut,
                textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {relDate(date)}
              </span>
              <span style={{ fontSize: 11, color: T.textMut }}>
                {txns.length} item{txns.length > 1 ? "s" : ""}
              </span>
            </div>
            <Card style={{ margin: "0 14px", overflow: "hidden" }}>
              {txns.map((t, i) => (
                <div key={t.id}>
                  <TxnRow txn={t} onDelete={onDelete} />
                  {i < txns.length - 1 && <Divider />}
                </div>
              ))}
            </Card>
          </div>
        ))
      )}
    </div>
  );
}

// ─── PLAN VIEW ────────────────────────────────────────────────────────────────
function PlanView({ data, store }) {
  const [tab, setTab] = useState("budgets");
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddGoal,   setShowAddGoal]   = useState(false);
  const [showAddDebt,   setShowAddDebt]   = useState(false);
  const [contGoal, setContGoal] = useState(null);

  const mTxns      = data.transactions.filter(t => t.date.startsWith(THIS_MONTH));
  const totalLimit = data.budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = mTxns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const left       = totalLimit - totalSpent;

  const TAB_BTNS = [
    { id: "budgets", label: "💰 Budget" },
    { id: "goals",   label: "🎯 Goals"  },
    { id: "debts",   label: "🤝 Debts"  },
  ];

  const usedCats = new Set(data.budgets.map(b => b.cat));

  return (
    <div style={{ paddingBottom: 8 }}>
      {/* Tab switcher — matches screenshot */}
      <div style={{ display: "flex", gap: 8, margin: "0 14px 14px" }}>
        {TAB_BTNS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: "9px 4px", borderRadius: 12, fontSize: 12, fontWeight: 700,
            border: `1.5px solid ${tab === id ? T.primary : T.border}`,
            background: tab === id ? T.primary : T.card,
            color: tab === id ? "#fff" : T.text,
            cursor: "pointer", transition: "all 0.15s",
            boxShadow: tab === id ? "0 4px 14px rgba(46,125,50,0.25)" : T.shadow,
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* ══ BUDGET TAB ══ */}
      {tab === "budgets" && (
        <>
          {/* Summary cards */}
          <div style={{ display: "flex", gap: 8, padding: "0 14px 12px" }}>
            {[
              { label: "Budget", val: fmt(totalLimit), color: T.text },
              { label: "Spent",  val: fmt(totalSpent), color: T.red },
              { label: "Left",   val: fmt(Math.abs(left)),
                color: left >= 0 ? T.primary : T.red },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1, background: T.card, borderRadius: 14,
                border: `1px solid ${T.border}`, padding: "12px 10px",
                textAlign: "center", boxShadow: T.shadow,
              }}>
                <p style={{ margin: 0, fontSize: 10, color: T.textMut }}>{s.label}</p>
                <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 800, color: s.color }}>
                  {s.val}
                </p>
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          {totalLimit > 0 && (
            <div style={{ margin: "0 14px 12px" }}>
              <div style={{ height: 6, borderRadius: 99, background: T.accent, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 99,
                  width: `${pctF(totalSpent, totalLimit)}%`,
                  background: left < 0 ? T.red : T.primary,
                  transition: "width 0.5s ease",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: T.textMut }}>
                  {Math.round(pctF(totalSpent, totalLimit))}% of total budget used
                </span>
                {left < 0 && (
                  <span style={{ fontSize: 10, color: T.red, fontWeight: 700 }}>
                    {fmt(Math.abs(left))} over budget!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Budget list */}
          {data.budgets.length === 0 ? (
            <EmptyState emoji="💰" title="No budgets yet"
              subtitle="Set monthly limits to keep spending in check."
              action={() => setShowAddBudget(true)} actionLabel="+ Set Budget" />
          ) : (
            <div style={{ margin: "0 14px" }}>
              <Card style={{ padding: "4px 14px 8px" }}>
                {data.budgets.map((b, i) => {
                  const spent = mTxns
                    .filter(t => t.cat === b.cat && t.type === "expense")
                    .reduce((s, t) => s + t.amount, 0);
                  return (
                    <div key={b.id}>
                      <BudgetBar budget={b} spent={spent}
                        onDelete={() => {
                          if (window.confirm(`Remove budget for ${getCat(b.cat).label}?`))
                            store.deleteBudget(b.id);
                        }}
                        onEdit={() => {}} />
                      {i < data.budgets.length - 1 && <Divider />}
                    </div>
                  );
                })}
              </Card>

              {/* Add more budget button */}
              {CATS.filter(c => !usedCats.has(c.id)).length > 0 && (
                <button onClick={() => setShowAddBudget(true)} style={{
                  marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 6, padding: "12px", borderRadius: 14, width: "100%",
                  border: `2px dashed ${T.accentDark}`, background: "transparent",
                  cursor: "pointer", color: T.primary, fontWeight: 700, fontSize: 13,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.accent}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <Plus size={15} color={T.primary} /> Add Budget Category
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* ══ GOALS TAB ══ */}
      {tab === "goals" && (
        <div style={{ padding: "0 14px" }}>
          {data.goals.length === 0 ? (
            <EmptyState emoji="🎯" title="No savings goals yet"
              subtitle="Set a goal and start saving towards it."
              action={() => setShowAddGoal(true)} actionLabel="+ Create Goal" />
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.goals.map(g => (
                  <GoalCard key={g.id} goal={g}
                    onContribute={() => setContGoal(g)}
                    onDelete={() => {
                      if (window.confirm(`Delete goal "${g.name}"?`)) store.deleteGoal(g.id);
                    }} />
                ))}
              </div>
              <button onClick={() => setShowAddGoal(true)} style={{
                marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, padding: "12px", borderRadius: 14, width: "100%",
                border: `2px dashed ${T.accentDark}`, background: "transparent",
                cursor: "pointer", color: T.primary, fontWeight: 700, fontSize: 13,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = T.accent}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <Plus size={15} color={T.primary} /> Add Goal
              </button>
            </>
          )}
        </div>
      )}

      {/* ══ DEBTS TAB ══ */}
      {tab === "debts" && (
        <div style={{ padding: "0 14px" }}>
          {/* Summary */}
          {data.debts.filter(d => !d.done).length > 0 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[
                { label: "You owe",      val: data.debts.filter(d => d.direction === "owe" && !d.done).reduce((s, d) => s + d.amount, 0),  color: T.red },
                { label: "Owed to you", val: data.debts.filter(d => d.direction === "owes" && !d.done).reduce((s, d) => s + d.amount, 0), color: T.primary },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, background: T.card, borderRadius: 14,
                  border: `1px solid ${T.border}`, padding: "12px 10px",
                  textAlign: "center", boxShadow: T.shadow }}>
                  <p style={{ margin: 0, fontSize: 10, color: T.textMut }}>{s.label}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 800, color: s.color }}>
                    {fmt(s.val)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {data.debts.length === 0 ? (
            <EmptyState emoji="🤝" title="No debts tracked"
              subtitle="Track money you owe or is owed to you."
              action={() => setShowAddDebt(true)} actionLabel="+ Add Debt" />
          ) : (
            <>
              {data.debts.map(d => {
                const due = new Date(d.due + "T00:00:00");
                const overdue = due < new Date() && !d.done;
                return (
                  <Card key={d.id} style={{ marginBottom: 10, padding: "14px 16px",
                    opacity: d.done ? 0.55 : 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between",
                      alignItems: "flex-start" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6,
                          flexWrap: "wrap", marginBottom: 2 }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>
                            {d.direction === "owe" ? `You owe ${d.name}` : `${d.name} owes you`}
                          </p>
                          {overdue && (
                            <span style={{ fontSize: 10, background: T.redL, color: T.red,
                              padding: "1px 7px", borderRadius: 99, fontWeight: 700 }}>Overdue</span>
                          )}
                          {d.done && (
                            <span style={{ fontSize: 10, background: T.accent, color: T.primary,
                              padding: "1px 7px", borderRadius: 99, fontWeight: 700 }}>Settled</span>
                          )}
                        </div>
                        {d.note && (
                          <p style={{ margin: "0 0 2px", fontSize: 11, color: T.textSec }}>{d.note}</p>
                        )}
                        <p style={{ margin: 0, fontSize: 11, color: T.textMut }}>
                          Due {due.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                        <p style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em",
                          color: d.direction === "owe" ? T.red : T.primary }}>
                          {fmt(d.amount)}
                        </p>
                        <div style={{ display: "flex", gap: 5, marginTop: 5, justifyContent: "flex-end" }}>
                          <button onClick={() => store.toggleDebt(d.id)} style={{
                            fontSize: 10, background: d.done ? T.accent : T.amberL,
                            color: d.done ? T.primary : T.amber,
                            border: "none", borderRadius: 99, padding: "3px 9px",
                            cursor: "pointer", fontWeight: 700,
                          }}>
                            {d.done ? "✓ Settled" : "Mark settled"}
                          </button>
                          <button onClick={() => {
                            if (window.confirm(`Delete this debt with ${d.name}?`)) store.deleteDebt(d.id);
                          }} style={{
                            width: 22, height: 22, borderRadius: 99, background: T.redL,
                            border: "none", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Trash2 size={10} color={T.red} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}

              <button onClick={() => setShowAddDebt(true)} style={{
                marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, padding: "12px", borderRadius: 14, width: "100%",
                border: `2px dashed ${T.accentDark}`, background: "transparent",
                cursor: "pointer", color: T.primary, fontWeight: 700, fontSize: 13,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = T.accent}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <Plus size={15} color={T.primary} /> Add Debt / Receivable
              </button>
            </>
          )}
        </div>
      )}

      {/* Modals */}
      {showAddBudget && (
        <AddBudgetModal
          usedCats={usedCats}
          onClose={() => setShowAddBudget(false)}
          onAdd={(b) => { store.addBudget(b); setShowAddBudget(false); }}
        />
      )}
      {showAddGoal && (
        <AddGoalModal
          onClose={() => setShowAddGoal(false)}
          onAdd={(g) => { store.addGoal(g); setShowAddGoal(false); }}
        />
      )}
      {showAddDebt && (
        <AddDebtModal
          onClose={() => setShowAddDebt(false)}
          onAdd={(d) => { store.addDebt(d); setShowAddDebt(false); }}
        />
      )}
      {contGoal && (
        <ContributeModal
          goal={contGoal}
          wallets={data.wallets}
          onClose={() => setContGoal(null)}
          onContribute={store.contributeToGoal}
        />
      )}
    </div>
  );
}

// ─── SETTINGS VIEW ────────────────────────────────────────────────────────────
function SettingsView({ data, onReset }) {
  const total = data.wallets.reduce((s, w) => s + w.balance, 0);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `tarsi_backup_${TODAY}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const d = JSON.parse(ev.target.result);
          if (d.wallets && d.transactions) {
            localStorage.setItem("tarsi_v4", ev.target.result);
            window.location.reload();
          } else {
            alert("Invalid Tarsi backup file.");
          }
        } catch { alert("Could not read the file."); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const sections = [
    {
      title: "Data",
      rows: [
        { emoji: "📤", label: "Export Backup (JSON)", action: exportJSON },
        { emoji: "📥", label: "Import Backup (JSON)", action: importJSON },
      ],
    },
    {
      title: "Preferences",
      rows: [
        { emoji: "🌿", label: "Theme: Calm Green (default)", action: () => {} },
        { emoji: "💱", label: "Currency: Philippine Peso (₱)", action: () => {} },
        { emoji: "🔔", label: "Reminders", action: () => {} },
      ],
    },
    {
      title: "Danger Zone",
      rows: [
        { emoji: "🗑️", label: "Reset All Data", danger: true,
          action: () => { if (window.confirm("Reset ALL data to defaults? This cannot be undone.")) onReset(); } },
      ],
    },
  ];

  return (
    <div style={{ padding: "0 14px 14px" }}>
      <Card style={{
        padding: "18px", marginBottom: 18,
        background: "linear-gradient(140deg, #2E7D32, #1B5E20)",
        border: "none", boxShadow: "0 6px 22px rgba(46,125,50,0.28)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ width: 52, height: 52, borderRadius: 26,
            background: "rgba(255,255,255,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
            🌿
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#fff" }}>My Finances</p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              {data.wallets.length} wallets · {data.transactions.length} transactions · {fmt(total)} net
            </p>
          </div>
        </div>
      </Card>

      {sections.map(sec => (
        <div key={sec.title} style={{ marginBottom: 14 }}>
          <p style={{ margin: "0 0 6px 2px", fontSize: 10, fontWeight: 700, color: T.textMut,
            textTransform: "uppercase", letterSpacing: "0.07em" }}>{sec.title}</p>
          <Card style={{ overflow: "hidden" }}>
            {sec.rows.map((row, i) => (
              <div key={row.label}>
                <button onClick={row.action} style={{
                  width: "100%", display: "flex", alignItems: "center",
                  justifyContent: "space-between", padding: "13px 14px",
                  background: "none", border: "none", cursor: "pointer",
                  color: row.danger ? T.red : T.text, textAlign: "left",
                  transition: "background 0.12s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = row.danger ? T.redL : T.accent}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ fontSize: 17 }}>{row.emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{row.label}</span>
                  </div>
                  <ChevronRight size={15} color={T.textMut} />
                </button>
                {i < sec.rows.length - 1 && <Divider />}
              </div>
            ))}
          </Card>
        </div>
      ))}

      <p style={{ textAlign: "center", fontSize: 11, color: T.textMut, marginTop: 8 }}>
        Tarsi Finance · v1.0.0 · Local-first · 🇵🇭
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════════

function ModalSheet({ title, onClose, children, maxWidth = 480 }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}
    onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: "100%", maxWidth, background: T.card,
        borderRadius: "24px 24px 0 0",
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 -10px 40px rgba(0,0,0,0.16)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: T.accentDark }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "4px 18px 12px" }}>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: T.text }}>{title}</p>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 99,
            background: T.accent, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} color={T.textSec} />
          </button>
        </div>
        <div style={{ padding: "0 18px 28px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function ModalCenter({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}
    onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: "100%", maxWidth: 380, background: T.card,
        borderRadius: 22, padding: "20px 20px 24px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 18 }}>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: T.text }}>{title}</p>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 99,
            background: T.accent, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={13} color={T.textSec} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: T.textMut,
      textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {children}
    </p>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", style }) {
  return (
    <input type={type} value={value} onChange={onChange}
      placeholder={placeholder} style={{
        width: "100%", padding: "12px", borderRadius: 11, fontSize: 14,
        border: `1.5px solid ${T.border}`, background: T.accent, color: T.text,
        fontFamily: "inherit", boxSizing: "border-box", outline: "none",
        transition: "border-color 0.15s", ...style,
      }}
      onFocus={e => e.target.style.borderColor = T.primary}
      onBlur={e => e.target.style.borderColor = T.border}
    />
  );
}

function SubmitBtn({ onClick, disabled, label, color }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", padding: "15px", borderRadius: 13, fontSize: 15, fontWeight: 800,
      border: "none", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.15s",
      background: disabled ? T.accent : (color ?? T.primary),
      color: disabled ? T.textMut : "#fff",
      boxShadow: disabled ? "none" : `0 4px 14px ${(color ?? T.primary)}55`,
    }}>
      {label}
    </button>
  );
}

// ── ADD TRANSACTION MODAL ─────────────────────────────────────────────────────
function AddTransactionModal({ wallets, onClose, onAdd }) {
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
    ? CATS.filter(c => ["salary","gift","other","save"].includes(c.id))
    : CATS.filter(c => c.id !== "salary");

  const numAmt = parseFloat(amount) || 0;
  const canAdd = numAmt > 0;
  const btnBg  = !canAdd ? T.accent : type === "expense" ? T.red : T.primary;

  if (wallets.length === 0) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.45)", display: "flex",
        alignItems: "center", justifyContent: "center", padding: 20 }}
        onClick={onClose}>
        <Card style={{ padding: 24, maxWidth: 320, textAlign: "center" }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>🏦</p>
          <p style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: T.text }}>No accounts yet</p>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: T.textMut }}>
            Add an account first before recording transactions.
          </p>
          <button onClick={onClose} style={{ background: T.primary, color: "#fff",
            border: "none", borderRadius: 11, padding: "11px 24px",
            fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            OK
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}
    onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ width: "100%", maxWidth: 480, background: T.card,
        borderRadius: "24px 24px 0 0", maxHeight: "94vh", overflowY: "auto",
        boxShadow: "0 -10px 40px rgba(0,0,0,0.16)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: T.accentDark }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "4px 18px 10px" }}>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: T.text }}>New Entry</p>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 99,
            background: T.accent, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} color={T.textSec} />
          </button>
        </div>

        {/* Type toggle */}
        <div style={{ display: "flex", margin: "0 18px 12px",
          background: T.accent, borderRadius: 12, padding: 4 }}>
          {[["expense","− Expense"],["income","+ Income"]].map(([v, l]) => (
            <button key={v} onClick={() => { setType(v); setCatId(v==="income"?"salary":"food"); }} style={{
              flex: 1, padding: "8px", borderRadius: 9, fontSize: 13, fontWeight: 700,
              border: "none", cursor: "pointer", transition: "all 0.15s",
              background: type===v ? (v==="expense" ? T.red : T.primary) : "transparent",
              color: type===v ? "#fff" : T.textSec,
              boxShadow: type===v ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
            }}>
              {l}
            </button>
          ))}
        </div>

        {/* Amount display */}
        <div style={{ textAlign: "center", padding: "2px 18px 10px" }}>
          <p style={{ margin: 0, fontSize: 10, color: T.textMut,
            textTransform: "uppercase", letterSpacing: "0.06em" }}>Amount</p>
          <p style={{ margin: "3px 0 0", fontSize: 42, fontWeight: 900,
            color: amount ? T.text : T.textMut, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            ₱{amount || "0"}
          </p>
        </div>

        {/* Category scroll */}
        <div style={{ display: "flex", gap: 6, padding: "0 18px 12px",
          overflowX: "auto", scrollbarWidth: "none" }}>
          {validCats.map(c => {
            const sel = catId === c.id;
            return (
              <button key={c.id} onClick={() => setCatId(c.id)} style={{
                minWidth: 54, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 4, padding: "8px 6px",
                borderRadius: 12, flexShrink: 0, cursor: "pointer",
                border: `2px solid ${sel ? c.color : T.border}`,
                background: sel ? c.bg : T.card, transition: "all 0.12s",
              }}>
                <c.Icon size={15} color={c.color} />
                <span style={{ fontSize: 9, fontWeight: 700,
                  color: sel ? c.color : T.textMut, whiteSpace: "nowrap" }}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Wallet + Note */}
        <div style={{ display: "flex", gap: 8, padding: "0 18px 10px" }}>
          <select value={walletId} onChange={e => setWalletId(e.target.value)} style={{
            flex: 1, padding: "10px 10px", borderRadius: 10, fontSize: 12, fontWeight: 600,
            border: `1.5px solid ${T.border}`, background: T.accent, color: T.text,
            fontFamily: "inherit",
          }}>
            {wallets.map(w => (
              <option key={w.id} value={w.id}>{w.emoji} {w.name}</option>
            ))}
          </select>
          <input value={note} onChange={e => setNote(e.target.value)}
            placeholder="Note (optional)" style={{
              flex: 1.5, padding: "10px 10px", borderRadius: 10, fontSize: 12,
              border: `1.5px solid ${T.border}`, background: T.accent, color: T.text,
              fontFamily: "inherit", outline: "none",
            }} />
        </div>

        {/* Date */}
        <div style={{ padding: "0 18px 12px" }}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ width: "100%", padding: "10px 10px", borderRadius: 10, fontSize: 13,
              border: `1.5px solid ${T.border}`, background: T.accent, color: T.text,
              fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
        </div>

        {/* Keypad */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)",
          gap: 6, padding: "0 18px 12px" }}>
          {KEYS.map(k => (
            <button key={k} onPointerDown={() => tap(k)} style={{
              padding: "13px 6px", borderRadius: 12,
              fontSize: k === "⌫" ? 18 : 20, fontWeight: k === "⌫" ? 400 : 700,
              border: `1px solid ${T.border}`, background: T.card,
              cursor: "pointer", color: T.text, userSelect: "none",
              WebkitTapHighlightColor: "transparent",
            }}>
              {k}
            </button>
          ))}
        </div>

        {/* Submit */}
        <div style={{ padding: "0 18px 24px" }}>
          <button onClick={submit} disabled={!canAdd} style={{
            width: "100%", padding: "15px", borderRadius: 14, fontSize: 15, fontWeight: 800,
            border: "none", cursor: canAdd ? "pointer" : "not-allowed",
            background: btnBg, color: !canAdd ? T.textMut : "#fff",
            boxShadow: canAdd ? `0 4px 14px ${btnBg}55` : "none", transition: "all 0.15s",
          }}>
            {canAdd
              ? `Save ${type === "expense" ? "Expense" : "Income"} · ${fmt(numAmt)}`
              : "Enter amount"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ADD WALLET MODAL ──────────────────────────────────────────────────────────
function AddWalletModal({ onClose, onAdd }) {
  const [name,    setName]    = useState("");
  const [emoji,   setEmoji]   = useState("🏦");
  const [type,    setType]    = useState("debit");
  const [color,   setColor]   = useState(WALLET_COLORS[0]);
  const [balance, setBalance] = useState("");

  const can = name.trim().length > 0;

  function submit() {
    if (!can) return;
    onAdd({
      name: name.trim(), emoji, type, color,
      balance: parseFloat(balance) || 0,
    });
    onClose();
  }

  // Auto-set emoji when type changes (only if still default)
  function handleTypeChange(t) {
    setType(t);
    const wt = WALLET_TYPES.find(x => x.id === t);
    if (wt && WALLET_EMOJIS.includes(emoji)) setEmoji(wt.defaultEmoji);
  }

  return (
    <ModalSheet title="Add Account" onClose={onClose}>
      {/* Emoji picker */}
      <div style={{ marginBottom: 16 }}>
        <FieldLabel>Icon</FieldLabel>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none",
          paddingBottom: 2 }}>
          {WALLET_EMOJIS.map(e => (
            <button key={e} onClick={() => setEmoji(e)} style={{
              width: 42, height: 42, flexShrink: 0, borderRadius: 12, fontSize: 22,
              border: `2px solid ${emoji === e ? T.primary : T.border}`,
              background: emoji === e ? T.accent : T.card,
              cursor: "pointer", transition: "all 0.12s",
            }}>
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Account Name</FieldLabel>
        <TextInput value={name} onChange={e => setName(e.target.value)}
          placeholder="e.g. BPI Savings, GCash, Wallet" />
      </div>

      {/* Type */}
      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Account Type</FieldLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {WALLET_TYPES.map(wt => {
            const sel = type === wt.id;
            return (
              <button key={wt.id} onClick={() => handleTypeChange(wt.id)} style={{
                padding: "11px 12px", borderRadius: 12, cursor: "pointer",
                border: `2px solid ${sel ? T.primary : T.border}`,
                background: sel ? T.accent : T.card,
                transition: "all 0.12s", textAlign: "left",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{wt.defaultEmoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 600,
                    color: sel ? T.primary : T.text }}>
                    {wt.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color */}
      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Color</FieldLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {WALLET_COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)} style={{
              width: 32, height: 32, borderRadius: 99, background: c, border: "none",
              cursor: "pointer", transition: "transform 0.12s",
              boxShadow: color === c ? `0 0 0 3px ${T.card}, 0 0 0 5px ${c}` : "none",
              transform: color === c ? "scale(1.15)" : "scale(1)",
            }} />
          ))}
        </div>
      </div>

      {/* Initial Balance */}
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Starting Balance</FieldLabel>
        <TextInput type="number" value={balance}
          onChange={e => setBalance(e.target.value)}
          placeholder="0.00 (leave blank for zero)" />
      </div>

      {/* Preview */}
      {name.trim() && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 14px", borderRadius: 14,
          background: T.accent, border: `1.5px solid ${T.accentDark}`,
          marginBottom: 16,
        }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, fontSize: 22,
            background: color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {emoji}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{name}</p>
            <p style={{ margin: "1px 0 0", fontSize: 11, color: T.textMut }}>
              {getWType(type).label} · {fmt(parseFloat(balance) || 0)}
            </p>
          </div>
        </div>
      )}

      <SubmitBtn onClick={submit} disabled={!can}
        label={can ? `Add "${name}" Account` : "Enter account name"} />
    </ModalSheet>
  );
}

// ── ADD BUDGET MODAL ──────────────────────────────────────────────────────────
function AddBudgetModal({ usedCats, onClose, onAdd }) {
  const available = CATS.filter(c => !usedCats.has(c.id));
  const [catId,  setCatId]  = useState(available[0]?.id ?? "");
  const [limit,  setLimit]  = useState("");
  const can = catId && parseFloat(limit) > 0;

  if (available.length === 0) {
    return (
      <ModalCenter title="Budgets" onClose={onClose}>
        <EmptyState emoji="✅" title="All categories budgeted"
          subtitle="You've set budgets for all available categories." />
      </ModalCenter>
    );
  }

  return (
    <ModalSheet title="Set Budget" onClose={onClose}>
      {/* Category grid */}
      <div style={{ marginBottom: 16 }}>
        <FieldLabel>Category</FieldLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {available.map(c => {
            const sel = catId === c.id;
            return (
              <button key={c.id} onClick={() => setCatId(c.id)} style={{
                padding: "10px 8px", borderRadius: 12, cursor: "pointer",
                border: `2px solid ${sel ? c.color : T.border}`,
                background: sel ? c.bg : T.card,
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 5, transition: "all 0.12s",
              }}>
                <c.Icon size={18} color={c.color} />
                <span style={{ fontSize: 11, fontWeight: 600,
                  color: sel ? c.color : T.text }}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Limit input */}
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Monthly Limit (₱)</FieldLabel>
        <TextInput type="number" value={limit}
          onChange={e => setLimit(e.target.value)}
          placeholder="e.g. 5000"
          style={{ fontSize: 22, fontWeight: 800 }} />
        {parseFloat(limit) > 0 && (
          <p style={{ margin: "5px 0 0", fontSize: 11, color: T.textMut }}>
            That's {fmt(parseFloat(limit) / 30)} per day
          </p>
        )}
      </div>

      <SubmitBtn onClick={() => { if (can) onAdd({ cat: catId, limit: parseFloat(limit) }); }}
        disabled={!can}
        label={can ? `Set ₱${Number(limit).toLocaleString()} Budget for ${getCat(catId).label}` : "Choose category + enter limit"} />
    </ModalSheet>
  );
}

// ── ADD GOAL MODAL ────────────────────────────────────────────────────────────
function AddGoalModal({ onClose, onAdd }) {
  const [name,     setName]     = useState("");
  const [emoji,    setEmoji]    = useState("🎯");
  const [target,   setTarget]   = useState("");
  const [deadline, setDeadline] = useState("");

  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const can = name.trim() && parseFloat(target) > 0 && deadline;

  return (
    <ModalSheet title="Create Goal" onClose={onClose}>
      {/* Emoji picker */}
      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Icon</FieldLabel>
        <div style={{ display: "flex", gap: 8, overflowX: "auto",
          scrollbarWidth: "none", paddingBottom: 2 }}>
          {GOAL_EMOJIS.map(e => (
            <button key={e} onClick={() => setEmoji(e)} style={{
              width: 42, height: 42, flexShrink: 0, borderRadius: 12, fontSize: 22,
              border: `2px solid ${emoji === e ? T.primary : T.border}`,
              background: emoji === e ? T.accent : T.card,
              cursor: "pointer", transition: "all 0.12s",
            }}>
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Goal Name</FieldLabel>
        <TextInput value={name} onChange={e => setName(e.target.value)}
          placeholder="e.g. Japan Trip, Emergency Fund" />
      </div>

      {/* Target amount */}
      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Target Amount (₱)</FieldLabel>
        <TextInput type="number" value={target}
          onChange={e => setTarget(e.target.value)}
          placeholder="e.g. 50000"
          style={{ fontSize: 20, fontWeight: 800 }} />
      </div>

      {/* Deadline */}
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Target Date</FieldLabel>
        <TextInput type="date" value={deadline}
          onChange={e => setDeadline(e.target.value)}
          style={{ min: minDate }} />
        {deadline && (
          <p style={{ margin: "5px 0 0", fontSize: 11, color: T.textMut }}>
            {Math.ceil((new Date(deadline) - new Date()) / 86400000)} days from now
            {parseFloat(target) > 0 && ` · ${fmt(parseFloat(target) / Math.ceil((new Date(deadline) - new Date()) / 86400000))}/day needed`}
          </p>
        )}
      </div>

      <SubmitBtn
        onClick={() => { if (can) onAdd({ name: name.trim(), emoji, target: parseFloat(target), deadline }); }}
        disabled={!can}
        label={can ? `Create Goal — ${emoji} ${name}` : "Fill in all fields"} />
    </ModalSheet>
  );
}

// ── ADD DEBT MODAL ────────────────────────────────────────────────────────────
function AddDebtModal({ onClose, onAdd }) {
  const [name,      setName]      = useState("");
  const [direction, setDirection] = useState("owe");
  const [amount,    setAmount]    = useState("");
  const [due,       setDue]       = useState("");
  const [note,      setNote]      = useState("");

  const can = name.trim() && parseFloat(amount) > 0 && due;

  return (
    <ModalSheet title="Add Debt / Receivable" onClose={onClose}>
      {/* Direction */}
      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Type</FieldLabel>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { id: "owe",  label: "I owe them",   color: T.red },
            { id: "owes", label: "They owe me",  color: T.primary },
          ].map(d => (
            <button key={d.id} onClick={() => setDirection(d.id)} style={{
              flex: 1, padding: "12px", borderRadius: 12, cursor: "pointer",
              border: `2px solid ${direction === d.id ? d.color : T.border}`,
              background: direction === d.id ? (d.id === "owe" ? T.redL : T.accent) : T.card,
              fontWeight: 700, fontSize: 13,
              color: direction === d.id ? d.color : T.text,
              transition: "all 0.12s",
            }}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Person's Name</FieldLabel>
        <TextInput value={name} onChange={e => setName(e.target.value)}
          placeholder="e.g. Marco, Anna" />
      </div>

      {/* Amount */}
      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Amount (₱)</FieldLabel>
        <TextInput type="number" value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="e.g. 1500"
          style={{ fontSize: 20, fontWeight: 800 }} />
      </div>

      {/* Due date */}
      <div style={{ marginBottom: 14 }}>
        <FieldLabel>Due Date</FieldLabel>
        <TextInput type="date" value={due} onChange={e => setDue(e.target.value)} />
      </div>

      {/* Note */}
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Note (Optional)</FieldLabel>
        <TextInput value={note} onChange={e => setNote(e.target.value)}
          placeholder="What's this debt for?" />
      </div>

      <SubmitBtn
        onClick={() => { if (can) onAdd({ name: name.trim(), direction, amount: parseFloat(amount), due, note }); }}
        disabled={!can}
        label={can
          ? (direction === "owe"
              ? `I owe ${name} ${fmt(parseFloat(amount))}`
              : `${name} owes me ${fmt(parseFloat(amount))}`)
          : "Fill in all required fields"}
        color={direction === "owe" ? T.red : T.primary} />
    </ModalSheet>
  );
}

// ── CONTRIBUTE TO GOAL MODAL ──────────────────────────────────────────────────
function ContributeModal({ goal, wallets, onClose, onContribute }) {
  const [amount,   setAmount]   = useState("");
  const [walletId, setWalletId] = useState(wallets[0]?.id ?? "");
  const wallet = wallets.find(w => w.id === walletId);
  const n   = parseFloat(amount) || 0;
  const max = Math.min(wallet?.balance ?? 0, goal.target - goal.saved);
  const ok  = n > 0 && wallet && n <= wallet.balance && goal.saved < goal.target;

  return (
    <ModalCenter title="Contribute to Goal" onClose={onClose}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 30 }}>{goal.emoji}</span>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>{goal.name}</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: T.textMut }}>
            {fmt(goal.saved)} saved of {fmt(goal.target)}
            · {fmt(goal.target - goal.saved)} remaining
          </p>
        </div>
      </div>

      <div style={{ height: 6, borderRadius: 99, background: T.accent,
        overflow: "hidden", marginBottom: 16 }}>
        <div style={{ height: "100%", borderRadius: 99,
          width: `${pctF(goal.saved, goal.target)}%`, background: T.primary }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <FieldLabel>Amount (₱)</FieldLabel>
        <TextInput type="number" value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder={`Max: ${fmt(max)}`}
          style={{ fontSize: 20, fontWeight: 800 }} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <FieldLabel>From Wallet</FieldLabel>
        <select value={walletId} onChange={e => setWalletId(e.target.value)} style={{
          width: "100%", padding: "11px 12px", borderRadius: 11, fontSize: 13,
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
          ⚠️ Exceeds {wallet.name} balance of {fmt(wallet.balance)}
        </p>
      )}

      <SubmitBtn
        onClick={() => { if (ok) { onContribute(goal.id, n, walletId); onClose(); } }}
        disabled={!ok}
        label={ok ? `Contribute ${fmt(n)} to ${goal.name}` : "Enter valid amount"} />
    </ModalCenter>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home",    Icon: Home,     label: "Home"    },
  { id: "wallet",  Icon: Wallet,   label: "Wallets" },
  { id: "__fab",   Icon: null,     label: ""        },
  { id: "history", Icon: BarChart3,label: "History" },
  { id: "plan",    Icon: Target,   label: "Plan"    },
];

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function TarsiApp() {
  const store = useStore();
  const { data } = store;

  const [view,       setView]       = useState("home");
  const [showAdd,    setShowAdd]    = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  // Load DM Sans font
  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;0,9..40,900&display=swap";
    document.head.appendChild(link);
    document.body.style.cssText = "margin:0;padding:0;background:#E8EDE4;";
    return () => { try { document.head.removeChild(link); } catch {} };
  }, []);

  const VIEW_LABELS = {
    home: "Dashboard", wallet: "Accounts",
    history: "Transactions", plan: "Planning", settings: "Settings",
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
      background: T.bg, minHeight: "100dvh",
      display: "flex", justifyContent: "center",
    }}>
      <div style={{
        width: "100%", maxWidth: 480, minHeight: "100dvh",
        background: T.bg, position: "relative",
        display: "flex", flexDirection: "column",
      }}>

        {/* ── Top Bar ── */}
        <div style={{
          padding: "44px 16px 12px", background: T.bg,
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              {view === "home" && (
                <p style={{ margin: 0, fontSize: 12, color: T.textMut, fontWeight: 500 }}>
                  {greeting}
                </p>
              )}
              <p style={{ margin: view === "home" ? "1px 0 0" : 0,
                fontSize: 22, fontWeight: 900, color: T.text }}>
                {VIEW_LABELS[view] ?? "Settings"}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* Add account shortcut in wallet view */}
              {view === "wallet" && (
                <button onClick={() => setShowWallet(true)} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: T.primary, color: "#fff", border: "none",
                  borderRadius: 99, padding: "8px 14px", fontSize: 12,
                  fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 3px 12px rgba(46,125,50,0.3)",
                }}>
                  <Plus size={14} color="#fff" strokeWidth={2.5} />
                  Add Account
                </button>
              )}

              <button onClick={() => setView("settings")} style={{
                width: 36, height: 36, borderRadius: 99, background: T.card,
                border: `1px solid ${T.border}`, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: T.shadow,
              }}>
                <Settings size={15}
                  color={view === "settings" ? T.primary : T.textSec}
                  strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Scrollable Content ── */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 84,
          scrollbarWidth: "none" }}>
          {view === "home"    && <DashboardView data={data} />}
          {view === "wallet"  && (
            <WalletView data={data}
              onAddWallet={() => setShowWallet(true)}
              onDeleteWallet={store.deleteWallet} />
          )}
          {view === "history" && (
            <HistoryView data={data} onDelete={store.deleteTransaction} />
          )}
          {view === "plan"    && (
            <PlanView data={data} store={store} />
          )}
          {view === "settings" && (
            <SettingsView data={data}
              onReset={() => { store.resetData(); setView("home"); }} />
          )}
        </div>

        {/* ── FAB (Add Transaction) ── */}
        <button onClick={() => setShowAdd(true)} style={{
          position: "fixed",
          bottom: 70, left: "50%", transform: "translateX(-50%)",
          width: 56, height: 56, borderRadius: 28,
          background: "linear-gradient(135deg, #43A047, #2E7D32)",
          border: "none", cursor: "pointer", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(46,125,50,0.44)",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateX(-50%) scale(1.07)";
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(46,125,50,0.56)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateX(-50%)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(46,125,50,0.44)";
        }}
        >
          <Plus size={26} color="#fff" strokeWidth={2.5} />
        </button>

        {/* ── Bottom Nav ── */}
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 480,
          background: T.card, borderTop: `1px solid ${T.border}`,
          display: "flex", zIndex: 100,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}>
          {NAV_ITEMS.map(item => {
            if (item.id === "__fab") return <div key="fab-gap" style={{ flex: 1 }} />;
            const active = view === item.id;
            const Icon   = item.Icon;
            return (
              <button key={item.id} onClick={() => setView(item.id)} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", padding: "9px 0 11px",
                background: "none", border: "none", cursor: "pointer", gap: 2,
              }}>
                <div style={{
                  width: 40, height: 26, borderRadius: 13,
                  background: active ? T.accent : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                }}>
                  <Icon size={20} color={active ? T.primary : T.textMut}
                    strokeWidth={active ? 2.2 : 1.6} />
                </div>
                <span style={{ fontSize: 9, fontWeight: active ? 700 : 400,
                  color: active ? T.primary : T.textMut }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Global Modals ── */}
      {showAdd && (
        <AddTransactionModal
          wallets={data.wallets}
          onClose={() => setShowAdd(false)}
          onAdd={store.addTransaction} />
      )}
      {showWallet && (
        <AddWalletModal
          onClose={() => setShowWallet(false)}
          onAdd={store.addWallet} />
      )}
    </div>
  );
}
