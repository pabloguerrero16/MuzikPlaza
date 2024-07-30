import { useEffect } from "react";
import { HiCheck, HiX } from "react-icons/hi";

type ToastProps = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const baseStyles =
    "fixed top-4 right-4 z-50 p-4 rounded-md text-white max-w-md";

  const successContent = (
    <div className="flex items-center">
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
        <HiCheck className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
    </div>
  );

  const errorContent = (
    <div className="flex items-center">
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
        <HiX className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
    </div>
  );

  return (
    <div
      className={`${baseStyles} ${
        type === "SUCCESS" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {type === "SUCCESS" ? successContent : errorContent}
    </div>
  );
};

export default Toast;
