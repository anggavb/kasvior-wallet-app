import getEnv from "./getEnv";
import formatRupiah from "./moneyFormater";

const trimTrailingSlash = (value) => value.replace(/\/$/, "");

const isAbsoluteUrl = (value) =>
  /^https?:\/\//i.test(value) || value.startsWith("data:");

export const getApiAssetUrl = (path) => {
  if (!path) {
    return "";
  }

  if (isAbsoluteUrl(path)) {
    return path;
  }

  const baseUrl = trimTrailingSlash(getEnv.apiBaseUrl || "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
};

export const normalizeHistoryTransaction = (transaction) => {
  const isIncoming = transaction.direction === "in";
  const amount = Number(transaction.amount || 0);
  const fallbackType = transaction.type === "topup" ? "Top Up" : "Transfer";
  const name =
    transaction.counterparty_name || transaction.payment_method || fallbackType;
  const subtitle =
    transaction.counterparty_phone ||
    transaction.payment_method ||
    transaction.notes ||
    fallbackType;
  const sign = isIncoming ? "+" : "-";
  const isFailed = transaction.status === "failed";

  return {
    id: transaction.id,
    name,
    subtitle,
    status: transaction.status,
    photo: getApiAssetUrl(transaction.counterparty_photo),
    amount,
    amountLabel: `${sign}${formatRupiah(amount)}`,
    amountClass: isFailed
      ? "text-amber-600"
      : isIncoming
        ? "text-emerald-600"
        : "text-red-600",
    isIncoming,
    type: transaction.type,
  };
};
