import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Repeat2,
  Landmark,
} from "lucide-react";

import { getAccounts, getTransactions } from "../services/api";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);

  // Animated Total Money
  const [animatedTotal, setAnimatedTotal] = useState(0);

  // Animated balances per account
  const [animatedBalances, setAnimatedBalances] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const accRes = await getAccounts();
    const txRes = await getTransactions();

    const accData = accRes.data || [];
    const txData = txRes.data || [];

    setAccounts(accData);
    setTransactions(txData);

    if (accData.length > 0) {
      setActiveAccount(accData[0]);
    }
  };

  // Total Balance
  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }, [accounts]);

  // Animate Total Money
  useEffect(() => {
    animateValue(totalBalance, setAnimatedTotal);
  }, [totalBalance]);

  // Animate each account balance
  useEffect(() => {
    accounts.forEach((acc) => {
      animateValue(acc.balance, (val) => {
        setAnimatedBalances((prev) => ({
          ...prev,
          [acc._id]: val,
        }));
      });
    });
  }, [accounts]);

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

  const formatMoney = (num) => {
    return new Intl.NumberFormat("en-IN").format(num || 0);
  };

  // Filter account wise transactions
  const accountTx = useMemo(() => {
    if (!activeAccount) return [];

    return transactions
      .filter((t) => {
        if (t.type === "transfer") {
          return (
            t.accountFrom === activeAccount.name ||
            t.accountTo === activeAccount.name
          );
        }
        return t.accountFrom === activeAccount.name;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, activeAccount]);

  const getTxIcon = (type) => {
    if (type === "income")
      return <ArrowDownLeft size={18} className="text-emerald-600" />;

    if (type === "expense")
      return <ArrowUpRight size={18} className="text-rose-500" />;

    if (type === "transfer")
      return <Repeat2 size={18} className="text-sky-600" />;

    return <Wallet size={18} className="text-gray-500" />;
  };

  return (
    <div className="relative min-h-screen">
      {/* Soft Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-sky-400/20 blur-[120px] animate-liquid1" />
        <div className="absolute -bottom-44 -right-48 h-[620px] w-[620px] rounded-full bg-emerald-400/15 blur-[140px] animate-liquid2" />
        <div className="absolute top-[35%] left-[35%] h-[420px] w-[420px] rounded-full bg-fuchsia-400/10 blur-[130px] animate-liquid3" />
      </div>

      {/* Header */}
      <div className="mb-7 flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white/70 dark:bg-zinc-950/60 border border-gray-200 dark:border-zinc-800 px-4 py-2 shadow-sm backdrop-blur">
            <Landmark size={18} className="text-sky-600" />
            <span className="text-sm font-semibold text-gray-800 dark:text-zinc-100">
              Accounts
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Your balances, simplified
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            A clean overview of your money across accounts 💳
          </p>
        </div>
      </div>

      {/* Top section: Total + Active Account summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Total */}
        <div className="lg:col-span-2 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/60 backdrop-blur shadow-sm p-7 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                Total balance
              </p>
              <p className="mt-3 text-4xl font-extrabold text-gray-900 dark:text-white">
                ₹{formatMoney(animatedTotal)}
              </p>
              <p className="mt-2 text-xs text-gray-500 dark:text-zinc-500">
                Combined from all accounts
              </p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-sky-600/10 border border-sky-600/20 flex items-center justify-center">
              <Wallet className="text-sky-600" size={22} />
            </div>
          </div>
        </div>

        {/* Active account mini card */}
        <div className="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/60 backdrop-blur shadow-sm p-7 overflow-hidden relative">
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/12 blur-3xl" />
          <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-400">
            Active account
          </p>
          <p className="mt-3 text-lg font-bold text-gray-900 dark:text-white">
            {activeAccount ? activeAccount.name : "—"}
          </p>
          <p className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white">
            ₹{formatMoney(activeAccount ? animatedBalances[activeAccount._id] || 0 : 0)}
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-zinc-500">
            Current balance
          </p>
        </div>
      </div>

      {/* Main split layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Accounts list */}
        <div className="xl:col-span-1">
          <div className="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/60 backdrop-blur shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Your Accounts
              </h3>
              <span className="text-xs text-gray-500 dark:text-zinc-400">
                {accounts.length} total
              </span>
            </div>

            {accounts.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  No accounts yet 💳
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                  Accounts will appear here once data is loaded.
                </p>
              </div>
            ) : (
              <div className="p-3 space-y-3">
                {accounts.map((acc) => {
                  const active = activeAccount?.name === acc.name;
                  return (
                    <button
                      key={acc._id}
                      onClick={() => setActiveAccount(acc)}
                      className={`w-full text-left rounded-2xl border px-4 py-4 transition shadow-sm hover:shadow-md
                        ${
                          active
                            ? "border-sky-500/40 bg-sky-500/10"
                            : "border-gray-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 hover:bg-gray-50 dark:hover:bg-zinc-900/40"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {acc.name}
                          </p>
                          <p className="mt-2 text-xl font-extrabold text-gray-900 dark:text-white">
                            ₹{formatMoney(animatedBalances[acc._id] || 0)}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                            Balance
                          </p>
                        </div>
                        <div
                          className={`h-11 w-11 rounded-2xl flex items-center justify-center border
                            ${
                              active
                                ? "bg-sky-600/10 border-sky-600/20"
                                : "bg-gray-100 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                            }`}
                        >
                          <Wallet size={18} className={active ? "text-sky-600" : "text-gray-500"} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Transactions */}
        <div className="xl:col-span-2">
          <div className="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/60 backdrop-blur shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                  {activeAccount ? `${activeAccount.name} History` : "History"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                  Latest transactions for this account
                </p>
              </div>
            </div>

            {accountTx.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  No transactions yet 🚀
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                  Once you add transactions, they’ll show here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-zinc-800">
                {accountTx.slice(0, 12).map((t) => (
                  <div
                    key={t._id}
                    className="flex justify-between items-center px-6 py-4 hover:bg-gray-50/70 dark:hover:bg-zinc-900/40 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-11 h-11 flex items-center justify-center rounded-2xl border shadow-sm
                          ${
                            t.type === "income"
                              ? "bg-emerald-500/10 border-emerald-500/20"
                              : t.type === "expense"
                              ? "bg-rose-500/10 border-rose-500/20"
                              : "bg-sky-500/10 border-sky-500/20"
                          }`}
                      >
                        {getTxIcon(t.type)}
                      </div>

                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                          {t.type === "transfer"
                            ? `${t.accountFrom} → ${t.accountTo}`
                            : t.description || t.category}
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

                      <p className="text-xs text-gray-400 mt-1">
                        {t.type === "transfer" ? "Transfer" : t.accountFrom}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes liquid1 {
            0%,100% { transform: translate(0px,0px) scale(1); }
            50% { transform: translate(80px,50px) scale(1.2); }
          }
          @keyframes liquid2 {
            0%,100% { transform: translate(0px,0px) scale(1); }
            50% { transform: translate(-90px,-70px) scale(1.3); }
          }
          @keyframes liquid3 {
            0%,100% { transform: translate(0px,0px) scale(1); }
            50% { transform: translate(60px,-70px) scale(1.15); }
          }

          .animate-liquid1 { animation: liquid1 12s ease-in-out infinite; }
          .animate-liquid2 { animation: liquid2 14s ease-in-out infinite; }
          .animate-liquid3 { animation: liquid3 10s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
}
