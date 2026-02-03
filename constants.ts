import { WordPair } from './types';

// The requested vocabulary list
export const VOCABULARY: WordPair[] = [
  { group: "Gato", impostor: "Perro" },
  { group: "León", impostor: "Tigre" },
  { group: "Elefante", impostor: "Jirafa" },
  { group: "Bolígrafo", impostor: "Lápiz" },
  { group: "Cama", impostor: "Sofá" },
  { group: "Bicicleta", impostor: "Coche" },
  { group: "Paella", impostor: "Arroz con pollo" },
  { group: "Tacos", impostor: "Burritos" },
  { group: "Churros", impostor: "Donuts" },
  { group: "Gazpacho", impostor: "Sopa" },
  { group: "Tortilla de patatas", impostor: "Huevos fritos con patatas" },
  { group: "Pizza", impostor: "Hamburguesa" },
  { group: "Messi", impostor: "Cristiano Ronaldo" },
  { group: "Shakira", impostor: "Rosalía" },
  { group: "Cervantes", impostor: "Shakespeare" },
  { group: "Mickey Mouse", impostor: "Bugs Bunny" },
  { group: "Frida Kahlo", impostor: "Dalí" },
  { group: "Spiderman", impostor: "Batman" }
];

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 20;