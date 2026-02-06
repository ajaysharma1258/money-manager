import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Layers,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ collapsed, setCollapsed, accounts = [] }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Transactions", path: "/transactions", icon: <ArrowLeftRight size={18} /> },
    { name: "Accounts", path: "/accounts", icon: <Wallet size={18} /> },
    { name: "Categories", path: "/categories", icon: <Layers size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
  ];

  return (
    <div
      className={`h-screen fixed left-0 top-0 flex flex-col transition-all duration-300
      border-r border-gray-200 dark:border-zinc-800
      bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl
      ${collapsed ? "w-20" : "w-72"}`}
    >
      {/* TOP HEADER */}
      <div className="flex items-center justify-between px-3 py-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-11 h-11 flex items-center justify-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/40 hover:shadow-sm transition"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {!collapsed && (
          <button className="w-11 h-11 flex items-center justify-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/40 hover:shadow-sm transition">
            <RotateCw size={18} />
          </button>
        )}
      </div>

      {/* BRAND */}
      {!collapsed && (
        <div className="px-4 pt-1 pb-3">
          <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gradient-to-r from-sky-500/10 via-transparent to-emerald-500/10 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              Money Manager
            </p>
            <p className="text-sm font-extrabold text-gray-900 dark:text-white mt-1">
              Personal Finance
            </p>
          </div>
        </div>
      )}

      {/* MENU */}
      <div className="flex flex-col gap-1 px-3 mt-1">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold transition
                ${
                  active
                    ? "bg-sky-500/12 border border-sky-500/20 text-sky-700 dark:text-sky-300"
                    : "text-gray-700 dark:text-zinc-200 hover:bg-gray-100/70 dark:hover:bg-zinc-900/50"
                }`}
            >
              <span className={`${active ? "text-sky-600" : "text-gray-500 dark:text-zinc-400"}`}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.name}</span>}
            </button>
          );
        })}
      </div>

      {/* ACCOUNTS DASHBOARD */}
      {!collapsed && (
        <div className="px-4 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Accounts
            </h3>
            <span className="text-xs text-gray-500">{accounts.length}</span>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/40 backdrop-blur p-3 space-y-2 shadow-sm">
            {accounts.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3">
                No accounts yet
              </p>
            ) : (
              accounts.map((acc) => (
                <div
                  key={acc._id}
                  className="flex justify-between items-center px-3 py-2 rounded-2xl hover:bg-gray-50/80 dark:hover:bg-zinc-900/50 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <p className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                      {acc.name}
                    </p>
                  </div>

                  <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                    ₹{acc.balance.toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Bottom links */}
      <div className="mt-auto flex flex-col gap-2 px-4 pb-6 text-sm">
        <button className="flex items-center gap-2 text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white transition">
          <HelpCircle size={18} />
          {!collapsed && "Get Help"}
        </button>

        <button className="flex items-center gap-2 text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white transition">
          <Settings size={18} />
          {!collapsed && "Settings"}
        </button>
      </div>
    </div>
  );
}
