import { profile } from "@/assets/images";
import { normalizeHistoryTransaction } from "@utils";

/**
 * @typedef {Object} Transaction
 * @property {number} id - The transaction id
 * @property {string} type - The transaction type
 * @property {string} direction - The transaction direction
 * @property {string} status - The transaction status
 * @property {number} amount - The amount of the transaction
 */
/**
 * Renders the transaction history item
 * @param {Transaction} transaction - The transaction data to be rendered
 * @returns
 */
function TransactionHistory({ transaction }) {
  const item = normalizeHistoryTransaction(transaction);

  return (
    <section className="flex items-center gap-4">
      <img
        src={item.photo || profile}
        alt={item.name}
        className="h-10 w-10 rounded-xl object-cover"
      />
      <div className="grow">
        <h4 className="text-base font-semibold text-neutral-800">
          {item.name}
        </h4>
        <p className="mt-0.5 text-xs text-gray-500">
          {item.status === "failed" ? "Failed" : item.subtitle}
        </p>
      </div>
      <div className={`text-sm font-semibold ${item.amountClass}`}>
        {item.amountLabel}
      </div>
    </section>
  );
}

export default TransactionHistory;
