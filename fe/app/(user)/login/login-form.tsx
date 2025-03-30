// app/(user)/login/page.tsx
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginFormInputs, LoginResponse } from "@/lib/validate/auth";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const response = await apiPost<LoginResponse, LoginFormInputs>(
      "/auth/login",
      data,
      {}
    );
    console.log(response);
    if (response.error) {
      toast.error(response.error);
    }
    if (response.data) {
      toast.success("Đăng nhập thành công");
      router.push("/");
      router.refresh();
    }
    console.log("Dữ liệu đăng nhập:", data);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
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
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
        >
          Đăng nhập
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
