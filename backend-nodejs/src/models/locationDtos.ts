import { z } from "zod";

const mimeEnum = z.enum(["image/jpeg", "image/png"]);
const base64Re = /^[A-Za-z0-9+/]+={0,2}$/; // raw Base64 (no data: prefix)

export const CreateLocationDto = z.object({
  name: z.string().min(1),
  lat: z.number().refine((v) => v >= -90 && v <= 90),
  lng: z.number().refine((v) => v >= -180 && v <= 180),
  locationName: z.string().optional(),
  screenWidth: z.number().optional(),
  screenHeight : z.number().optional(),
  description: z.string().optional(),

  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),

  isActive: z.boolean().optional(),

  // image as Base64 (stored in DB)
  imageBase64: z
    .string()
    .regex(base64Re, "Invalid Base64 content")
    .max(7_000_000, "Image too large") // ~≈5MB decoded
    .optional(),
  imageMime: mimeEnum.optional(),
});

export type CreateLocationDto = z.infer<typeof CreateLocationDto>;

export const UpdateLocationDto = CreateLocationDto.partial();
export type UpdateLocationDto = z.infer<typeof UpdateLocationDto>;