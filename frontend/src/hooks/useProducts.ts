import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct, deleteProduct, getAllProducts, getProductById } from "../lib/api"

export const useProducts = () => {
    const result = useQuery({ queryKey: ["products"], queryFn: getAllProducts })
    return result
}

export const useCreateProduct = () => {
    const result = useMutation({ mutationFn: createProduct })
    return result
}

export const useProduct = (id: string) => {
    const result = useQuery({ queryKey: ["product", id], queryFn: () => { return getProductById(id) }, enabled: Boolean(id) })
    return result
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myProducts"] });
        },
    })
}