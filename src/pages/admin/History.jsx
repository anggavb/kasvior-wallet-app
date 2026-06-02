import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import { usePageTitle } from "@hooks";
import { HistoryIcon } from "@components/atoms/icons";
import { PageHeader, SearchBox, Pagination } from "@components/molecules";
import { api, normalizeHistoryTransaction } from "@utils";
import { profile } from "@/assets/images";

const PER_PAGE = 5;

const getPageFromParams = (searchParams) => {
  const page = Number(searchParams.get("page") ?? "1");
  return Number.isInteger(page) && page > 0 ? page : 1;
};

function History() {
  usePageTitle("History");

  const { user: userLoggedIn } = useSelector((state) => state.userLogin);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const currentPage = getPageFromParams(searchParams);
  const requestKey = userLoggedIn?.token
    ? `${userLoggedIn.token}:${query}:${currentPage}`
    : "";

  const [historyState, setHistoryState] = useState({
    key: "",
    history: {
      items: [],
      meta: {
        page: 1,
        limit: PER_PAGE,
        total: 0,
        total_pages: 0,
      },
    },
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
          q: query,
          page: currentPage,
          limit: PER_PAGE,
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
          key: requestKey,
          history: response.data ?? {
            items: [],
            meta: {
              page: currentPage,
              limit: PER_PAGE,
              total: 0,
              total_pages: 0,
            },
          },
          error: "",
        });
      })
      .catch((err) => {
        if (!isCurrent || err.name === "CanceledError") {
          return;
        }

        setHistoryState({
          key: requestKey,
          history: {
            items: [],
            meta: {
              page: currentPage,
              limit: PER_PAGE,
              total: 0,
              total_pages: 0,
            },
          },
          error: err.data?.message || "Failed to load transaction history.",
        });
      });

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [currentPage, query, requestKey, userLoggedIn?.token]);

  const handleSearch = (e) => {
    const value = e.target.value;
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set("q", value);
    } else {
      nextParams.delete("q");
    }

    nextParams.delete("page");
    setSearchParams(nextParams, { replace: true });
  };

  const handlePageChange = (page) => {
    const nextParams = new URLSearchParams(searchParams);

    if (page > 1) {
      nextParams.set("page", String(page));
    } else {
      nextParams.delete("page");
    }

    setSearchParams(nextParams);
  };

  const history = historyState.history;
  const total = history.meta?.total ?? 0;
  const transactions = history.items ?? [];
  const isLoading =
    Boolean(userLoggedIn?.token) && historyState.key !== requestKey;
  const error = userLoggedIn?.token
    ? historyState.error
    : "Please login again to load transaction history.";

  return (
    <main className="page-main md:col-span-1 lg:col-span-2">
      <PageHeader
        icon={<HistoryIcon className="stroke-blue-600" />}
        title="History Transaction"
      />

      <section>
        <div className="card p-4 sm:p-8">
          <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-800">
                Find Transaction
              </h3>
              {query && (
                <p className="mt-1 text-sm text-gray-500">
                  {total} result{total !== 1 ? "s" : ""} for &ldquo;
                  <span className="font-medium text-neutral-800">{query}</span>
                  &rdquo;
                </p>
              )}
            </div>
            <SearchBox
              placeholder="Enter Number Or Full Name"
              className="w-full sm:w-70 md:w-75"
              value={query}
              onChange={handleSearch}
            />
          </div>

          <div className="flex flex-col">
            {isLoading ? (
              <div className="py-16 text-center text-sm font-medium text-gray-500">
                Loading transaction history...
              </div>
            ) : error ? (
              <div className="py-16 text-center text-sm font-medium text-red-500">
                {error}
              </div>
            ) : transactions.length > 0 ? (
              transactions.map((transaction, index) => {
                const item = normalizeHistoryTransaction(transaction);

                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 border-b border-gray-200 px-2 py-3 transition-colors duration-150 sm:gap-5 sm:px-4 sm:py-4 ${index % 2 !== 0 ? "bg-gray-50" : ""} last:border-b-0`}
                  >
                    <img
                      src={item.photo || profile}
                      alt={item.name}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover sm:h-11 sm:w-11"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-base font-medium text-gray-500">
                        {item.name}
                      </span>
                      <span className="block text-xs text-gray-400 sm:hidden">
                        {item.subtitle}
                      </span>
                    </div>
                    <span className="hidden flex-1 text-sm text-gray-500 sm:block">
                      {item.subtitle}
                    </span>
                    <span
                      className={`hidden rounded-md px-2 py-1 text-xs font-semibold capitalize sm:inline-block ${
                        item.status === "failed"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span
                      className={`text-sm font-semibold whitespace-nowrap ${item.amountClass}`}
                    >
                      {item.amountLabel}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 11H14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm font-medium">
                  {query
                    ? `No results for "${query}"`
                    : "No transaction history yet."}
                </p>
              </div>
            )}
          </div>

          <Pagination
            total={total}
            perPage={PER_PAGE}
            current={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </section>
    </main>
  );
}

export default History;
