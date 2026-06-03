import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { usePageTitle } from "@hooks";
import { ProfileIcon } from "@components/atoms/icons";
import { profile } from "@/assets/images";
import { PageHeader, FormField } from "@components/molecules";
import { Button } from "@components/atoms";

import { fetchProfile, updateProfile } from "@redux/slices/account";
import { getThunkErrorMessage } from "@redux/api";

import { useLoadSpinner } from "@hooks";

function Profile() {
  const toggleSpinner = useLoadSpinner();
  const { user: userLogin } = useSelector((state) => state.userLogin);
  const [avatarPreview, setAvatarPreview] = useState();
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const { status: updateStatus } = useSelector(
    (state) => state.account.profileUpdate,
  );
  const isSubmitting = updateStatus === "loading";

  useEffect(() => {
    if (userLogin?.token) {
      dispatch(fetchProfile());
    }
  }, [dispatch, userLogin?.token]);

  useEffect(() => {
    reset({
      name: userLogin?.name || "",
      phone: userLogin?.phone || "",
    });
  }, [reset, userLogin?.name, userLogin?.phone]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      toggleSpinner();
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    toggleSpinner();
    setAvatarPreview(null);
    setAvatarFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpdateProfile = async (data) => {
    try {
      await dispatch(
        updateProfile({
          name: data.name,
          phone: data.phone,
          photo: avatarFile,
        }),
      ).unwrap();

      setAvatarFile(null);
      setAvatarPreview(undefined);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(getThunkErrorMessage(error, "Failed to update profile"));
    }
  };

  usePageTitle("Profile");
  const displayedAvatar =
    avatarPreview === undefined ? userLogin?.avatar || profile : avatarPreview;

  return (
    <>
      <main className="page-main md:col-span-1 lg:col-span-2">
        <PageHeader
          icon={<ProfileIcon className="stroke-blue-600" />}
          title="Profile"
        />

        <div className="flex flex-col gap-6 p-4 bg-white border border-gray-200 rounded-xl sm:p-6 lg:p-8 lg:gap-8">
          {/* Profile Picture Section */}
          <div className="form-group">
            <p className="form-label">Profile Picture</p>
            <div className="flex flex-wrap items-start gap-5">
              <div className="relative flex items-center justify-center shrink-0 w-20 h-20 overflow-hidden bg-gray-100 border border-gray-200 rounded-xl sm:w-24 sm:h-24">
                {displayedAvatar ? (
                  <img
                    src={displayedAvatar}
                    alt="Profile Preview"
                    className="object-cover w-full h-full rounded-xl"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 absolute top-0 left-0">
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M25 31.25C31.9036 31.25 37.5 25.6536 37.5 18.75C37.5 11.8464 31.9036 6.25 25 6.25C18.0964 6.25 12.5 11.8464 12.5 18.75C12.5 25.6536 18.0964 31.25 25 31.25Z"
                        stroke="#4F5665"
                        strokeMiterlimit="10"
                      />
                      <path
                        d="M6.05273 42.1857C7.97375 38.8606 10.736 36.0996 14.0619 34.18C17.3878 32.2605 21.1603 31.25 25.0004 31.25C28.8405 31.25 32.613 32.2606 35.9389 34.1803C39.2648 36.0999 42.0269 38.8609 43.9479 42.1861"
                        stroke="#4F5665"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 sm:text-[0.9rem] sm:px-5">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.35305 10.1942L5.2599 13.9042C5.25589 14.1022 5.33102 14.2932 5.46924 14.4352C5.60847 14.5782 5.79878 14.6582 5.99711 14.6582H9.68313C10.4494 14.6582 11.1706 14.3602 11.7135 13.8182L19.0975 6.4461C19.6805 5.86509 20 5.09208 20 4.27006C20 3.45005 19.6805 2.67604 19.0975 2.09503L17.9006 0.900014C16.6986 -0.300005 14.7444 -0.300005 13.5434 0.900014L6.19343 8.23812C5.67057 8.76013 5.37208 9.45514 5.35305 10.1942ZM6.82746 10.2312C6.83748 9.87215 6.98172 9.53314 7.23713 9.27914L12.9385 3.58605L14.8115 5.45808C14.9558 5.60108 15.1441 5.67308 15.3334 5.67308C15.5217 5.67308 15.711 5.60108 15.8552 5.45808C16.1427 5.16908 16.1427 4.70407 15.8552 4.41607L13.9812 2.54504L14.5861 1.94103C15.2122 1.31602 16.2308 1.31602 16.8579 1.94103L18.0548 3.13705C18.6808 3.76206 18.6808 4.77907 18.0548 5.40508L10.6707 12.7772C10.4063 13.0412 10.0557 13.1852 9.68313 13.1852H6.75434L6.82746 10.2312ZM0.738407 10.4431C1.14507 10.4431 1.47561 10.1131 1.47561 9.70705V5.93799C1.47561 3.24795 3.1173 1.50992 5.65845 1.50992H9.33546C9.74313 1.50992 10.0737 1.18092 10.0737 0.773912C10.0737 0.367905 9.74313 0.0379006 9.33546 0.0379006H5.65845C2.27392 0.0379006 0.000200328 2.40894 0.000200328 5.93799V9.70705C0.000200328 10.1131 0.330741 10.4431 0.738407 10.4431ZM19.2585 9.40984C18.8508 9.40984 18.5213 9.73885 18.5213 10.1459V14.0999C18.5213 16.79 16.8786 18.527 14.3364 18.527H5.65825C3.1171 18.527 1.47641 16.79 1.47641 14.0999C1.47641 13.6939 1.14587 13.3639 0.738207 13.3639C0.331542 13.3639 0 13.6939 0 14.0999C0 17.629 2.27372 20 5.65825 20H14.3364C17.722 20 19.9957 17.629 19.9957 14.0999V10.1459C19.9957 9.73885 19.6652 9.40984 19.2585 9.40984Z"
                      fill="white"
                    />
                  </svg>
                  Change Profile
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleDeleteAvatar}
                  className="btn-danger sm:text-[0.9rem] sm:px-5"
                >
                  <svg
                    width="19"
                    height="20"
                    viewBox="0 0 19 20"
                    fill="none"
                    className="shrink-0"
                  >
                    <path
                      d="M16.3238 7.4675C16.3238 7.4675 15.7808 14.2025 15.4658 17.0395C15.3158 18.3945 14.4788 19.1885 13.1078 19.2135C10.4988 19.2605 7.88681 19.2635 5.27881 19.2085C3.95981 19.1815 3.13681 18.3775 2.98981 17.0465C2.67281 14.1845 2.13281 7.4675 2.13281 7.4675"
                      stroke="#D00000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.708 4.23901H0.75"
                      stroke="#D00000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.4406 4.239C13.6556 4.239 12.9796 3.684 12.8256 2.915L12.5826 1.699C12.4326 1.138 11.9246 0.75 11.3456 0.75H7.11258C6.53358 0.75 6.02558 1.138 5.87558 1.699L5.63258 2.915C5.47858 3.684 4.80258 4.239 4.01758 4.239"
                      stroke="#D00000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Delete Profile
                </button>
              </div>
            </div>
            <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
              The profile picture must be 512 x 512 pixels or less
            </p>
          </div>

          <form onSubmit={handleSubmit(handleUpdateProfile)}>
            {/* Full Name */}
            <FormField
              {...register("name", { required: true })}
              label="Full Name"
              id="full-name"
              placeholder="Enter Full Name"
              name="name"
              noValidate
              defaultValue={userLogin.name || ""}
              icon={
                <svg width="20" height="20" viewBox="0 0 50 50" fill="none">
                  <path
                    d="M25 31.25C31.9036 31.25 37.5 25.6536 37.5 18.75C37.5 11.8464 31.9036 6.25 25 6.25C18.0964 6.25 12.5 11.8464 12.5 18.75C12.5 25.6536 18.0964 31.25 25 31.25Z"
                    stroke="#4F5665"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M6.05273 42.1857C7.97375 38.8606 10.736 36.0996 14.0619 34.18C17.3878 32.2605 21.1603 31.25 25.0004 31.25C28.8405 31.25 32.613 32.2606 35.9389 34.1803C39.2648 36.0999 42.0269 38.8609 43.9479 42.1861"
                    stroke="#4F5665"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message || "Name is required"}
              </span>
            )}

            {/* Phone */}
            <FormField
              {...register("phone", {
                required: true,
                pattern: {
                  value: /^\+?[0-9]{7,15}$/,
                  message: "Invalid phone number",
                },
              })}
              label="Phone"
              id="phone"
              type="tel"
              placeholder="Enter Your Number Phone"
              name="phone"
              noValidate
              defaultValue={userLogin.phone || ""}
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M5.77977 7.80095C6.29842 8.86129 7.15792 9.71689 8.2206 10.2307C8.29835 10.2675 8.38436 10.2835 8.47015 10.277C8.55595 10.2705 8.63857 10.2418 8.7099 10.1937L10.2746 9.15028C10.3438 9.10414 10.4235 9.07598 10.5063 9.06838C10.5891 9.06077 10.6725 9.07394 10.749 9.10671L13.6763 10.3613C13.7757 10.4035 13.8588 10.4769 13.9128 10.5705C13.9669 10.664 13.9892 10.7726 13.9762 10.8798C13.8837 11.6038 13.5304 12.2693 12.9826 12.7516C12.4347 13.2339 11.7299 13.5 11 13.5C8.74566 13.5 6.58365 12.6045 4.98959 11.0104C3.39553 9.41635 2.5 7.25434 2.5 5C2.50004 4.27011 2.76612 3.56526 3.24843 3.01742C3.73073 2.46959 4.39618 2.11634 5.12019 2.02381C5.22745 2.01083 5.33602 2.03306 5.42955 2.08715C5.52307 2.14124 5.59649 2.22426 5.63873 2.3237L6.89439 5.25357C6.92687 5.32935 6.9401 5.41199 6.93291 5.49413C6.92572 5.57626 6.89833 5.65535 6.85318 5.72434L5.81341 7.31307C5.76608 7.38454 5.7381 7.46706 5.73221 7.55257C5.72631 7.63809 5.7427 7.72367 5.77977 7.80095V7.80095Z"
                    stroke="#4F5665"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">
                {errors.phone.message || "Phone is required"}
              </span>
            )}

            {/* Email */}
            <FormField
              value={userLogin.email}
              noValidate
              label="Email"
              id="email"
              type="email"
              disabled
              placeholder="Enter Your Email"
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-[#4F5665]"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.75 2C0.783502 2 4.49654e-09 2.7835 4.49654e-09 3.75V4.48577C-0.000162957 4.49479 -0.000162567 4.50381 4.49654e-09 4.51282V12.25C4.49654e-09 13.2165 0.783501 14 1.75 14H14.25C15.2165 14 16 13.2165 16 12.25V4.51265C16.0002 4.50376 16.0002 4.49485 16 4.48594V3.75C16 2.7835 15.2165 2 14.25 2H1.75ZM14.5 4.07029V3.75C14.5 3.61193 14.3881 3.5 14.25 3.5H1.75C1.61193 3.5 1.5 3.61193 1.5 3.75V4.07029L8 7.88063L14.5 4.07029ZM1.5 5.80902V12.25C1.5 12.3881 1.61193 12.5 1.75 12.5H14.25C14.3881 12.5 14.5 12.3881 14.5 12.25V5.80902L8.37929 9.39702C8.14507 9.53432 7.85493 9.53432 7.62071 9.39702L1.5 5.80902Z"
                    fill="currentColor"
                  />
                </svg>
              }
            />

            {/* Password */}
            <div className="form-group">
              <p className="form-label">Password</p>
              <Link
                to="change-password"
                className="text-[0.9rem] font-medium text-blue-600 hover:underline hover:text-blue-700 transition-colors w-fit"
              >
                Change Password
              </Link>
            </div>

            {/* Pin */}
            <div className="form-group">
              <p className="form-label">Pin</p>
              <Link
                to="change-pin"
                className="text-[0.9rem] font-medium text-blue-600 hover:underline hover:text-blue-700 transition-colors w-fit"
              >
                Change Pin
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              id="submit-profile"
              className="mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}

export default Profile;
