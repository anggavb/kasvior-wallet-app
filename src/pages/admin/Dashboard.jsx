import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { usePageTitle } from "@hooks";
import {
  Widget,
  TransactionHistory,
  FinancialChart,
} from "@components/molecules";
import { formatRupiah } from "@utils";
import {
  fetchTransactionReport,
  fetchWallet,
} from "@redux/slices/account";
import { fetchDashboardHistory } from "@redux/slices/transaction";
import {
  MoneyInsertIcon,
  TransferIcon,
  BalanceIcon,
  StonkIcon,
  IncomeIcon,
  ExpenseIcon,
  DownStonkIcon,
} from "@components/atoms/icons";

function Dashboard() {
  usePageTitle("Dashboard");
  const [chartType, setChartType] = useState("All");
  const dispatch = useDispatch();
  const { user: userLoggedIn } = useSelector((state) => state.userLogin);
  const { wallet, report } = useSelector((state) => state.account);
  const dashboardHistory = useSelector(
    (state) => state.transaction.dashboardHistory,
  );
  const historyRequestKey = userLoggedIn?.token || "";
  const reportType = chartType.toLowerCase();
  const reportRequestKey = userLoggedIn?.token
    ? `${userLoggedIn.token}:${reportType}`
    : "";

  useEffect(() => {
    if (!userLoggedIn?.token) {
      return;
    }

    dispatch(fetchWallet());
    dispatch(fetchDashboardHistory({ page: 1, limit: 10, requestKey: historyRequestKey }));
  }, [dispatch, historyRequestKey, userLoggedIn?.token]);

  useEffect(() => {
    if (!userLoggedIn?.token) {
      return;
    }

    dispatch(
      fetchTransactionReport({
        duration: "7d",
        type: reportType,
        requestKey: reportRequestKey,
      }),
    );
  }, [dispatch, reportRequestKey, reportType, userLoggedIn?.token]);

  const walletData = wallet.data || {
    balance: userLoggedIn?.balance || 0,
    income: 0,
    expense: 0,
  };
  const history = dashboardHistory.items;
  const historyLoading =
    Boolean(userLoggedIn?.token) &&
    (dashboardHistory.status === "loading" ||
      dashboardHistory.requestKey !== historyRequestKey);
  const historyError =
    dashboardHistory.status === "failed" ? dashboardHistory.error : "";
  const chartLoading =
    Boolean(userLoggedIn?.token) &&
    (report.status === "loading" || report.requestKey !== reportRequestKey);
  const chartError = report.status === "failed" ? report.error : "";
  const chartData = report.data;

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
              content: formatRupiah(walletData.balance || 0),
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
              icon: IncomeIcon,
              name: "Income",
              content: formatRupiah(walletData.income || 0),
              footer: {
                growth: "+0.00%",
                icon: StonkIcon,
                color: "text-gray-600",
              },
            }}
          />
          <Widget
            key="expense"
            widget={{
              icon: ExpenseIcon,
              name: "Expense",
              content: formatRupiah(walletData.expense || 0),
              footer: {
                growth: "-0.00%",
                icon: DownStonkIcon,
                color: "text-red-600",
              },
            }}
          />
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
              {chartLoading ? (
                <p className="text-sm font-medium text-gray-500">
                  Loading chart...
                </p>
              ) : chartError ? (
                <p className="text-sm font-medium text-red-500">{chartError}</p>
              ) : (
                <FinancialChart data={chartData} chartType={chartType} />
              )}
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
