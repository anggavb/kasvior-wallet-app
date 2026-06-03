import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

import { InputField } from "@components/molecules";
import { Button } from "@components/atoms";
import { ProfileIcon, PasswordIcon } from "@components/atoms/icons";

import { updatePassword } from "@redux/slices/account";
import { getThunkErrorMessage } from "@redux/api";

const ProfileChangePassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();

  const { status } = useSelector((state) => state.account.password);
  const isSubmitting = status === "loading";
  const dispatch = useDispatch();

  const handleChangePassword = async (data) => {
    try {
      await dispatch(
        updatePassword({
          currentPassword: data.existingPassword,
          newPassword: data.newPassword,
        }),
      ).unwrap();

      reset();
      toast.success("Password changed successfully!");
      setTimeout(() => {
        navigate("/admin/profile", { replace: true });
      }, 1500);
    } catch (error) {
      toast.error(getThunkErrorMessage(error, "Failed to update password"));
    }
  };
  return (
    <>
      <main className="page-main md:col-span-1 lg:col-span-2">
        <div className="mb-4 page-header">
          <h2 className="flex items-center gap-2 text-base font-semibold text-blue-700 sm:text-[1.2rem] sm:gap-3">
            <ProfileIcon className="stroke-gray-600" />
            Profile
          </h2>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-col gap-6 p-4 bg-white border border-neutral-200 rounded-xl sm:p-6 lg:p-8 lg:gap-8 shadow-sm">
            <h3 className="text-[1.1rem] sm:text-[1.2rem] font-bold text-neutral-800 border-b border-neutral-200 pb-3 sm:pb-4 mb-2">
              Change Password
            </h3>

            <form
              onSubmit={handleSubmit(handleChangePassword)}
              className="flex flex-col gap-5 sm:gap-6 w-full max-w-full"
            >
              <InputField
                {...register("existingPassword", {
                  required: "Existing password is required",
                })}
                name="existingPassword"
                id="existing-password"
                label="Existing Password"
                placeholder="Enter Your Existing Password"
                iconLeft={<PasswordIcon />}
                isPassword
                noValidate
              />
              {errors.existingPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.existingPassword.message}
                </p>
              )}

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
                    value === getValues().newPassword ||
                    "Passwords do not match",
                })}
                name="confirmPassword"
                id="confirm-password"
                label="Confirm New Password"
                placeholder="Re-Type Your New Password"
                iconLeft={<PasswordIcon />}
                isPassword
                noValidate
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full sm:w-auto px-8 mt-2 py-3.5 ml-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfileChangePassword;
