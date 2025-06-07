import { router } from "./create-context";
import { hiProcedure } from "./routes/example/hi/route";
import { listTripsProcedure } from "./routes/trips/list/route";
import { listExpensesProcedure } from "./routes/expenses/list/route";
import { listAlarmsProcedure } from "./routes/alarms/list/route";

export const appRouter = router({
  example: router({
    hi: hiProcedure,
  }),
  trips: router({
    list: listTripsProcedure,
  }),
  expenses: router({
    list: listExpensesProcedure,
  }),
  alarms: router({
    list: listAlarmsProcedure,
  }),
});

export type AppRouter = typeof appRouter;