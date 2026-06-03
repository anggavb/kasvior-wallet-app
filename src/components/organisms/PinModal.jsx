import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PinInput } from "@components/molecules";
import { useLoadSpinner } from "@hooks";

import { confirmTransferPin } from "@redux/slices/transaction";

function PinModal({ isOpen, onNext, onFailed, user }) {
  const dispatch = useDispatch();
  const toggleSpinner = useLoadSpinner();
  const [pin, setPin] = useState("");
  const { user: userLogin } = useSelector((state) => state.userLogin);
  const { status } = useSelector((state) => state.transaction.pinConfirm);
  const isSubmitting = status === "loading";
  if (!isOpen) return null;

  const handlePinChange = (pinChange) => {
    setPin(pinChange);
  };

  const handleCheckPin = async () => {
    if (!userLogin?.token || !user?.transactionId || !/^\d{6}$/.test(pin)) {
      onFailed();
      return;
    }

    toggleSpinner();

    try {
      await dispatch(
        confirmTransferPin({
          pin,
          transactionId: user.transactionId,
          amount: user.data.amount,
        }),
      ).unwrap();

      onNext();
    } catch {
      onFailed();
    }
  };

  return (
    <div className="fixed inset-0 z-1000 flex h-full w-full items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-112.5 overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-neutral-200 p-5 text-[0.8rem] font-semibold tracking-wide text-neutral-800 uppercase sm:p-6">
          TRANSFER TO {user.transferTo?.name || "Recipient"}
        </div>

        <div className="p-6 sm:px-10 sm:py-8">
          <h2 className="mb-2 text-xl font-semibold text-neutral-800 sm:text-2xl">
            Enter Your Pin 👋
          </h2>
          <p className="mb-8 text-sm text-gray-500 sm:text-[0.9rem]">
            Enter Your Pin For Transaction
          </p>

          <div className="mb-10 flex justify-between gap-1 sm:gap-2">
            <PinInput length={6} callbackForm={handlePinChange} />
          </div>

          <button
            onClick={handleCheckPin}
            disabled={isSubmitting}
            className="flex w-full cursor-pointer justify-center rounded-lg border-none bg-blue-700 p-4 text-base font-semibold text-white transition-all duration-200 hover:bg-blue-900 active:scale-[0.98]"
          >
            {isSubmitting ? "Checking..." : "Next"}
          </button>

          <div className="mt-6 text-center text-sm text-gray-500 sm:text-[0.9rem]">
            <p>
              Forgot Your Pin?{" "}
              <button className="cursor-pointer border-none bg-transparent font-medium text-blue-700 hover:underline">
                Reset
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PinModal;
