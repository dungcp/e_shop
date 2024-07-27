"use client";

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
interface Props {
  currentUser: any;
}
const LoginForm = ({ currentUser }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      router.push("/cart");
      router.refresh();
    }
  }, [currentUser]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    console.log(data);
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      // console.log(callback);
      setIsLoading(false);
      if (callback?.ok) {
        router.push("/cart");
        router.refresh();
        toast.success("login successful");
      }
      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };

  if (currentUser) {
    return <p className="text-center">Logged in. Redirecting...</p>;
  }

  return (
    <>
      <Heading title="Sign in for E-Shop" />
      <Button
        outline
        label="Sign in with Google"
        onClick={() => {
          signIn("google");
        }}
        icon={AiOutlineGoogle}
      />
      <hr className="bg-slate-300 w-full h-px" />

      <Input
        id="email"
        label="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="email"
        required
      />
      <Input
        id="password"
        label="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />
      <Button
        label={isLoading ? "loading" : "Login"}
        onClick={handleSubmit(onSubmit)}
      />
      <p className="text-sm">
        Do not have an account?{" "}
        <Link className="underline" href={"/register"}>
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
