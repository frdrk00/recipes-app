import { createRecipeInput } from "~/types";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const recipeRouter = createTRPCRouter({
    all: protectedProcedure.query( async ({ ctx }) => {
        const recipes = await ctx.prisma.recipe.findMany({
            where: {
                userId: ctx.session.user.id
            },
            include: {
                ingredients: true
            }
        })

        return recipes.map(({ id, title, ingredients}) => ({ id, title, ingredients}))
    }),
    
    create: protectedProcedure.input(createRecipeInput).mutation(async ({ ctx, input}) => {
        return ctx.prisma.recipe.create({
            data: {
                title: input.title,
                ingredients: {
                    create: input.ingredients.map(ingredient => ({
                        title: ingredient, user: {
                            connect: {
                                id: ctx.session.user.id
                            }
                        }
                    }))
                },
                user: {
                    connect: {
                        id: ctx.session.user.id
                    }
                }
            }
        })
    })
})