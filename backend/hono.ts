import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

// Simple health check endpoint
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

// Trip endpoints
app.get("/trips", async (c) => {
  try {
    // In a real app, this would fetch from a database
    return c.json({
      status: "success",
      data: [
        {
          id: "1",
          name: "Weekend Getaway",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 172800000).toISOString(), // 2 days later
          travelType: "car",
          stops: [
            {
              id: "101",
              location: {
                name: "Mountain View Resort",
                address: "123 Mountain Rd, Hill Valley",
                latitude: 37.7749,
                longitude: -122.4194,
              },
              alarmEnabled: true,
            },
          ],
          alarmSound: "bell",
        },
        {
          id: "2",
          name: "Business Trip",
          startDate: new Date(Date.now() + 604800000).toISOString(), // 1 week later
          endDate: new Date(Date.now() + 864000000).toISOString(), // 10 days later
          travelType: "plane",
          stops: [
            {
              id: "201",
              location: {
                name: "Downtown Conference Center",
                address: "456 Business Ave, Metro City",
                latitude: 40.7128,
                longitude: -74.0060,
              },
              alarmEnabled: true,
            },
          ],
          alarmSound: "digital",
        },
      ],
    });
  } catch (error) {
    return c.json({ status: "error", message: "Failed to fetch trips" }, 500);
  }
});

app.get("/trips/:id", async (c) => {
  try {
    const id = c.req.param("id");
    // In a real app, this would fetch from a database
    const trips = [
      {
        id: "1",
        name: "Weekend Getaway",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 172800000).toISOString(), // 2 days later
        travelType: "car",
        stops: [
          {
            id: "101",
            location: {
              name: "Mountain View Resort",
              address: "123 Mountain Rd, Hill Valley",
              latitude: 37.7749,
              longitude: -122.4194,
            },
            alarmEnabled: true,
          },
        ],
        alarmSound: "bell",
      },
      {
        id: "2",
        name: "Business Trip",
        startDate: new Date(Date.now() + 604800000).toISOString(), // 1 week later
        endDate: new Date(Date.now() + 864000000).toISOString(), // 10 days later
        travelType: "plane",
        stops: [
          {
            id: "201",
            location: {
              name: "Downtown Conference Center",
              address: "456 Business Ave, Metro City",
              latitude: 40.7128,
              longitude: -74.0060,
            },
            alarmEnabled: true,
          },
        ],
        alarmSound: "digital",
      },
    ];
    
    const trip = trips.find(t => t.id === id);
    
    if (!trip) {
      return c.json({ status: "error", message: "Trip not found" }, 404);
    }
    
    return c.json({ status: "success", data: trip });
  } catch (error) {
    return c.json({ status: "error", message: "Failed to fetch trip" }, 500);
  }
});

app.post("/trips", async (c) => {
  try {
    const body = await c.req.json();
    // In a real app, this would save to a database
    return c.json({
      status: "success",
      data: {
        id: Date.now().toString(),
        ...body,
      },
    });
  } catch (error) {
    return c.json({ status: "error", message: "Failed to create trip" }, 500);
  }
});

app.put("/trips/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    // In a real app, this would update in a database
    return c.json({
      status: "success",
      data: {
        id,
        ...body,
      },
    });
  } catch (error) {
    return c.json({ status: "error", message: "Failed to update trip" }, 500);
  }
});

app.delete("/trips/:id", async (c) => {
  try {
    const id = c.req.param("id");
    // In a real app, this would delete from a database
    return c.json({
      status: "success",
      message: "Trip deleted successfully",
    });
  } catch (error) {
    return c.json({ status: "error", message: "Failed to delete trip" }, 500);
  }
});

// Expense endpoints
app.get("/expenses", async (c) => {
  try {
    // In a real app, this would fetch from a database
    return c.json({
      status: "success",
      data: [
        {
          id: "1",
          amount: 1250.75,
          category: "Transportation",
          date: new Date().toISOString(),
          notes: "Train tickets for weekend trip",
          tripId: "1",
        },
        {
          id: "2",
          amount: 3500.00,
          category: "Accommodation",
          date: new Date().toISOString(),
          notes: "Hotel booking for 2 nights",
          tripId: "1",
        },
        {
          id: "3",
          amount: 850.50,
          category: "Food",
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          notes: "Dinner at restaurant",
          tripId: "1",
        },
        {
          id: "4",
          amount: 12000.00,
          category: "Transportation",
          date: new Date(Date.now() + 604800000).toISOString(), // 1 week later
          notes: "Flight tickets",
          tripId: "2",
        },
      ],
    });
  } catch (error) {
    return c.json({ status: "error", message: "Failed to fetch expenses" }, 500);
  }
});

app.post("/expenses", async (c) => {
  try {
    const body = await c.req.json();
    // In a real app, this would save to a database
    return c.json({
      status: "success",
      data: {
        id: Date.now().toString(),
        ...body,
      },
    });
  } catch (error) {
    return c.json({ status: "error", message: "Failed to create expense" }, 500);
  }
});

app.put("/expenses/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    // In a real app, this would update in a database
    return c.json({
      status: "success",
      data: {
        id,
        ...body,
      },
    });
  } catch (error) {
    return c.json({ status: "error", message: "Failed to update expense" }, 500);
  }
});

app.delete("/expenses/:id", async (c) => {
  try {
    const id = c.req.param("id");
    // In a real app, this would delete from a database
    return c.json({
      status: "success",
      message: "Expense deleted successfully",
    });
  } catch (error) {
    return c.json({ status: "error", message: "Failed to delete expense" }, 500);
  }
});

export default app;