// app/(user)/register/page.tsx
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/api";
import { RegisterFormInputs } from "@/lib/types/auth";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Verify } from "./verify";
import { User } from "next-auth";
import { loadingStore } from "@/app/store/loading.store";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const { start, stop } = loadingStore();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    start();
    const { confirmPassword, ...registerData } = data;
    const response = await apiPost<User, typeof registerData>(
      "/users",
      registerData
    );

    if (response.success) {
      toast.success(response.message);
      setOpen(true);
    } else {
      toast.error(response.message);
    }
    stop();
  };

  const password = watch("password");

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen min-w-screen">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-cyan-700">
            Đăng ký
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Tên người dùng
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Nhập tên người dùng"
                className="mt-1 w-full bg-gray-50 border-gray-300 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                {...register("name", {
                  required: "Tên người dùng là bắt buộc",
                  minLength: {
                    value: 3,
                    message: "Tên người dùng phải có ít nhất 3 ký tự",
                  },
                })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
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
                    value: 6,
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
            {/* Trường Confirm Password */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Xác nhận mật khẩu
              </label>
              <Input
                id="confirmPassword"
                type={showConfirmPass ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                className="mt-1 w-full bg-gray-50 border-gray-300 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                {...register("confirmPassword", {
                  required: "Vui lòng xác nhận mật khẩu",
                  validate: (value) =>
                    value === password || "Mật khẩu không khớp",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass((prev) => !prev)}
                className="absolute top-7 right-3 p-1 bg-transparent z-10"
                tabIndex={-1}
              >
                {!showConfirmPass ? (
                  <EyeOff className="size-5 text-gray-700 cursor-pointer hover:text-black" />
                ) : (
                  <Eye className="size-5 text-gray-700 cursor-pointer hover:text-black" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {/* Nút Submit */}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
            >
              Đăng ký
            </Button>
          </form>
        </div>
      </div>
      <Verify open={open} setOpen={setOpen} email={watch("email")} />
    </div>
  );
};

export default RegisterForm;
