"use client";

import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // 추가됨
import { signIn } from "../actions/auth";

export interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: "onChange",
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    if (isValid) {
      const result = await signIn(data);

      if (!result.success) {
        alert(result.error);
        return;
      } else {
        Cookies.set("session", JSON.stringify(result.user), {
          expires: 1,
          path: "/",
        });
        router.replace("/pokemonList");
        return;
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-cyan-400 to-blue-500">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden w-full max-w-md">
        <form className="p-8" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-3xl mb-6 text-center font-bold text-white">
            Login
          </h2>
          <div className="space-y-4">
            <div>
              <input
                {...register("email", {
                  required: "이메일을 입력해주세요.",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "유효한 이메일 주소를 입력해주세요.",
                  },
                })}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 bg-opacity-50 text-gray-800 focus:outline-none focus:bg-opacity-70 transition duration-300"
                type="email"
                placeholder="E-mail"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("password", {
                  required: "비밀번호를 입력해주세요.",
                  minLength: {
                    value: 8,
                    message: "비밀번호는 최소 8자 이상이어야 합니다.",
                  },
                })}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 bg-opacity-50 text-gray-800 focus:outline-none focus:bg-opacity-70 transition duration-300"
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <button
            className={`w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg mt-6 transition duration-300 ${
              isValid ? "hover:opacity-90" : "opacity-50 cursor-not-allowed"
            }`}
            type="submit"
            disabled={!isValid}
          >
            LOGIN
          </button>
          <div className="text-center mt-4">
            <Link href="/sign-up" className="text-white hover:underline">
              계정이 없나요? 가입하기
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
