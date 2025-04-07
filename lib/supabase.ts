import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type CharacterStyle = {
  id: number;
  character: string;
  standard: string;
  cursive: string;
  bold_sans: string;
  monospace: string;
  gothic: string;
  fraktur: string;
  tiny_text: string;
  contained: string;
  stylish: string;
  golden_ratio: string;
  glitch: string;
  vaporwave: string;
  futuristic: string;
  neon_glow: string;
  emoji_blended: string;
  japanese_aesthetic: string;
  fantasy_game: string;
  techno_hacker: string;
  sci_fi: string;
  runic: string;
  handwritten: string;
  greek_roman: string;
  typewriter: string;
  pixel_art: string;
  alien_language: string;
  "3d_extruded": string;
  sparkle_magic: string;
  alien_glyphs: string;
  fantasy_rpg: string;
  horror_movie: string;
  street_graffiti: string;
  funky_retro: string;
  cyberpunk_glitch: string;
  ghostly_hollow: string;
  spooky_halloween: string;
  tech_terminal: string;
  calligraphy: string;
  cloud_like: string;
  starry_night: string;
  superhero_comic: string;
  mystical_rune: string;
};