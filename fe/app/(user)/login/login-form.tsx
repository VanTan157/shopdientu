// app/(user)/login/page.tsx
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginFormInputs, LoginResponse } from "@/lib/types/auth";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Facebook, Circle } from "lucide-react"; //ng Circle làm placeholder cho Google

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
            Mật khẩu
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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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

        <div className="flex items-center justify-between">
          <hr className="w-full border-gray-300" />
          <span className="mx-2 text-gray-500">Hoặc</span>
          <hr className="w-full border-gray-300" />
        </div>
        <div className="space-y-">
          <div className="flex justify-center gap-4">
            <div
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 border rounded-md px-4 py-2 cursor-pointer"
              onClick={() => {
                // Thêm logic đăng nhập Facebook tại đây
                console.log("Đã nhấn đăng nhập Facebook");
              }}
            >
              <Facebook className="w-5 h-5 text-blue-600" />
              Facebook
            </div>
            <div
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 border rounded-md px-4 py-2 cursor-pointer"
              onClick={() => {
                // Thêm logic đăng nhập Google tại đây
                console.log("Đã nhấn đăng nhập Google");
              }}
            >
              <Circle className="w-5 h-5 text-red-500" />
              Google
            </div>
          </div>
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
