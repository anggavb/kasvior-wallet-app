import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { AuthMiddleLayout } from "@components/templates";
import { AuthHeader } from "@components/organisms";
import { InputField } from "@components/molecules";
import { Button } from "@components/atoms";
import { PasswordIcon } from "@components/atoms/icons";
import { usePageTitle } from "@hooks";
import { resetPassword } from "@redux/slices/userLogin";
import { getThunkErrorMessage } from "@redux/api";

const ResetPassword = () => {
  usePageTitle("Reset Password");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.userLogin);
  const isSubmitting = status === "loading";
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const hasResetToken = Boolean(resetToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();

  const handleResetPassword = async (form) => {
    if (!hasResetToken) {
      toast.error("Invalid reset password link");
      return;
    }

    try {
      await dispatch(
        resetPassword({
          newPassword: form.newPassword,
          resetToken,
        }),
      ).unwrap();

      reset();
      toast.success("Password has been reset successfully!");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error) {
      toast.error(getThunkErrorMessage(error, "Failed to reset password"));
    }
  };

  return (
    <AuthMiddleLayout>
      <AuthHeader
        title="Reset Password 👋"
        subtitle="Enter your new password."
      />

      {!hasResetToken && (
        <p className="text-sm text-center text-red-500">
          Invalid reset password link.
        </p>
      )}

      <form
        onSubmit={handleSubmit(handleResetPassword)}
        className="flex flex-col gap-4 mt-2"
      >
        <InputField
          {...register("newPassword", {
            required: "New password is required",
          })}
          name="newPassword"
          id="new-password"
          label="New Password"
          placeholder="Enter Your New Password"
          iconLeft={<PasswordIcon />}
          isPassword
          disabled={!hasResetToken}
          noValidate
        />
        {errors.newPassword && (
          <p className="text-sm text-red-500 mt-1">
            {errors.newPassword.message}
          </p>
        )}

        <InputField
          {...register("confirmPassword", {
            required: "Please confirm your new password",
            validate: (value) =>
              value === getValues().newPassword || "Passwords do not match",
          })}
          name="confirmPassword"
          id="confirm-password"
          label="Confirm New Password"
          placeholder="Re-Type Your New Password"
          iconLeft={<PasswordIcon />}
          isPassword
          disabled={!hasResetToken}
          noValidate
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">
            {errors.confirmPassword.message}
          </p>
        )}

        <Button type="submit" disabled={!hasResetToken || isSubmitting}>
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

export default ResetPassword;
