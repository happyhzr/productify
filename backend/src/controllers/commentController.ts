import type { Request, Response } from "express";
import * as queries from "../db/queries"
import { getAuth } from "@clerk/express";

export const createComment = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req)
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const { productId } = req.params
        const { content } = req.body
        if (!content) {
            return res.status(400).json({ error: "Missing required fields" })
        }
        const product = await queries.getProductById(productId as string)
        if (!product) {
            return res.status(404).json({ error: "Product not found" })
        }
        const comment = await queries.createComment({ content, productId: productId as string, userId })
        return res.status(201).json(comment)
    } catch (err) {
        console.log("Error creating comment:", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req)
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const { commentId } = req.params
        const comment = await queries.getCommentById(commentId as string)
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" })
        }
        if (comment.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" })
        }
        await queries.deleteComment(commentId as string)
        return res.status(200).json({ message: "Comment deleted successfully" })
    } catch (err) {
        console.log("Error deleting comment:", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}