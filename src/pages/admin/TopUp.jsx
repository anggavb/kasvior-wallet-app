import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

import { TopUpIcon } from "@components/atoms/icons";
import { RadioMenu, PageHeader } from "@components/molecules";
import { Button } from "@components/atoms/";
import { usePageTitle } from "@hooks";
import { api, listPaymentMethod, formatRupiah } from "@utils";
import { profile } from "@/assets/images";

import { useDispatch, useSelector } from "react-redux";
import { userLoginAction } from "@redux/slices/userLogin";
import useLogoutStore from "@zustand/store";

function TopUp() {
  usePageTitle("Top Up");
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { changeTitle, changeMessages, toggleModalLogout, setHandleConfirm } =
    useLogoutStore((state) => state);

  const { user: userLoggedIn } = useSelector((state) => state.userLogin);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      nominal: "",
      payment_method: listPaymentMethod[0]?.value,
    },
  });

  const watchNominal = useWatch({
    control,
    name: "nominal",
    defaultValue: "",
  });
  const watchPaymentMethod = useWatch({
    control,
    name: "payment_method",
  });

  const selectedPaymentMethod = listPaymentMethod.find(
    (method) => method.value === watchPaymentMethod,
  );
  const amount = Number(watchNominal || 0);
  const discount =
    amount > 0 && selectedPaymentMethod?.value === "bca" ? 5000 : 0;
  const tax = amount > 0 ? selectedPaymentMethod?.tax || 0 : 0;
  const total = amount - discount + tax;

  const handleTopUp = (data) => {
    changeMessages("Are you sure you want to top up your account?");
    changeTitle("Confirm Top Up");

    const nominal = Number(data.nominal || 0);
    if (!userLoggedIn?.token) {
      toast.error("Please login again.");
      return;
    }
    if (!selectedPaymentMethod || nominal <= 0 || total < 0) {
      toast.error("Please enter a valid nominal amount!");
      return;
    }

    setHandleConfirm(async () => {
      toggleModalLogout();
      setIsSubmitting(true);

      try {
        await api.post(
          "/transaction/topup",
          {
            type: "topup",
            payment_method_id: selectedPaymentMethod.id,
            amount: nominal,
            discount,
            tax,
            sub_total: total,
          },
          {
            headers: {
              Authorization: `Bearer ${userLoggedIn.token}`,
            },
          },
        );

        dispatch(
          userLoginAction.updated({
            balance: Number(userLoggedIn?.balance || 0) + nominal,
          }),
        );
        reset();
        toast.success("Top up successful!");
      } catch (err) {
        toast.error(err.data?.message || "Top up failed.");
      } finally {
        setIsSubmitting(false);
      }
    });

    toggleModalLogout();
  };

  return (
    <main className="page-main md:col-span-1 lg:col-span-2">
      <PageHeader
        icon={<TopUpIcon className="fill-blue-600" />}
        title="Top Up Account"
      />

      <form onSubmit={handleSubmit(handleTopUp)}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
          {/* Top-Up Form (Left Column) */}
          <div className="flex min-w-0 flex-1 flex-col gap-5 rounded-xl border border-gray-200 bg-white p-4 sm:gap-6 sm:p-6 lg:gap-8">
            {/* Account Information */}
            <div className="form-group">
              <label className="form-label">Account Information</label>
              <div className="flex items-center gap-4 rounded-lg bg-gray-50 px-4 py-3.5 sm:px-5 sm:py-4">
                <img
                  src={userLoggedIn?.avatar || userLoggedIn?.photo || profile}
                  alt={userLoggedIn?.name || userLoggedIn?.fullname || "User"}
                  className="h-12 w-12 shrink-0 rounded-xl object-cover sm:h-14 sm:w-14"
                />
                <div className="flex flex-col gap-1">
                  <h4 className="text-base font-semibold text-neutral-800">
                    {userLoggedIn?.name ||
                      userLoggedIn?.fullname ||
                      userLoggedIn?.email ||
                      "Unknown User"}
                  </h4>
                  <p className="text-sm text-gray-500 sm:text-[0.85rem]">
                    {userLoggedIn?.phone ||
                      userLoggedIn?.phone_number ||
                      "No Phone Number"}
                  </p>
                  <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-600/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                    <i className="ph-fill ph-check-circle"></i> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="form-group">
              <label className="form-label">Amount</label>
              <p className="mt-0.5 mb-2 text-sm text-gray-500">
                Type the amount you want to transfer to your Kasvior account
              </p>
              <div className="form-input">
                <svg
                  width="27"
                  height="27"
                  viewBox="0 0 27 27"
                  fill="none"
                  className="shrink-0 text-gray-500"
                >
                  <path
                    d="M6.62076 12.1379C6.40252 12.1379 6.18918 12.2026 6.00771 12.3239C5.82625 12.4451 5.68482 12.6174 5.6013 12.8191C5.51779 13.0207 5.49593 13.2426 5.53851 13.4566C5.58109 13.6707 5.68618 13.8673 5.8405 14.0216C5.99482 14.1759 6.19144 14.281 6.40549 14.3236C6.61953 14.3662 6.8414 14.3443 7.04303 14.2608C7.24466 14.1773 7.41699 14.0359 7.53824 13.8544C7.65949 13.6729 7.72421 13.4596 7.72421 13.2413C7.72421 12.9487 7.60795 12.668 7.40101 12.4611C7.19408 12.2542 6.91341 12.1379 6.62076 12.1379ZM19.8621 12.1379C19.6439 12.1379 19.4306 12.2026 19.2491 12.3239C19.0676 12.4451 18.9262 12.6174 18.8427 12.8191C18.7592 13.0207 18.7373 13.2426 18.7799 13.4566C18.8225 13.6707 18.9276 13.8673 19.0819 14.0216C19.2362 14.1759 19.4328 14.281 19.6469 14.3236C19.8609 14.3662 20.0828 14.3443 20.2844 14.2608C20.486 14.1773 20.6584 14.0359 20.7796 13.8544C20.9009 13.6729 20.9656 13.4596 20.9656 13.2413C20.9656 12.9487 20.8493 12.668 20.6424 12.4611C20.4355 12.2542 20.1548 12.1379 19.8621 12.1379ZM22.069 5.51721H4.41386C3.5359 5.51721 2.6939 5.86598 2.07309 6.48679C1.45228 7.1076 1.10352 7.9496 1.10352 8.82756V17.6551C1.10352 18.5331 1.45228 19.3751 2.07309 19.9959C2.6939 20.6167 3.5359 20.9655 4.41386 20.9655H22.069C22.947 20.9655 23.789 20.6167 24.4098 19.9959C25.0306 19.3751 25.3794 18.5331 25.3794 17.6551V8.82756C25.3794 7.9496 25.0306 7.1076 24.4098 6.48679C23.789 5.86598 22.947 5.51721 22.069 5.51721ZM23.1725 17.6551C23.1725 17.9478 23.0562 18.2285 22.8493 18.4354C22.6424 18.6423 22.3617 18.7586 22.069 18.7586H4.41386C4.12121 18.7586 3.84054 18.6423 3.6336 18.4354C3.42667 18.2285 3.31041 17.9478 3.31041 17.6551V8.82756C3.31041 8.5349 3.42667 8.25424 3.6336 8.0473C3.84054 7.84036 4.12121 7.72411 4.41386 7.72411H22.069C22.3617 7.72411 22.6424 7.84036 22.8493 8.0473C23.0562 8.25424 23.1725 8.5349 23.1725 8.82756V17.6551ZM13.2414 9.93101C12.5867 9.93101 11.9467 10.1252 11.4023 10.4889C10.8579 10.8526 10.4336 11.3696 10.1831 11.9745C9.93254 12.5794 9.86698 13.245 9.99471 13.8872C10.1224 14.5293 10.4377 15.1192 10.9007 15.5821C11.3636 16.0451 11.9535 16.3604 12.5956 16.4881C13.2378 16.6158 13.9034 16.5503 14.5083 16.2997C15.1131 16.0492 15.6302 15.6249 15.9939 15.0805C16.3576 14.5361 16.5518 13.8961 16.5518 13.2413C16.5518 12.3634 16.203 11.5214 15.5822 10.9006C14.9614 10.2798 14.1194 9.93101 13.2414 9.93101ZM13.2414 14.3448C13.0232 14.3448 12.8099 14.2801 12.6284 14.1588C12.4469 14.0376 12.3055 13.8653 12.222 13.6636C12.1385 13.462 12.1166 13.2401 12.1592 13.0261C12.2018 12.812 12.3069 12.6154 12.4612 12.4611C12.6155 12.3068 12.8121 12.2017 13.0262 12.1591C13.2402 12.1165 13.4621 12.1384 13.6637 12.2219C13.8653 12.3054 14.0377 12.4468 14.1589 12.6283C14.2802 12.8098 14.3449 13.0231 14.3449 13.2413C14.3449 13.534 14.2286 13.8147 14.0217 14.0216C13.8148 14.2285 13.5341 14.3448 13.2414 14.3448Z"
                    fill="currentColor"
                  />
                </svg>
                <input
                  {...register("nominal", {
                    required: "Nominal is required",
                    min: {
                      value: 1,
                      message: "Nominal must be greater than 0",
                    },
                  })}
                  name="nominal"
                  type="number"
                  placeholder="Enter Nominal Transfer"
                  className="input-raw [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                {errors.nominal && (
                  <span className="text-sm text-red-500">
                    {errors.nominal.message}
                  </span>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <p className="mt-0.5 mb-2 text-sm text-gray-500">
                Choose your payment method for top up account
              </p>
              <div className="flex flex-col gap-3">
                {listPaymentMethod.map((method, idx) => (
                  <RadioMenu
                    key={idx}
                    name="payment_method"
                    paymentMethod={method}
                    isDefault={idx === 0}
                    register={register}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Summary Card (Right Column) */}
          <aside className="w-full shrink-0 lg:w-[320px] xl:w-87.5 2xl:w-95">
            <div className="flex flex-col gap-0 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 lg:sticky lg:top-23.5 lg:p-7 xl:p-8">
              <h3 className="mb-5 text-base font-bold text-neutral-800 sm:text-lg">
                Payment
              </h3>

              <div className="mb-3.5 flex items-center justify-between text-sm sm:text-base">
                <span className="font-normal text-neutral-800">Amount</span>
                <span className="font-semibold text-neutral-800">
                  {formatRupiah(amount)}
                </span>
              </div>
              <div className="mb-3.5 flex items-center justify-between text-sm sm:text-base">
                <span className="font-normal text-neutral-800">Discount</span>
                <span className="font-semibold text-neutral-800">
                  {discount > 0
                    ? `-${formatRupiah(discount)}`
                    : formatRupiah(0)}
                </span>
              </div>
              <div className="mb-3.5 flex items-center justify-between text-sm sm:text-base">
                <span className="font-normal text-neutral-800">Tax</span>
                <span className="font-semibold text-neutral-800">
                  {formatRupiah(tax)}
                </span>
              </div>

              <div className="divider my-4 sm:my-5"></div>

              <div className="mb-3.5 flex items-center justify-between">
                <span className="text-[0.9rem] font-semibold text-neutral-800">
                  Sub Total
                </span>
                <span className="text-base font-bold text-neutral-800 sm:text-lg">
                  {formatRupiah(total)}
                </span>
              </div>

              <Button
                className="mt-5 text-[0.9rem]"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>

              <p className="mt-3 text-xs leading-relaxed text-gray-500">
                *Get Discount if you pay with Bank Central Asia
              </p>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}

export default TopUp;
