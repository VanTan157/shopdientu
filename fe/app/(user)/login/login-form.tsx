"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginFormInputs, LoginResponse } from "@/lib/types/auth";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Circle, Eye, EyeOff, Facebook } from "lucide-react";
import { useEffect, useState } from "react";
import ActiveAccount from "./active-account";
import { useUserStore } from "@/app/store/user-store";
import { loadingStore } from "@/app/store/loading.store";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [showPass, setShowPass] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { setUser } = useUserStore();
  const router = useRouter();
  const { start, stop } = loadingStore();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    start();
    const response = await apiPost<LoginResponse, LoginFormInputs>(
      "/auth/login",
      data,
      {}
    );
    if (response.error) {
      toast.error(response.error);
    }
    if (response.data) {
      toast.success("Đăng nhập thành công");
      console.log("Login response:", response.data.user);
      setUser(response.data.user);
      router.push("/");
      router.refresh();
    }
    stop();
  };

  const handleGoogleLogin = () => {
    start();
    window.location.href = "http://localhost:8080/auth/google";
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "google_auth") {
      start();
      toast.success("Đăng nhập Google thành công");
      router.push("/");
      stop();
      router.refresh();
    } else if (params.get("error")) {
      toast.error("Đăng nhập Google thất bại");
    }
  }, [router]);

  return (
    <div>
      <div className="min-h-screen min-w-screen flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl text-cyan-700 font-bold text-center mb-6">
            Đăng nhập
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                className="mt-1 w-full bg-gray-50 border-gray-300 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không hợp lệ",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className="mt-1 w-full bg-gray-50 border-gray-300 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                {...register("password", {
                  required: "Mật khẩu là bắt buộc",
                  minLength: {
                    value: 3,
                    message: "Mật khẩu phải có ít nhất 6 ký tự",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPass((prev) => !prev)}
                className="absolute top-7 right-3 p-1 bg-transparent z-10"
                tabIndex={-1}
              >
                {!showPass ? (
                  <EyeOff className="size-5 text-gray-700 cursor-pointer hover:text-black" />
                ) : (
                  <Eye className="size-5 text-gray-700 cursor-pointer hover:text-black" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  {...register("remember")}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Ghi nhớ tôi
                </label>
              </div>
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <div className="text-black text-sm">
              Tài khoản của bạn chưa được kích hoạt?{" "}
              <span
                className="hover:cursor-pointer hover:text-blue-500"
                onClick={() => setOpen(true)}
              >
                Kích hoạt tài khoản
              </span>
            </div>
            <div className="flex items-center justify-between">
              <hr className="w-full border-gray-300" />
              <span className="mx-2 text-gray-500">Hoặc</span>
              <hr className="w-full border-gray-300" />
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700 text-center">
                Đăng nhập bằng
              </div>
              <div className="flex justify-center gap-4">
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Đăng nhập bằng Facebook"
                  className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 border rounded-md px-4 py-2 cursor-pointer"
                >
                  <Facebook className="w-5 h-5 text-blue-600" />
                  Facebook
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Đăng nhập bằng Google"
                  className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 border rounded-md px-4 py-2 cursor-pointer"
                  onClick={() => handleGoogleLogin()}
                >
                  <Circle className="w-5 h-5 text-red-500" />
                  Google
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md cursor-pointer mt-3"
            >
              Đăng nhập
            </Button>
          </form>
        </div>
      </div>
      <ActiveAccount open={open} setOpen={setOpen} />
    </div>
  );
};

export default LoginPage;
