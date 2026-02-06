import TransactionDrawer from "../components/TransactionDrawer";
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/api";

import { useMemo, useState } from "react";
import {
  Plus,
  Download,
  Search,
  Pencil,
  Filter,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Repeat2,
} from "lucide-react";

export default function TransactionsPage({ transactions = [], reload }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  // Show/Hide Filters
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [division, setDivision] = useState("All");
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const exportCSV = () => {
    if (!filtered.length) return;

    const headers = [
      "Type",
      "Amount",
      "Description",
      "Category",
      "Division",
      "Account From",
      "Account To",
      "Date",
    ];

    const rows = filtered.map((t) => [
      t.type,
      t.amount,
      t.description,
      t.category,
      t.division,
      t.accountFrom,
      t.accountTo || "",
      new Date(t.date).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    transactions.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return ["All", ...Array.from(cats)];
  }, [transactions]);

  // Icon function
  const getTxIcon = (txType) => {
    if (txType === "income")
      return <ArrowDownLeft size={18} className="text-emerald-600" />;

    if (txType === "expense")
      return <ArrowUpRight size={18} className="text-rose-500" />;

    if (txType === "transfer")
      return <Repeat2 size={18} className="text-sky-600" />;

    return null;
  };

  // Apply filters
  const filtered = useMemo(() => {
    return (transactions || []).filter((t) => {
      const descMatch = (t.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const divisionMatch = division === "All" ? true : t.division === division;
      const typeMatch = type === "All" ? true : t.type === type;
      const categoryMatch = category === "All" ? true : t.category === category;

      // Date filter
      const txDate = new Date(t.date);

      const fromMatch = fromDate ? txDate >= new Date(fromDate) : true;
      const toMatch = toDate ? txDate <= new Date(toDate) : true;

      return (
        descMatch &&
        divisionMatch &&
        typeMatch &&
        categoryMatch &&
        fromMatch &&
        toMatch
      );
    });
  }, [transactions, searchTerm, division, type, category, fromDate, toDate]);

  // Group by date
  const grouped = useMemo(() => {
    const groups = {};

    filtered.forEach((t) => {
      const d = new Date(t.date);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let label = d.toDateString();

      if (d.toDateString() === today.toDateString()) label = "Today";
      else if (d.toDateString() === yesterday.toDateString()) label = "Yesterday";

      if (!groups[label]) groups[label] = [];
      groups[label].push(t);
    });

    return groups;
  }, [filtered]);

  const clearFilters = () => {
    setDivision("All");
    setType("All");
    setCategory("All");
    setFromDate("");
    setToDate("");
    setSearchTerm("");
  };

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/60 backdrop-blur shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-sky-500/10 via-transparent to-emerald-500/10">
        <div>
          <h2 className="font-extrabold text-lg text-gray-900 dark:text-white">
            Transactions
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Search, filter, export and manage entries
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Download */}
          <button
            onClick={exportCSV}
            className="h-10 w-10 inline-flex items-center justify-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/40 text-gray-600 dark:text-zinc-200 hover:shadow-sm transition"
            title="Export CSV"
          >
            <Download size={18} />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 border border-gray-200 dark:border-zinc-800 rounded-2xl px-4 py-2 bg-white/70 dark:bg-zinc-950/40">
            <Search size={16} className="text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search description..."
              className="bg-transparent outline-none text-sm w-56 text-gray-900 dark:text-white"
            />
          </div>

          {/* Add */}
          <button
            onClick={() => {
              setSelectedTx(null);
              setOpenDrawer(true);
            }}
            className="h-10 px-4 rounded-2xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition shadow-sm inline-flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add</span>
          </button>

          {/* Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-10 w-10 inline-flex items-center justify-center rounded-2xl border transition
              ${
                showFilters
                  ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                  : "border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/40 text-gray-600 dark:text-zinc-200 hover:shadow-sm"
              }`}
            title="Filters"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 border border-gray-200 dark:border-zinc-800 rounded-2xl px-4 py-3 bg-white/70 dark:bg-zinc-950/40">
          <Search size={16} className="text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search description..."
            className="bg-transparent outline-none text-sm w-full text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/50">
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showFilters ? "max-h-[280px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                Filters
              </p>

              <button
                onClick={clearFilters}
                className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
              >
                <X size={14} /> Clear
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="px-3 py-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/50 text-sm outline-none text-gray-900 dark:text-white"
              >
                <option value="All">All Divisions</option>
                <option value="Personal">Personal</option>
                <option value="Office">Office</option>
              </select>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="px-3 py-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/50 text-sm outline-none text-gray-900 dark:text-white"
              >
                <option value="All">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="transfer">Transfer</option>
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/50 text-sm outline-none text-gray-900 dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/50 text-sm outline-none text-gray-900 dark:text-white"
              />

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/50 text-sm outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="divide-y divide-gray-200 dark:divide-zinc-800">
        {Object.keys(grouped).length === 0 && (
          <div className="p-16 text-center">
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
              No transactions yet 💸
            </p>

            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2 max-w-md mx-auto">
              Start tracking your income & expenses. Add your first transaction and make
              your money behave.
            </p>

            <button
              onClick={() => {
                setSelectedTx(null);
                setOpenDrawer(true);
              }}
              className="mt-6 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-sm transition"
            >
              + Add Transaction
            </button>
          </div>
        )}

        {Object.entries(grouped).map(([label, items]) => (
          <div key={label}>
            <div className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-zinc-400 bg-gray-50/70 dark:bg-zinc-900/40">
              {label}
            </div>

            {items.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/70 dark:hover:bg-zinc-900/40 transition"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4 w-[70%]">
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
                      {t.description || t.category}
                    </p>

                    {t.type === "transfer" ? (
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                        {t.accountFrom} → {t.accountTo}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                        {t.accountFrom || "Manual account"}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-1">
                      {t.division} • {new Date(t.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedTx(t);
                      setOpenDrawer(true);
                    }}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/40 text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>

                  <span className="text-xs px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold">
                    {t.category?.toUpperCase() || "OTHER"}
                  </span>

                  <p
                    className={`w-28 text-right font-extrabold ${
                      t.type === "expense"
                        ? "text-rose-500"
                        : t.type === "income"
                        ? "text-emerald-600"
                        : "text-sky-600"
                    }`}
                  >
                    {t.type === "expense" ? "-" : "+"}₹{t.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

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
    </div>
  );
}
