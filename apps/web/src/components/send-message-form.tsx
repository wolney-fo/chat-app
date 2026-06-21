import { ArrowUpIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  sendMessageFormSchema,
  type SendMessageFormSchema,
} from "../http/schemas/send-message-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface SendMessageFormProps {
  chatId: string;
}

export function SendMessageForm({ chatId }: SendMessageFormProps) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<SendMessageFormSchema>({
    resolver: zodResolver(sendMessageFormSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit({ content }: SendMessageFormSchema) {
    await fetch(
      `${import.meta.env.DEV ? "http://" : "https://"}${import.meta.env.VITE_API_URI}/chats/${chatId}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
        }),
        credentials: "include",
      },
    );

    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-4 w-11/12 max-w-2xl p-4 bg-indigo-50 border border-zinc-200 rounded-xl mb-8 shadow-sm shadow-indigo-400/50"
    >
      <input
        className="outline-none flex-1"
        type="text"
        placeholder="Type a message"
        autoComplete="off"
        {...register("content")}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="p-2 bg-indigo-500 rounded-full cursor-pointer disabled:opacity-75"
      >
        <ArrowUpIcon className="size-5 text-white" />
      </button>
    </form>
  );
}
