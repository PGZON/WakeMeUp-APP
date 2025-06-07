import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

const hiProcedure = publicProcedure
  .input(
    z.object({
      name: z.string().optional(),
    })
  )
  .query(({ input }) => {
    return {
      greeting: `Hello ${input.name || "World"}!`,
      timestamp: new Date().toISOString(),
    };
  });

export default hiProcedure;