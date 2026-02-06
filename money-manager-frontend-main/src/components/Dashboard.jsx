import { useMemo, useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Flame,
  ArrowRightLeft,
  Plus,
} from "lucide-react";

import TransactionDrawer from "../components/TransactionDrawer";
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/api";

export default function Dashboard({ transactions = [], reload }) {
  const [mode, setMode] = useState("Monthly");

  // Drawer state
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const filteredTx = useMemo(() => {
    const now = new Date();

    return transactions.filter((t) => {
      const d = new Date(t.date);

      if (mode === "Weekly") {
        const diffDays = (now - d) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }

      if (mode === "Monthly") {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }

      if (mode === "Yearly") {
        return d.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [transactions, mode]);

  const summary = useMemo(() => {
    const income = filteredTx
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + b.amount, 0);

    const expense = filteredTx
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + b.amount, 0);

    const transfer = filteredTx
      .filter((t) => t.type === "transfer")
      .reduce((a, b) => a + b.amount, 0);

    return { income, expense, transfer, balance: income - expense };
  }, [filteredTx]);

  const history = useMemo(() => {
    return [...filteredTx]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);
  }, [filteredTx]);

  const topCategory = useMemo(() => {
    const map = {};

    filteredTx.forEach((t) => {
      if (t.type === "expense") {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    });

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    if (!sorted.length) return { name: "Other", amount: 0 };

    return { name: sorted[0][0], amount: sorted[0][1] };
  }, [filteredTx]);

  // ✅ Animated values
  const [animatedIncome, setAnimatedIncome] = useState(0);
  const [animatedExpense, setAnimatedExpense] = useState(0);
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [animatedTopAmount, setAnimatedTopAmount] = useState(0);

  useEffect(() => {
    animateValue(summary.income, setAnimatedIncome);
    animateValue(summary.expense, setAnimatedExpense);
    animateValue(summary.balance, setAnimatedBalance);
    animateValue(topCategory.amount, setAnimatedTopAmount);
  }, [summary, topCategory]);

  function animateValue(target, setter) {
    let start = 0;
    const duration = 900;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;

      if (start >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }

  const formatMoney = (num) => new Intl.NumberFormat("en-IN").format(num);

  return (
    <div className="relative min-h-screen overflow-hidden rounded-3xl">
      {/* New Soft Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-44 -left-44 h-[560px] w-[560px] rounded-full bg-sky-500/18 blur-[150px] animate-blob1" />
        <div className="absolute -bottom-56 -right-52 h-[680px] w-[680px] rounded-full bg-emerald-500/14 blur-[170px] animate-blob2" />
        <div className="absolute top-[30%] left-[40%] h-[460px] w-[460px] rounded-full bg-fuchsia-500/10 blur-[160px] animate-blob3" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/30 dark:from-zinc-950/40 dark:via-transparent dark:to-zinc-950/30" />
      </div>

      {/* Header Card */}
      <div className="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/60 backdrop-blur shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              Overview
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Dashboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
              Track your money with clean insights ✨
            </p>
          </div>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="px-5 py-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/60 backdrop-blur text-sm font-semibold outline-none shadow-sm hover:shadow-md transition"
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Cards (new look, same component) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <PremiumCard
          title="Income"
          value={`₹${formatMoney(animatedIncome)}`}
          sub="Money received"
          icon={<TrendingUp size={20} />}
          accent="green"
        />

        <PremiumCard
          title="Expense"
          value={`₹${formatMoney(animatedExpense)}`}
          sub="Money spent"
          icon={<TrendingDown size={20} />}
          accent="red"
        />

        <PremiumCard
          title="Balance"
          value={`₹${formatMoney(animatedBalance)}`}
          sub="Available cash"
          icon={<Wallet size={20} />}
          accent="sky"
        />

        <PremiumCard
          title="Top Category"
          value={`₹${formatMoney(animatedTopAmount)}`}
          sub={topCategory.name}
          icon={<Flame size={20} />}
          accent="amber"
        />
      </div>

      {/* History Panel */}
      <div className="mt-10 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/60 backdrop-blur shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-5 border-b border-gray-200 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
              Latest {history.length} transactions ({mode})
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300">
            {mode} View
          </div>
        </div>

        {history.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
              No transactions yet 💸
            </p>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
              Add your first transaction and start tracking.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-zinc-800">
            {history.map((t) => (
              <div
                key={t._id}
                className="flex justify-between items-center px-6 py-4 hover:bg-gray-50/70 dark:hover:bg-zinc-900/40 transition cursor-pointer"
                onClick={() => {
                  setSelectedTx(t);
                  setOpenDrawer(true);
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 flex items-center justify-center rounded-2xl border shadow-sm
                      ${
                        t.type === "income"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                          : t.type === "expense"
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                          : "bg-sky-500/10 border-sky-500/20 text-sky-600"
                      }`}
                  >
                    {t.type === "transfer" ? (
                      <ArrowRightLeft size={18} />
                    ) : t.type === "income" ? (
                      <TrendingUp size={18} />
                    ) : (
                      <TrendingDown size={18} />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {t.type === "transfer"
                        ? `${t.accountFrom} → ${t.accountTo}`
                        : t.description}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                      {t.category} • {t.division} •{" "}
                      {new Date(t.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-extrabold text-sm ${
                      t.type === "income"
                        ? "text-emerald-600"
                        : t.type === "expense"
                        ? "text-rose-500"
                        : "text-sky-600"
                    }`}
                  >
                    {t.type === "expense" ? "-" : "+"}₹{formatMoney(t.amount)}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">{t.accountFrom}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating + Button */}
      <button
        onClick={() => {
          setSelectedTx(null);
          setOpenDrawer(true);
        }}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-2xl transition active:scale-95"
      >
        <Plus size={26} />
        <span className="absolute inset-0 rounded-2xl bg-white/10 blur-xl animate-pingSlow"></span>
      </button>

      {/* Drawer */}
      <TransactionDrawer
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
          setSelectedTx(null);
        }}
        transaction={selectedTx}
        onSubmit={async (data) => {
          if (selectedTx) {
            await updateTransaction(selectedTx._id, data);
          } else {
            await addTransaction(data);
          }

          await reload();
          setOpenDrawer(false);
          setSelectedTx(null);
        }}
        onDelete={async (id) => {
          await deleteTransaction(id);
          await reload();
          setOpenDrawer(false);
          setSelectedTx(null);
        }}
      />

      {/* Animations */}
      <style>
        {`
          @keyframes blob1 {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(70px, 55px) scale(1.18); }
          }

          @keyframes blob2 {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(-85px, -65px) scale(1.22); }
          }

          @keyframes blob3 {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(55px, -70px) scale(1.16); }
          }

          @keyframes pingSlow {
            0% { transform: scale(1); opacity: 0.35; }
            100% { transform: scale(1.7); opacity: 0; }
          }

          .animate-blob1 { animation: blob1 12s ease-in-out infinite; }
          .animate-blob2 { animation: blob2 14s ease-in-out infinite; }
          .animate-blob3 { animation: blob3 11s ease-in-out infinite; }
          .animate-pingSlow { animation: pingSlow 2.6s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
}

function PremiumCard({ title, value, sub, icon, accent }) {
  const accentStyles = {
    green: "from-emerald-500/18 to-emerald-500/5 border-emerald-500/20",
    red: "from-rose-500/18 to-rose-500/5 border-rose-500/20",
    sky: "from-sky-500/18 to-sky-500/5 border-sky-500/20",
    amber: "from-amber-500/18 to-amber-500/5 border-amber-500/20",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${
        accentStyles[accent]
      } p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-white/25 blur-3xl"></div>

      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
          {title}
        </p>

        <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-gray-200/60 dark:border-zinc-800 shadow-sm">
          {icon}
        </div>
      </div>

      <p className="text-2xl font-extrabold mt-5 tracking-tight text-gray-900 dark:text-white">
        {value}
      </p>

      <p className="text-xs text-gray-600 dark:text-zinc-400 mt-2">{sub}</p>
    </div>
  );
}
