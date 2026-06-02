import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { TransferIcon } from "@components/atoms/icons";
import {
  PinModal,
  TransferFailedModal,
  TransferSuccessModal,
} from "@components/organisms";
import { usePageTitle } from "@hooks";
import { profile } from "@/assets/images";
import { Button } from "@components/atoms/";
import { PageHeader, Stepper } from "@components/molecules";
import { api, getApiAssetUrl } from "@utils";

const TRANSFER_STEPS = ["Find People", "Set Nominal", "Finish"];

function TransferDetail() {
  const [pinModal, setPinModal] = useState(false);
  const [transferFailedModal, setTransferFailedModal] = useState(false);
  const [transferSuccessModal, setTransferSuccessModal] = useState(false);
  const [formTransfer, setFormTransfer] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  usePageTitle("Transfer Detail");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.userLogin);

  const transferTo = {
    walletId: searchParams.get("walletId") ?? "",
    name: searchParams.get("name") ?? "Unknown User",
    phone: searchParams.get("phone") ?? "",
    photo: searchParams.get("photo") ?? "",
  };

  const handleTransfer = async (data) => {
    if (!user?.token) {
      toast.error("Please login again.");
      return;
    }

    if (!transferTo.walletId) {
      toast.error("Please choose a receiver first.");
      return;
    }

    const amount = Number(data.amount || 0);
    const notes = data.notes?.trim() || null;

    setIsSubmitting(true);

    try {
      const response = await api.post(
        "/transaction/transfer",
        {
          recipient_wallet_id: transferTo.walletId,
          amount,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      const transactionId = response.data?.transaction_id;
      if (!transactionId) {
        throw new Error("Missing transaction id");
      }

      setFormTransfer({
        data: {
          amount,
          notes,
        },
        transactionId,
        transferTo,
      });
      setPinModal(true);
    } catch (err) {
      toast.error(err.data?.message || "Transfer failed to start.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-main md:col-span-1 lg:col-span-2">
      <PageHeader
        icon={<TransferIcon className="fill-blue-600" />}
        title="Transfer Money"
      />

      <Stepper steps={TRANSFER_STEPS} activeStep={1} />

      <section>
        <form
          onSubmit={handleSubmit(handleTransfer)}
          className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-4 sm:gap-8 sm:p-6 lg:p-8"
        >
          {/* People Information */}
          <div className="form-group">
            <label className="text-[0.9rem] font-semibold text-gray-500 sm:text-base">
              People Information
            </label>
            <div className="flex flex-col items-center gap-4 rounded-xl bg-gray-50 p-4 text-center transition-colors sm:flex-row sm:gap-6 sm:text-left">
              <img
                src={getApiAssetUrl(transferTo.photo) || profile}
                alt={transferTo.name}
                className="h-15 w-15 shrink-0 rounded-xl object-cover"
              />
              <div className="flex grow flex-col gap-1">
                <h4 className="text-base font-semibold text-neutral-800">
                  {transferTo.name}
                </h4>
                <p className="text-xs text-neutral-800">
                  {transferTo.phone || "No Phone Number"}
                </p>
                <span className="mx-auto mt-1 inline-flex w-fit items-center gap-1.5 rounded-md border border-transparent bg-blue-700 px-2.5 py-1 text-xs font-semibold text-white sm:mx-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_44_327)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.58507 0.51936C8.64181 -0.17312 7.3582 -0.17312 6.41493 0.51936L5.48738 1.2003C5.33429 1.31269 5.1563 1.38642 4.96858 1.4152L3.8312 1.58958C2.67456 1.76691 1.76691 2.67456 1.58958 3.8312L1.4152 4.96858C1.38642 5.1563 1.31269 5.33429 1.2003 5.48738L0.51936 6.41493C-0.17312 7.3582 -0.17312 8.6418 0.51936 9.58507L1.2003 10.5126C1.31269 10.6657 1.38642 10.8437 1.4152 11.0314L1.58958 12.1688C1.76691 13.3254 2.67456 14.2331 3.8312 14.4104L4.96858 14.5848C5.1563 14.6136 5.33429 14.6873 5.48738 14.7997L6.41493 15.4806C7.3582 16.1731 8.6418 16.1731 9.58507 15.4806L10.5126 14.7997C10.6657 14.6873 10.8437 14.6136 11.0314 14.5848L12.1688 14.4104C13.3254 14.2331 14.2331 13.3254 14.4104 12.1688L14.5848 11.0314C14.6136 10.8437 14.6873 10.6657 14.7997 10.5126L15.4806 9.58507C16.1731 8.6418 16.1731 7.3582 15.4806 6.41493L14.7997 5.48738C14.6873 5.33429 14.6136 5.1563 14.5848 4.96858L14.4104 3.8312C14.2331 2.67456 13.3254 1.76691 12.1688 1.58958L11.0314 1.4152C10.8437 1.38642 10.6657 1.31269 10.5126 1.2003L9.58507 0.51936ZM11.2803 6.78033C11.5732 6.48744 11.5732 6.01256 11.2803 5.71967C10.9874 5.42678 10.5126 5.42678 10.2197 5.71967L7 8.93934L5.78033 7.71967C5.48744 7.42678 5.01256 7.42678 4.71967 7.71967C4.42678 8.01256 4.42678 8.48744 4.71967 8.78033L6.46967 10.5303C6.76256 10.8232 7.23744 10.8232 7.53033 10.5303L11.2803 6.78033Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_44_327">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="text-[0.9rem] font-semibold text-gray-500 sm:text-base">
              Amount
            </label>
            <p className="-mt-1 mb-2 text-sm text-neutral-800">
              Type the amount you want to transfer
            </p>
            <div className="relative flex items-center">
              <input
                {...register("amount", {
                  required: "Amount is required",
                  min: {
                    value: 1,
                    message: "Amount must be greater than 0",
                  },
                  validate: (value) => {
                    if (user?.balance == null) {
                      return true;
                    }

                    return (
                      Number(user.balance) >= Number(value) ||
                      "Insufficient balance"
                    );
                  },
                })}
                type="number"
                placeholder="Enter Nominal Transfer"
                className="w-full rounded-lg border border-neutral-200 bg-transparent p-4 font-[inherit] text-base text-neutral-800 transition-colors outline-none focus:border-blue-700"
              />
              {errors.amount && (
                <span className="absolute mt-20 text-sm text-red-500">
                  {errors.amount.message}
                </span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="text-[0.9rem] font-semibold text-gray-500 sm:text-base">
              Notes
            </label>
            <p className="-mt-1 mb-2 text-sm text-neutral-800">
              You can add some notes for this transaction
            </p>
            <textarea
              {...register("notes")}
              placeholder="Enter Some Notes"
              rows="4"
              className="w-full resize-y rounded-lg border border-neutral-200 bg-transparent p-4 font-[inherit] text-base text-neutral-800 transition-colors outline-none focus:border-blue-700"
            ></textarea>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !transferTo.walletId}
            className="mt-2 rounded-lg bg-blue-900 text-[0.9rem] hover:bg-blue-950 hover:shadow-[0_4px_12px_rgba(30,58,138,0.3)] sm:mt-4 sm:text-base"
          >
            {isSubmitting ? "Submitting..." : "Submit & Transfer"}
          </Button>
        </form>
      </section>

      <PinModal
        isOpen={pinModal}
        onNext={() => {
          setPinModal(false);
          setTransferSuccessModal(true);
        }}
        onFailed={() => {
          setPinModal(false);
          setTransferFailedModal(true);
        }}
        user={formTransfer}
      />
      <TransferFailedModal
        isOpen={transferFailedModal}
        receiverName={formTransfer.transferTo?.name}
        onTryAgain={() => {
          setTransferFailedModal(false);
          navigate("/admin/transfer");
        }}
        onBack={() => navigate("/admin")}
      />
      <TransferSuccessModal
        isOpen={transferSuccessModal}
        receiverName={formTransfer.transferTo?.name}
        onDone={() => navigate("/admin")}
        onTransferAgain={() => navigate("/admin/transfer")}
      />
    </main>
  );
}

export default TransferDetail;
