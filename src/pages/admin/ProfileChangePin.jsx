import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Button } from "@components/atoms";
import { PinInput } from "@components/molecules";
import { ProfileIcon } from "@components/atoms/icons";
import { usePageTitle } from "@hooks";

import { updatePin } from "@redux/slices/account";
import { getThunkErrorMessage } from "@redux/api";

function ProfileChangePin() {
  usePageTitle("Change Pin");
  const [pin, setPin] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: userLoggedIn } = useSelector((state) => state.userLogin);
  const { status } = useSelector((state) => state.account.pin);
  const isSubmitting = status === "loading";

  const handlePinChange = (pinChange) => {
    setPin(pinChange);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userLoggedIn?.token) {
      toast.error("You must be logged in to update your pin");
      navigate("/login", { replace: true });
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      toast.error("Pin must be 6 digits long");
      return;
    }

    try {
      await dispatch(updatePin({ pin })).unwrap();
      toast.success("Pin set successfully!");
      setPin("");
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
            <PinInput length={6} callbackForm={handlePinChange} />

            <Button type="submit" className="w-full p-4" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ProfileChangePin;
