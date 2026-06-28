import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const fish = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/fish" }),
  schema: z.object({
    commonName: z.string(),
    scientificName: z.string(),
    origin: z.string(),
    temperatureRange: z.string(),
    adultSize: z.string(),
    tankSize: z.string(),
    foodRecommendation: z.string(),
    difficulty: z.string(),
    temperament: z.string(),
    plantSafe: z.boolean(),
    invertebrateSafe: z.boolean(),
    juvenileAppearance: z.string(),
    adultMaleAppearance: z.string(),
    adultFemaleAppearance: z.string(),
    maleFemaleDifferences: z.string(),
    husbandryNotes: z.string(),
    anthonyNotes: z.string(),
    mainImage: z.string(),
    juvenileImage: z.string(),
    maleImage: z.string(),
    femaleImage: z.string(),
    galleryImages: z.array(z.string()).optional(),
    summary: z.string(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    lastUpdated: z.coerce.date(),
    summary: z.string(),
    pictorialSteps: z.array(z.string()).optional(),
    illustrationsDataTechnique: z.string().optional(),
    galleryImages: z.array(z.string()).optional(),
  }),
});

export const collections = { fish, notes };
