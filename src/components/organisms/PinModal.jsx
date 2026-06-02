import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PinInput } from "@components/molecules";
import { useLoadSpinner } from "@hooks";
import { api } from "@utils";

import { usersAction } from "@redux/slices/userRegistered";
import { userLoginAction } from "@redux/slices/userLogin";

function PinModal({ isOpen, onNext, onFailed, user }) {
  const dispatch = useDispatch();
  const toggleSpinner = useLoadSpinner();
  const [pin, setPin] = useState("");
  const { user: userLogin } = useSelector((state) => state.userLogin);
  if (!isOpen) return null;

  const handlePinChange = (pinChange) => {
    setPin(pinChange);
  };

  const handleCheckPin = async () => {
    if (!userLogin?.token || !/^\d{6}$/.test(pin)) {
      onFailed();
      return;
    }

    toggleSpinner();

    try {
      await api.post(
        "/users/me/pin/check",
        { pin },
        {
          headers: {
            Authorization: `Bearer ${userLogin.token}`,
          },
        },
      );

      onNext();

      const updateTransactionHistory = {
        senderId: user.id,
        recipientId: user.transferTo.id,
        amount: user.data.amount,
        notes: user.data.notes,
      };
      dispatch(usersAction.transfer(updateTransactionHistory));
      dispatch(
        userLoginAction.updated({
          balance: (userLogin.balance || 0) - user.data.amount,
          history: [
            ...(userLogin.history || []),
            {
              userId: userLogin.id,
              type: "transfer",
              amount: user.data.amount,
              recipient: user.transferTo.name,
              date: new Date().toISOString(),
            },
          ],
        }),
      );
    } catch {
      onFailed();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full p-4 bg-black/50 z-1000">
      <div className="w-full max-w-112.5 overflow-hidden bg-white shadow-2xl rounded-2xl">
        <div className="p-5 font-semibold tracking-wide uppercase border-b sm:p-6 border-neutral-200 text-[0.8rem] text-neutral-800">
          TRANSFER TO {user.transferTo?.name || "Recipient"}
        </div>

        <div className="p-6 sm:py-8 sm:px-10">
          <h2 className="mb-2 text-xl font-semibold sm:text-2xl text-neutral-800">
            Enter Your Pin 👋
          </h2>
          <p className="mb-8 text-sm sm:text-[0.9rem] text-gray-500">
            Enter Your Pin For Transaction
          </p>

          <div className="flex justify-between gap-1 mb-10 sm:gap-2">
            <PinInput length={6} callbackForm={handlePinChange} />
          </div>

          <button
            onClick={handleCheckPin}
            className="flex justify-center w-full p-4 text-base font-semibold text-white transition-all duration-200 border-none rounded-lg cursor-pointer bg-blue-700 hover:bg-blue-900 active:scale-[0.98]"
          >
            Next
          </button>

          <div className="mt-6 text-sm text-center sm:text-[0.9rem] text-gray-500">
            <p>
              Forgot Your Pin?{" "}
              <button className="font-medium bg-transparent border-none cursor-pointer text-blue-700 hover:underline">
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
