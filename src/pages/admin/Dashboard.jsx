import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { usePageTitle } from "@hooks";
import {
  Widget,
  TransactionHistory,
  FinancialChart,
} from "@components/molecules";
import { listWidget, dataFinancialChart, formatRupiah, api } from "@utils";
import {
  MoneyInsertIcon,
  TransferIcon,
  BalanceIcon,
  StonkIcon,
} from "@components/atoms/icons";

function Dashboard() {
  usePageTitle("Dashboard");
  const [chartType, setChartType] = useState("All");
  const { user: userLoggedIn } = useSelector((state) => state.userLogin);
  const historyRequestKey = userLoggedIn?.token || "";
  const [historyState, setHistoryState] = useState({
    key: "",
    items: [],
    error: "",
  });

  useEffect(() => {
    if (!userLoggedIn?.token) {
      return;
    }

    const controller = new AbortController();
    let isCurrent = true;

    api
      .get("/transaction/history", {
        params: {
          page: 1,
          limit: 10,
        },
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${userLoggedIn.token}`,
        },
      })
      .then((response) => {
        if (!isCurrent) {
          return;
        }

        setHistoryState({
          key: historyRequestKey,
          items: response.data?.items ?? [],
          error: "",
        });
      })
      .catch((err) => {
        if (!isCurrent || err.name === "CanceledError") {
          return;
        }

        setHistoryState({
          key: historyRequestKey,
          items: [],
          error: err.data?.message || "Failed to load history.",
        });
      });

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [historyRequestKey, userLoggedIn?.token]);

  const history = historyState.items;
  const historyLoading =
    Boolean(userLoggedIn?.token) && historyState.key !== historyRequestKey;
  const historyError = historyState.error;

  return (
    <>
      {/* Main Content */}
      <main className="flex flex-col gap-4 p-3 sm:gap-6 sm:p-6 md:p-8 xl:p-10 2xl:p-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <Widget
            key="balance"
            widget={{
              icon: BalanceIcon,
              name: "Balance",
              content: formatRupiah(userLoggedIn?.balance || 0),
              footer: {
                growth: "+0.00%",
                icon: StonkIcon,
                color: "text-gray-600",
              },
            }}
          />
          <Widget
            key="income"
            widget={{
              icon: BalanceIcon,
              name: "Income",
              content: formatRupiah(
                userLoggedIn?.history
                  ? userLoggedIn.history
                      .filter((item) => item.type === "top-up")
                      .reduce((sum, item) => sum + item.amount, 0)
                  : 0,
              ),
              footer: {
                growth: "+0.00%",
                icon: StonkIcon,
                color: "text-gray-600",
              },
            }}
          />
          {listWidget.map((widget) => (
            <Widget key={widget.name} widget={widget} />
          ))}
        </div>

        <section className="flex flex-col items-start gap-4 border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <h3 className="text-lg font-semibold">Fast Service</h3>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Link
              to="top-up"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-all hover:bg-blue-700 sm:w-auto"
            >
              <MoneyInsertIcon /> Top Up
            </Link>
            <Link
              to="transfer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-all hover:bg-blue-700 sm:w-auto"
            >
              <TransferIcon className="fill-white" /> Transfer
            </Link>
          </div>
        </section>

        <section className="grow">
          <div className="flex flex-col gap-4 border border-gray-200 bg-white p-4 sm:p-6">
            <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold">{chartType} Chart</h3>
              <div className="flex gap-3">
                <select className="cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-neutral-800 outline-none">
                  <option>7 Days</option>
                </select>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-neutral-800 outline-none"
                >
                  <option value="All">All</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
            </div>

            <div className="relative flex h-50 gap-4 sm:h-75">
              <FinancialChart data={dataFinancialChart} chartType={chartType} />
            </div>
          </div>
        </section>
      </main>

      {/* Right Panel */}
      <aside className="px-4 pb-6 md:col-start-2 md:px-8 md:pb-8 lg:col-auto lg:p-8 lg:pl-0 xl:p-8 xl:pl-0">
        <div className="h-full border border-gray-200 bg-white p-4 sm:p-6">
          <div className="mb-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold">Transaction History</h3>
            <Link to="history" className="text-sm font-medium text-blue-600">
              See All
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            {historyLoading ? (
              <p className="text-sm font-medium text-gray-500">
                Loading history...
              </p>
            ) : historyError ? (
              <p className="text-sm font-medium text-red-500">{historyError}</p>
            ) : history.length > 0 ? (
              history.map((transaction) => (
                <TransactionHistory
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
            ) : (
              <p className="text-sm font-medium text-gray-500">
                No transaction history yet.
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Dashboard;
