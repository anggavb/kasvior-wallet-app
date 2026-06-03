import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Button } from "@components/atoms";
import { PinInput } from "@components/molecules";
import { ProfileIcon } from "@components/atoms/icons";
import { usePageTitle } from "@hooks";

import { checkPin, updatePin } from "@redux/slices/account";
import { getThunkErrorMessage } from "@redux/api";

function ProfileChangePin() {
  usePageTitle("Change Pin");
  const [step, setStep] = useState("verify");
  const [existingPin, setExistingPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: userLoggedIn } = useSelector((state) => state.userLogin);
  const { status: pinUpdateStatus } = useSelector((state) => state.account.pin);
  const { status: pinCheckStatus } = useSelector((state) => state.account.pinCheck);
  const isChecking = pinCheckStatus === "loading";
  const isSubmitting = pinUpdateStatus === "loading";
  const isVerifyStep = step === "verify";
  const submitLabel = isVerifyStep
    ? isChecking
      ? "Checking..."
      : "Continue"
    : isSubmitting
      ? "Submitting..."
      : "Submit";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userLoggedIn?.token) {
      toast.error("You must be logged in to update your pin");
      navigate("/login", { replace: true });
      return;
    }

    if (isVerifyStep) {
      if (!/^\d{6}$/.test(existingPin)) {
        toast.error("Pin must be 6 digits long");
        return;
      }

      try {
        await dispatch(checkPin({ pin: existingPin })).unwrap();
        setStep("change");
        setNewPin("");
        setConfirmPin("");
      } catch {
        toast.error("Existing PIN is incorrect");
      }

      return;
    }

    if (!/^\d{6}$/.test(newPin)) {
      toast.error("Pin must be 6 digits long");
      return;
    }

    if (!/^\d{6}$/.test(confirmPin)) {
      toast.error("Confirm pin must be 6 digits long");
      return;
    }

    if (newPin !== confirmPin) {
      toast.error("Confirm pin does not match");
      return;
    }

    try {
      await dispatch(updatePin({ pin: newPin })).unwrap();
      toast.success("Pin set successfully!");
      setExistingPin("");
      setNewPin("");
      setConfirmPin("");
      setStep("verify");
      navigate("/admin/profile", { replace: true });
    } catch (error) {
      toast.error(getThunkErrorMessage(error, "Failed to update pin"));
    }
  };
  return (
    <main className="page-main md:col-span-1 lg:col-span-2">
      <div className="mb-4 page-header">
        <h2 className="flex items-center gap-2 text-base font-semibold text-blue-700 sm:text-[1.2rem] sm:gap-3">
          <ProfileIcon className="stroke-gray-600" />
          Profile
        </h2>
      </div>

      <section>
        <div className="text-center justify-center p-4 bg-gray-50 border border-neutral-200 sm:p-6 lg:p-8 shadow-sm">
          <div className="mb-2">
            <h1 className="text-[1.3rem] sm:text-[1.5rem] lg:text-[1.8rem] font-bold leading-snug text-neutral-800 mb-1">
              Change Pin 👋
            </h1>
            <p className="text-[0.9rem] sm:text-[0.95rem] leading-relaxed text-gray-500">
              Please save your pin because this so important.
            </p>
          </div>

          <form className="flex flex-col mt-4" onSubmit={handleSubmit}>
            {isVerifyStep ? (
              <div>
                <p className="text-sm font-medium text-neutral-700">
                  Existing PIN
                </p>
                <PinInput
                  length={6}
                  value={existingPin}
                  callbackForm={setExistingPin}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-neutral-700">
                    New PIN
                  </p>
                  <PinInput
                    length={6}
                    value={newPin}
                    callbackForm={setNewPin}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-700">
                    Confirm New PIN
                  </p>
                  <PinInput
                    length={6}
                    value={confirmPin}
                    autoFocus={false}
                    callbackForm={setConfirmPin}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full p-4"
              disabled={isChecking || isSubmitting}
            >
              {submitLabel}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ProfileChangePin;
