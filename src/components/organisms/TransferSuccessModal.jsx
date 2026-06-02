import { successIllustration } from "@/assets/images";

function TransferSuccessModal({
  isOpen,
  onDone,
  onTransferAgain,
  receiverName,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1000 flex h-full w-full items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-112.5 overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-neutral-200 p-5 text-[0.8rem] font-semibold tracking-wide text-neutral-800 uppercase sm:p-6">
          TRANSFER TO {receiverName || "Recipient"}
        </div>

        <div className="p-6 sm:px-10 sm:py-8">
          <div className="flex flex-col items-center text-center">
            <img
              src={successIllustration}
              alt="Success Illustration"
              className="mb-4 w-55 sm:w-67.5"
            />
            <h2 className="mb-2 text-xl font-semibold text-neutral-800 sm:text-2xl">
              Yeay Transfer <span className="text-green-500">Success</span>
            </h2>
            <p className="mb-8 max-w-70 text-sm leading-relaxed text-gray-500 sm:text-[0.9rem]">
              Thank you for using this application for your financial
            </p>

            <div className="flex w-full flex-col gap-3">
              <button
                onClick={onDone}
                className="flex w-full cursor-pointer justify-center rounded-lg border-none bg-blue-700 p-4 text-base font-semibold text-white transition-all duration-200 hover:bg-blue-900 active:scale-[0.98]"
              >
                Done
              </button>
              <button
                onClick={onTransferAgain}
                className="flex w-full cursor-pointer justify-center rounded-lg border border-solid border-blue-700 bg-transparent p-4 text-base font-semibold text-blue-700 transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
              >
                Transfer Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransferSuccessModal;
