import { useMemo, useState } from "react";
import { Search, Flame, Sparkles, ArrowUpDown } from "lucide-react";

/* PREMIUM CATEGORY ICONS */
const categoryIcons = {
  Food: "🍔",
  Groceries: "🛒",
  Fuel: "⛽",
  Petrol: "⛽",
  Diesel: "⛽",
  Movie: "🎬",
  Entertainment: "🎮",
  Shopping: "🛍️",
  Travel: "✈️",
  Rent: "🏠",
  EMI: "🏦",
  Loan: "💳",
  Recharge: "📱",
  Electricity: "⚡",
  WaterBill: "🚰",
  Internet: "📶",
  Medical: "🩺",
  Hospital: "🏥",
  Education: "📚",
  WorkExpenses: "💼",
  Office: "🏢",
  Salary: "💰",
  Investment: "📈",
  Savings: "💎",
  Gift: "🎁",
  Insurance: "🛡️",
  Taxi: "🚕",
  Bike: "🏍️",
  Car: "🚗",
  Restaurant: "🍽️",
  Coffee: "☕",
  Snacks: "🍟",
  Clothes: "👕",
  Electronics: "💻",
  Repair: "🔧",
  Beauty: "💄",
  Gym: "🏋️",
  Subscription: "📺",
  Donation: "🤝",
  Other: "🧾",
  food: "🍔",
  groceries: "🛒",
  fuel: "⛽",
  petrol: "⛽",
  diesel: "⛽",
  movie: "🎬",
  entertainment: "🎮",
  shopping: "🛍️",
  travel: "✈️",
  rent: "🏠",
  emi: "🏦",
  loan: "💳",
  recharge: "📱",
  electricity: "⚡",
  waterbill: "🚰",
  internet: "📶",
  medical: "🩺",
  hospital: "🏥",
  education: "📚",
  workexpenses: "💼",
  office: "🏢",
  salary: "💰",
  investment: "📈",
  savings: "💎",
  gift: "🎁",
  insurance: "🛡️",
  taxi: "🚕",
  bike: "🏍️",
  car: "🚗",
  restaurant: "🍽️",
  coffee: "☕",
  snacks: "🍟",
  clothes: "👕",
  electronics: "💻",
  repair: "🔧",
  beauty: "💄",
  gym: "🏋️",
  subscription: "📺",
  donation: "🤝",
};

export default function CategoriesPage({ transactions = [] }) {
  const [search, setSearch] = useState("");
  const [division, setDivision] = useState("All");
  const [sortBy, setSortBy] = useState("high"); // high | low | name

  const { list, totalExpense } = useMemo(() => {
    const map = {};

    transactions.forEach((t) => {
      if (t.type === "expense") {
        if (division !== "All" && t.division !== division) return;

        const cat = t.category || "Other";
        map[cat] = (map[cat] || 0) + t.amount;
      }
    });

    const totalExpense = Object.values(map).reduce((a, b) => a + b, 0);

    let list = Object.entries(map).map(([name, amount]) => ({
      name,
      amount,
      percent: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
    }));

    // Search filter
    if (search.trim()) {
      list = list.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === "high") list.sort((a, b) => b.amount - a.amount);
    if (sortBy === "low") list.sort((a, b) => a.amount - b.amount);
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    return { list, totalExpense };
  }, [transactions, division, search, sortBy]);

  const topCategory = list.length > 0 ? list[0] : null;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/60 backdrop-blur shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              Smart spending breakdown
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Categories
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Division segmented control */}
            <div className="inline-flex rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/80 dark:bg-zinc-900/60 p-1">
              {["All", "Personal", "Office"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDivision(d)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition
                    ${
                      division === d
                        ? "bg-sky-600 text-white shadow"
                        : "text-gray-600 dark:text-zinc-200 hover:bg-white/70 dark:hover:bg-zinc-950/50"
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Total */}
            <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/50 px-5 py-3 text-sm shadow-sm">
              <span className="text-gray-600 dark:text-zinc-300">
                Total Spent:
              </span>{" "}
              <span className="font-extrabold text-gray-900 dark:text-white">
                ₹{totalExpense.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* SEARCH + SORT */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/60 px-4 py-3 shadow-sm w-full md:w-[360px]">
            <Search size={16} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category..."
              className="bg-transparent outline-none text-sm w-full text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/60 text-sm text-gray-900 dark:text-white outline-none shadow-sm"
            >
              <option value="high">Highest spent</option>
              <option value="low">Lowest spent</option>
              <option value="name">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* EMPTY */}
      {list.length === 0 && (
        <div className="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/60 backdrop-blur shadow-sm p-14 text-center">
          <p className="text-gray-600 dark:text-zinc-300 text-sm">
            No expenses found. Add some transactions to see insights ✨
          </p>
        </div>
      )}

      {/* TOP CATEGORY */}
      {topCategory && (
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/60 backdrop-blur shadow-sm p-8">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-zinc-400">
                Top Spending Category
              </p>

              <h3 className="text-3xl font-extrabold mt-2 flex items-center gap-3 text-gray-900 dark:text-white">
                <Flame className="text-orange-500" size={28} />
                <span className="text-4xl">
                  {categoryIcons[topCategory.name] || "✨"}
                </span>
                {topCategory.name}
                <Sparkles className="text-sky-600" size={20} />
              </h3>

              <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
                Biggest drain this period — now you know where to optimize 👀
              </p>
            </div>

            <div className="flex items-center gap-6">
              <DonutChart percent={topCategory.percent} />

              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  Total spent
                </p>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                  ₹{topCategory.amount.toFixed(2)}
                </p>

                <p className="text-xs mt-2 text-sky-600 dark:text-sky-400 font-semibold">
                  {topCategory.percent.toFixed(1)}% of total expenses
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((cat, index) => (
          <div
            key={cat.name}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/60 backdrop-blur shadow-sm p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-sky-500/10 to-emerald-500/10 blur-2xl" />

            <div className="relative flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Rank #{index + 1}
                </p>

                <h3 className="text-xl font-extrabold mt-2 flex items-center gap-2 text-gray-900 dark:text-white">
                  <span className="text-3xl">{categoryIcons[cat.name] || "✨"}</span>
                  {cat.name}
                  {index < 3 && (
                    <span className="text-xs ml-2 px-2 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold">
                      Hot
                    </span>
                  )}
                </h3>

                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
                  {cat.percent.toFixed(1)}% usage
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <DonutChartMini percent={cat.percent} />
                <p className="text-lg font-extrabold text-rose-500">
                  ₹{cat.amount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="relative mt-5 h-2 w-full rounded-full bg-gray-200/70 dark:bg-zinc-800 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-sky-600 to-emerald-500"
                style={{ width: `${cat.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* BIG DONUT */
function DonutChart({ percent }) {
  const radius = 42;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="currentColor"
          className="text-gray-200 dark:text-zinc-800"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="currentColor"
          className="text-sky-600"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.9s ease-in-out",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      <div className="absolute text-center">
        <p className="text-base font-extrabold text-gray-900 dark:text-white">
          {percent.toFixed(0)}%
        </p>
        <p className="text-[10px] text-gray-500 dark:text-zinc-400">spent</p>
      </div>
    </div>
  );
}

/* MINI DONUT */
function DonutChartMini({ percent }) {
  const radius = 22;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="currentColor"
          className="text-gray-200 dark:text-zinc-800"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="currentColor"
          className="text-sky-600"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.9s ease-in-out",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      <div className="absolute text-center">
        <p className="text-[11px] font-extrabold text-gray-900 dark:text-white">
          {percent.toFixed(0)}%
        </p>
      </div>
    </div>
  );
}
