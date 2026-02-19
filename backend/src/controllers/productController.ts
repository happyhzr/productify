import type { Request, Response } from "express";
import * as queries from "../db/queries"
import { getAuth } from "@clerk/express";

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await queries.getAllProducts()
        return res.status(200).json(products)
    } catch (err) {
        console.log("Error fetching products:", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const getMyProducts = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req)
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const products = await queries.getProductsByUserId(userId)
        return res.status(200).json(products)
    } catch (err) {
        console.log("Error fetching my products:", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await queries.getProductById(id as string)
        if (!product) {
            return res.status(404).json({ error: "Product not found" })
        }
    } catch (err) {
        console.log("Error fetching product:", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req)
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const { title, description, imageUrl } = req.body
        if (!title || !description || !imageUrl) {
            return res.status(400).json({ error: "Missing required fields" })
        }
        const product = await queries.createProduct({ title, description, imageUrl, userId })
        return res.status(201).json(product)
    } catch (err) {
        console.log("Error creating product:", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req)
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const { id } = req.params
        const { title, description, imageUrl } = req.body
        const existingProduct = await queries.getProductById(id as string)
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" })
        }
        if (existingProduct.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" })
        }
        const product = await queries.updateProduct(id as string, { title, description, imageUrl })
        return res.status(200).json(product)
    } catch (err) {
        console.log("Error updating product:", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req)
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const { id } = req.params
        const existingProduct = await queries.getProductById(id as string)
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" })
        }
        if (existingProduct.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" })
        }
        const product = await queries.deleteProduct(id as string)
        return res.status(200).json(product)
    } catch (err) {
        console.log("Error deleting product:", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}