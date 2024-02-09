import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { message } from "antd";
import { useRouter } from "next/navigation";
type Inputs = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,

    // formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    message.config({ maxCount: 1 });

    const response = await signIn("credentials", {
      username: data.username,
      password: data.password,

      redirect: false,
    });

    if (response?.ok) {
      message.loading("იტვირთება...", 0.5, () => {
        router.push("/orders");
      });
    } else {
      message.error("მომხარებელი ან პაროლი არასწორია");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-bold leading-6 text-gray-900"
        >
          მომხმარებელი
        </label>
        <div className="mt-2">
          <input
            id="email"
            {...register("username", { required: true })}
            className="block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-bold leading-6 text-gray-900"
          >
            პაროლი
          </label>
          <div className="text-sm"></div>
        </div>
        <div className="mt-2">
          <input
            id="password"
            type="password"
            {...register("password", { required: true })}
            className="block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          სისტემაში შესვლა
        </button>
      </div>
    </form>
  );
}
