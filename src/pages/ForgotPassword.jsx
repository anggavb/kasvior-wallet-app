import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import { AuthMiddleLayout } from "@components/templates";
import { AuthHeader } from "@components/organisms";
import { InputField } from "@components/molecules";
import { Button } from "@components/atoms";
import { MailIcon } from "@components/atoms/icons";
import { usePageTitle } from "@hooks";
import { forgotPassword } from "@redux/slices/userLogin";
import { getThunkErrorMessage } from "@redux/api";

const ForgotPassword = () => {
  usePageTitle("Forgot Password");
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.userLogin);
  const isSubmitting = status === "loading";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    try {
      await dispatch(forgotPassword({ email })).unwrap();
      toast.success(
        "If the email is registered, reset instructions have been sent",
      );
      e.target.reset();
    } catch (error) {
      toast.error(
        getThunkErrorMessage(error, "Failed to send reset instructions"),
      );
    }
  };

  return (
    <AuthMiddleLayout>
      <AuthHeader
        title="Fill Out Form Correctly 👋"
        subtitle="We will send reset instructions to your email."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <InputField
          id="email"
          type="email"
          label="Email"
          placeholder="Enter Your Email"
          iconLeft={<MailIcon />}
          required
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>

      <nav className="mt-2 text-[0.95rem] text-center text-gray-500 sm:mt-4">
        <p>
          Already remember?{" "}
          <a
            href="/login"
            className="font-semibold transition-colors text-blue-700 hover:underline"
          >
            Login
          </a>
        </p>
      </nav>
    </AuthMiddleLayout>
  );
};

export default ForgotPassword;
