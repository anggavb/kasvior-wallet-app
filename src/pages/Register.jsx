import { useNavigate } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import { AuthLayout } from "@components/templates";
import { AuthHeader } from "@components/organisms";
import { InputField, SocialButton } from "@components/molecules";
import { Button } from "@components/atoms";
import {
  GoogleIcon,
  FacebookIcon,
  MailIcon,
  PasswordIcon,
} from "@components/atoms/icons";
import { usePageTitle, useRedirectIfLoggedIn } from "@hooks";
import { registerUser } from "@redux/slices/userLogin";
import { getThunkErrorMessage } from "@redux/api";

const Register = () => {
  usePageTitle("Register");
  useRedirectIfLoggedIn();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.userLogin);
  const isSubmitting = status === "loading";
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const password = useWatch({ control, name: "password" });

  const handleRegister = async ({ email, password }) => {
    try {
      const response = await dispatch(registerUser({ email, password })).unwrap();
      toast.success(response.message || "Registration successful! You can now log in.");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        getThunkErrorMessage(error, "Registration failed. Please try again."),
      );
    }
  };

  return (
    <AuthLayout
      imageSrc="/3d-hand-making-cashless-payment-from-smartphone 1 copy.png"
      imageAlt="3D Hand holding a wallet"
    >
      <AuthHeader
        title="Start Accessing Banking Needs With All Devices and All Platforms With 30.000+ Users"
        subtitle="Transfering money is easier than ever, you can access Zwallet wherever you are. Desktop, laptop, mobile phone? we cover all of that for you!"
      />

      <div className="flex flex-col gap-4 mt-2">
        <SocialButton
          icon={<GoogleIcon />}
          onClick={() => navigate("/admin", { replace: true })}
        >
          Sign In With Google
        </SocialButton>
        <SocialButton
          icon={<FacebookIcon />}
          onClick={() => navigate("/admin", { replace: true })}
        >
          Sign In With Facebook
        </SocialButton>
      </div>

      <div className="flex items-center gap-4 text-[0.85rem] text-gray-500 my-2 before:content-[''] before:flex-1 before:border-b before:border-neutral-200 after:content-[''] after:flex-1 after:border-b after:border-neutral-200">
        <span>Or</span>
      </div>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="flex flex-col gap-4"
        noValidate
      >
        <InputField
          {...register("email", {
            required: true,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          id="email"
          type="email"
          label="Email"
          name="email"
          placeholder="Enter Your Email"
          iconLeft={<MailIcon />}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">
            {errors.email.message || "Email is required"}
          </span>
        )}

        <InputField
          {...register("password", {
            required: true,
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          id="password"
          name="password"
          label="Password"
          placeholder="Enter Your Password"
          iconLeft={<PasswordIcon />}
          isPassword
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message || "Password is required"}
          </span>
        )}

        <InputField
          {...register("confirmPassword", {
            required: true,
            validate: (value) => value === password || "Passwords do not match",
          })}
          id="confirm-password"
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Enter Your Password Again"
          iconLeft={<PasswordIcon />}
          isPassword
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-sm">
            {errors.confirmPassword.message || "Confirm Password is required"}
          </span>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>

      <nav className="mt-2 text-[0.95rem] text-center text-gray-500 flex flex-col gap-1.5 sm:mt-4">
        <p>
          Have An Account?{" "}
          <a
            href="/login"
            className="font-semibold transition-colors text-blue-700 hover:underline"
          >
            Login
          </a>
        </p>
      </nav>
    </AuthLayout>
  );
};

export default Register;
