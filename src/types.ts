import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from './server/api/root'
import { z } from 'zod'

type RouterOutputs = inferRouterOutputs<AppRouter>
type allRecipesOutput = RouterOutputs["recipe"]["all"]

export type Recipe = allRecipesOutput[number]

export const createRecipeInput = z.object({
    title: z.string({
        required_error: 'Recipe title is required'
    }).min(1, 'Give your recipe a title').max(50),
    ingredients: z.array(z.string()).min(1, 'Add at least one ingredient')
})