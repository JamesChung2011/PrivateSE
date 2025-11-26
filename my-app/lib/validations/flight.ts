import { z } from "zod";

export const flightSchema = z.object({
    flight_number: z
        .string()
        .min(1, "Flight number is required")
        .max(10, "Flight number must be at most 10 characters"),
    route_id: z
        .number()
        .int()
        .positive("Route ID must be a positive integer"),
    carrier: z
        .string()
        .max(50, "Carrier must be at most 50 characters")
        .optional()
        .nullable(),
    status: z
        .enum(["active", "inactive", "cancelled"])
        .default("active")
        .optional(),
})

export const updateFlightSchema = flightSchema.partial();

export type FlightInput = z.infer<typeof flightSchema>;
export type UpdateFlightInput = z.infer<typeof updateFlightSchema>;