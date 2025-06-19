import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"

export function useAuthMutation<TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>
    (opts: UseMutationOptions<TData, TError, TVariables, TContext>) {
    return useMutation({
        ...opts,
        meta: {
            showAuthModal: true
        }
    }
    )
}