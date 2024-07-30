import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";
import clsx from "clsx";

export type SignInFormData = {
  email: string;
  password: string;
};

interface LoginProps {
  isSideMenuOpen: boolean;
}

const SignIn: React.FC<LoginProps> = ({ isSideMenuOpen }) => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Signed In Successfuly!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div
      className={clsx(
        "flex items-center justify-center min-h-screen bg-white transition-opacity duration-300",
        {
          "opacity-0 pointer-events-none": isSideMenuOpen,
        }
      )}
    >
      <div className="relative flex flex-col -mt-96 space-y-1 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <form onSubmit={onSubmit}>
          <div className="flex flex-col justify-center p-8 md:p-14">
            <span className="mb-3 text-4xl font-bold">Login</span>
            <span className="font-light text-gray-400 mb-8">
              Please, enter your credentials
            </span>

            <div className="py-4">
              <span className="mb-2 text-md">Email</span>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                {...register("email", { required: "This field is required" })}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>
            <div className="py-4">
              <span className="mb-2 text-md">Password</span>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                {...register("password", {
                  required: "This field is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>
            <div className="flex justify-between w-full py-4">
              <span className="font-bold text-md">Forgot Password</span>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
            >
              Login
            </button>

            <div className="text-center text-gray-400 md:text-base lg:text-base text-sm">
              Don't have an account?
              <Link to="/register">
                <span className="font-bold text-black"> Register here</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
