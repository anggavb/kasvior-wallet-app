import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { usePageTitle } from "@hooks";
import { TransferIcon } from "@components/atoms/icons";
import { PageHeader, SearchBox, Stepper } from "@components/molecules";
import { useLoadSpinner } from "@hooks";
import { getApiAssetUrl } from "@utils";
import { profile } from "@/assets/images";
import { fetchReceivers } from "@redux/slices/transaction";

const TRANSFER_STEPS = ["Find People", "Set Nominal", "Finish"];

const buildDetailPath = (receiver) => {
  const params = new URLSearchParams({
    walletId: receiver.wallet_id,
    name: receiver.receiver || "Unknown User",
  });

  if (receiver.phone_number) {
    params.set("phone", receiver.phone_number);
  }

  if (receiver.photo) {
    params.set("photo", receiver.photo);
  }

  return `detail?${params.toString()}`;
};

function Transfer() {
  usePageTitle("Transfer");
  const toggleSpinner = useLoadSpinner();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userLogin);
  const receiverState = useSelector((state) => state.transaction.receivers);
  const [search, setSearch] = useState("");
  const receiverRequestKey = user?.token ? `${user.token}:${search}` : "";

  useEffect(() => {
    if (!user?.token) {
      return;
    }

    dispatch(
      fetchReceivers({
        search,
        page: 1,
        limit: 20,
        requestKey: receiverRequestKey,
      }),
    );
  }, [dispatch, receiverRequestKey, search, user?.token]);

  const receivers = receiverState.items;
  const isLoading =
    Boolean(user?.token) &&
    (receiverState.status === "loading" ||
      receiverState.requestKey !== receiverRequestKey);
  const error = receiverState.status === "failed" ? receiverState.error : "";

  return (
    <main className="page-main md:col-span-1 lg:col-span-2">
      <PageHeader
        icon={<TransferIcon className="fill-blue-600" />}
        title="Transfer Money"
      />

      <Stepper steps={TRANSFER_STEPS} activeStep={0} />

      <section>
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-8">
          <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-800">
                Find People
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {receivers.length} Result{receivers.length !== 1 ? "s" : ""}{" "}
                Found
              </p>
            </div>
            <SearchBox
              placeholder="Enter Number Or Full Name"
              className="w-full sm:w-62.5 md:w-75"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            {isLoading ? (
              <div className="py-12 text-center text-sm font-medium text-gray-500">
                Loading receivers...
              </div>
            ) : error ? (
              <div className="py-12 text-center text-sm font-medium text-red-500">
                {error}
              </div>
            ) : receivers.length > 0 ? (
              receivers.map((person, index) => (
                <Link
                  to={buildDetailPath(person)}
                  onClick={toggleSpinner}
                  key={person.wallet_id}
                  className="group block"
                >
                  <div
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors group-hover:bg-gray-50 sm:gap-4 sm:px-4 sm:py-4 md:gap-8 ${index % 2 !== 0 ? "bg-gray-50" : ""}`}
                  >
                    <img
                      src={getApiAssetUrl(person.photo) || profile}
                      alt={person.receiver || "User"}
                      className="h-9 w-9 rounded-lg object-cover sm:h-11 sm:w-11"
                    />
                    <span className="flex-1 font-medium text-gray-500">
                      {person.receiver || "Unknown User"}
                    </span>
                    <span className="hidden flex-1 text-center text-base text-gray-500 sm:block">
                      {person.phone_number || "No Phone Number"}
                    </span>
                    <i className="ph ph-star cursor-pointer text-2xl text-gray-500 transition-colors duration-200 hover:text-blue-600"></i>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center text-sm font-medium text-gray-500">
                No receivers found.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Transfer;
