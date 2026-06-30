import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { PencilLineIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  newChatFormSchema,
  type NewChatFormSchema,
} from '../http/schemas/new-chat-form'
import { listUsers } from '../http/list-users'
import { createChat } from '../http/create-chat'
import { useCurrentUser } from '../hooks/use-current-user'

export function NewChatDialog() {
  const [open, setOpen] = useState(false)
  const currentUser = useCurrentUser()

  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
    enabled: open,
  })

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<NewChatFormSchema>({
    resolver: zodResolver(newChatFormSchema),
    defaultValues: {
      name: '',
      membersIds: [],
    },
  })

  const otherUsers =
    data?.users.filter((user) => user._id !== currentUser?._id) ?? []

  async function onSubmit(formData: NewChatFormSchema) {
    try {
      await createChat(formData)
      reset()
      setOpen(false)
    } catch {
      setError('root', { message: 'Could not create a new chat.' })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) reset()
      }}
    >
      <DialogTrigger className="flex items-center gap-2 px-4 py-2 font-semibold text-sm text-white bg-indigo-500 rounded-full cursor-pointer">
        <span className="hidden sm:inline">New chat</span>
        <PencilLineIcon className="size-4" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New chat</DialogTitle>
          <DialogDescription>
            Name your new chat and select the participants
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="flex flex-col gap-1 space-y-2">
            Name
            <input
              type="text"
              autoFocus
              className={`p-2 border outline-none rounded-lg ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 focus:border-indigo-500'}`}
              {...register('name')}
            />
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </label>

          <div className="flex flex-col gap-1 space-y-2">
            Participants
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-2 border border-zinc-200 rounded-lg">
              {otherUsers.length === 0 ? (
                <span className="text-sm text-zinc-400">No users found</span>
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
                      {...register('membersIds')}
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
            className={`w-full py-4 mt-2 font-medium text-white rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${Object.keys(errors).length > 0 ? 'bg-red-500' : 'bg-indigo-500'}`}
          >
            {isSubmitting ? 'Creating...' : 'Create chat'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
