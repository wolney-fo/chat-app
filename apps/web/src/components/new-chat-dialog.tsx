import { Dialog } from "@base-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { PencilLineIcon, XIcon } from "lucide-react";
import {
  newChatFormSchema,
  type NewChatFormSchema,
} from "../http/schemas/new-chat-form";
import { listUsers } from "../http/list-users";
import { createChat } from "../http/create-chat";
import { useCurrentUser } from "../hooks/use-current-user";

export function NewChatDialog() {
  const [open, setOpen] = useState(false);
  const currentUser = useCurrentUser();

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<NewChatFormSchema>({
    resolver: zodResolver(newChatFormSchema),
    defaultValues: {
      name: "",
      membersIds: [],
    },
  });

  const otherUsers =
    data?.users.filter((user) => user._id !== currentUser?._id) ?? [];

  async function onSubmit(formData: NewChatFormSchema) {
    try {
      await createChat(formData);
      reset();
      setOpen(false);
    } catch {
      setError("root", { message: "Não foi possível criar o chat." });
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) reset();
      }}
    >
      <Dialog.Trigger className="flex items-center gap-2 px-4 py-2 font-semibold text-sm text-white bg-indigo-500 rounded-full cursor-pointer">
        <span className="hidden sm:inline">Novo chat</span>
        <PencilLineIcon className="size-4" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 transition-opacity data-starting-style:opacity-0 data-ending-style:opacity-0" />

        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 space-y-4 p-6 bg-white border border-zinc-200 rounded-lg shadow-lg transition data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-bold text-xl">
              Novo chat
            </Dialog.Title>
            <Dialog.Close className="text-zinc-400 hover:text-zinc-700 cursor-pointer">
              <XIcon className="size-5" />
            </Dialog.Close>
          </div>

          <Dialog.Description className="text-sm text-zinc-500">
            Dê um nome ao chat e selecione os participantes.
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label className="flex flex-col gap-1 space-y-2">
              Nome
              <input
                type="text"
                autoFocus
                className={`p-2 border outline-none rounded-lg ${errors.name ? "border-red-500 focus:border-red-500" : "border-zinc-200 focus:border-indigo-500"}`}
                {...register("name")}
              />
              {errors.name && (
                <span className="text-sm text-red-500">
                  {errors.name.message}
                </span>
              )}
            </label>

            <div className="flex flex-col gap-1 space-y-2">
              Participantes
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-2 border border-zinc-200 rounded-lg">
                {otherUsers.length === 0 ? (
                  <span className="text-sm text-zinc-400">
                    Nenhum usuário disponível.
                  </span>
                ) : (
                  otherUsers.map((user) => (
                    <label
                      key={user._id}
                      className="flex items-center gap-2 text-sm text-zinc-700"
                    >
                      <input
                        type="checkbox"
                        value={user._id}
                        className="accent-indigo-500"
                        {...register("membersIds")}
                      />
                      {user.name}
                    </label>
                  ))
                )}
              </div>
              {errors.membersIds && (
                <span className="text-sm text-red-500">
                  {errors.membersIds.message}
                </span>
              )}
            </div>

            {errors.root && (
              <p className="text-sm text-red-500 text-center">
                {errors.root.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 mt-2 font-medium text-white rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${Object.keys(errors).length > 0 ? "bg-red-500" : "bg-indigo-500"}`}
            >
              {isSubmitting ? "Criando..." : "Criar chat"}
            </button>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
