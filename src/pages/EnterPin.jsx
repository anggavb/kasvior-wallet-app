import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

import { AuthLayout } from "@components/templates";
import { AuthHeader } from "@components/organisms";
import { PinInput } from "@components/molecules";
import { Button } from "@components/atoms";
import { usePageTitle } from "@hooks";

import { updatePin } from "@redux/slices/account";
import { getThunkErrorMessage } from "@redux/api";

const EnterPin = () => {
  usePageTitle("Enter Pin");
  const [pin, setPin] = useState("");
  const { user: userLoggedIn } = useSelector((state) => state.userLogin);
  const { status } = useSelector((state) => state.account.pin);
  const isSubmitting = status === "loading";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userLoggedIn?.token) {
      toast.error("You must be logged in to set your pin");
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
      navigate("/admin", { replace: true });
    } catch (error) {
      toast.error(getThunkErrorMessage(error, "Failed to set pin"));
    }
  };

  const handlePinChange = (pinChange) => {
    setPin(pinChange);
  };
  return (
    <AuthLayout
      imageSrc="/enter-pin.png"
      imageAlt="3D Hand holding a phone with shield icon"
      imagePanelClasses="items-end justify-center"
      imageClasses="mb-[-32px] sm:mb-[-16px] md:mb-[-32px] max-h-[90vh] object-contain object-bottom"
    >
      <AuthHeader
        title="Enter Your Pin 👋"
        subtitle="Please save your pin because this so important."
      />
      <form className="flex flex-col mt-2 sm:mt-4" onSubmit={handleSubmit}>
        <PinInput length={6} callbackForm={handlePinChange} />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default EnterPin;
