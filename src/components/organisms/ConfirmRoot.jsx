import FloatingConfirm from "./FloatingConfirm";
import useLogoutStore from "@zustand/store";

const ConfirmRoot = () => {
  const { modalLogout, title, messages, handleConfirm, toggleModalLogout } =
    useLogoutStore((state) => state);

  return (
    <FloatingConfirm
      open={modalLogout}
      title={title}
      messages={messages}
      handleOpen={toggleModalLogout}
      handleConfirm={handleConfirm}
    />
  );
};

export default ConfirmRoot;
