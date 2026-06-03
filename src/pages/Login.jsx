import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
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
import { loginUser } from "@redux/slices/userLogin";
import { getThunkErrorMessage } from "@redux/api";

const Login = () => {
  usePageTitle("Login");
  useRedirectIfLoggedIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.userLogin);
  const isSubmitting = status === "loading";

  const navigate = useNavigate();
  const handleLogin = async (data) => {
    try {
      const loggedInUser = await dispatch(
        loginUser({
          email: data.email,
          password: data.password,
        }),
      ).unwrap();

      if (!loggedInUser.hasPin) {
        navigate("/enter-pin", { replace: true });
        toast.info("Please set your pin for better experience!");
        return;
      }

      navigate("/admin", { replace: true });
      toast.success(
        `Welcome back, ${loggedInUser.name || loggedInUser.email}!`,
      );
    } catch (error) {
      toast.error(getThunkErrorMessage(error, "Invalid email or password"));
    }
  };

  return (
    <AuthLayout
      imageSrc="/3d-hand-making-cashless-payment-from-smartphone 1.png"
      imageAlt="3D Hand holding a wallet"
    >
      <AuthHeader
        title="Hello Welcome Back 👋"
        subtitle="Fill out the form correctly or you can login with several options."
      />

      <div className="mt-2 flex flex-col gap-4">
        <SocialButton icon={<GoogleIcon />}>Sign In With Google</SocialButton>
        <SocialButton icon={<FacebookIcon />}>
          Sign In With Facebook
        </SocialButton>
      </div>

      <div className="my-2 flex items-center gap-4 text-[0.85rem] text-gray-500 before:flex-1 before:border-b before:border-neutral-200 before:content-[''] after:flex-1 after:border-b after:border-neutral-200 after:content-['']">
        <span>Or</span>
      </div>

      <form
        onSubmit={handleSubmit(handleLogin)}
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
          name="email"
          label="Email"
          placeholder="Enter Your Email"
          iconLeft={<MailIcon />}
        />
        {errors.email && (
          <span className="text-sm text-red-500">
            {errors.email.message || "Email is required"}
          </span>
        )}

        <InputField
          {...register("password", { required: true })}
          id="password"
          name="password"
          label="Password"
          placeholder="Enter Your Password"
          iconLeft={<PasswordIcon />}
          isPassword
        />
        {errors.password && (
          <span className="text-sm text-red-500">
            {errors.password.message || "Password is required"}
          </span>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>

      <nav className="mt-2 flex flex-col gap-1.5 text-center text-[0.95rem] text-gray-500 sm:mt-4">
        <p>
          Not Have An Account?{" "}
          <a
            href="/register"
            className="font-semibold text-blue-700 transition-colors hover:underline"
          >
            Register
          </a>
        </p>
        <p>
          Or Forgot Your Password?{" "}
          <a
            href="/forgot-password"
            className="font-semibold text-blue-700 transition-colors hover:underline"
          >
            Click Here
          </a>
        </p>
      </nav>
    </AuthLayout>
  );
};

export default Login;
