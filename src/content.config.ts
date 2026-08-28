import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    summary: z.string(), // short one-liner for cards + meta description
    category: z.enum(['bach', 'ceramic', 'oils']),
    price: z.number(), // ILS
    image: z.string(), // /images/products/<id>.jpg (kept in /public for Snipcart)
    volume: z.string().optional(),
    inStock: z.boolean().default(true),
    variantName: z.string().optional(),
    variantOptions: z.array(z.string()).optional(),
    order: z.number().default(100),
    featured: z.boolean().default(false),
  }),
});

const flora = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/flora' }),
  schema: z.object({
    name: z.string(),
    latinName: z.string(),
    image: z.string(),
    identification: z.string(),
    activity: z.string(),
    internalUse: z.array(z.string()).default([]),
    internalUseNote: z.string().optional(),
    externalUse: z.array(z.string()).default([]),
    externalUseNote: z.string().optional(),
    sideEffects: z.string().optional(),
    sideEffectsLabel: z.string().default('תופעות לוואי אפשריות'),
    bloomMonths: z.string().optional(),
    region: z.string().optional(),
    plantType: z.string().optional(),
    partsUsed: z.string().optional(),
    taste: z.string().optional(),
    similarPlants: z.array(z.string()).default([]), // ids of related flora entries
    tip: z.string().optional(),
  }),
});

const workshops = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/workshops' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    image: z.string(),
    order: z.number().default(100),
    signupReason: z.string(), // pre-selects the reason on /contact
  }),
});

export const collections = { products, flora, workshops };
