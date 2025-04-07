"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import Head from 'next/head';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";

// Lazy load non-critical components
const FancyTextFAQ = lazy(() => import("@/components/ui/faqs"));
const Footer = lazy(() => import("@/components/ui/footer"));

// Move constants outside component to prevent re-creation on renders
const colorOptions = {
  // Basic colors
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  green: "#34C759",
  teal: "#5AC8FA",
  blue: "#007AFF",
  purple: "#AF52DE",
  pink: "#FF2D55",
  
  // Neutral colors
  black: "#000000",
  white: "#FFFFFF",
  gray: "#8E8E93",
  
  // Special effects
  rainbow: "rainbow",
  gradient: "gradient",
  neon: "neon",
};

const emojiThemes = {
  kawaii: { prefix: "🌸", suffix: "✨", extra: "🎀" },
  dark: { prefix: "🖤", suffix: "🌙", extra: "⛓️" },
  cyberpunk: { prefix: "⚡", suffix: "🤖", extra: "💻" },
  gaming: { prefix: "🎮", suffix: "🏆", extra: "🕹️" },
  nature: { prefix: "🌿", suffix: "🍃", extra: "🌺" },
  space: { prefix: "🌠", suffix: "🚀", extra: "👾" },
  magic: { prefix: "✨", suffix: "🔮", extra: "⭐" },
  ocean: { prefix: "🌊", suffix: "🐋", extra: "🐚" },
  royal: { prefix: "👑", suffix: "💫", extra: "💎" },
  love: { prefix: "💖", suffix: "💕", extra: "🌹" }
};

const aestheticBorders = {
  kawaii: {
    borderleft: "✦°• ",
    borderright: " •°✦",
    symbols: ["🌸", "✧", "🎀"]
  },
  dark: {
    borderleft: "▅▅▅⚝ ",
    borderright: " ⚝▅▅▅",
    symbols: ["🖤", "⚝", "🌙"]
  },
  cyberpunk: {
    borderleft: "━━━━ ✦❘ ",
    borderright: " ❘✦ ━━━━",
    symbols: ["➤", "↣", "➳"]
  },
  gaming: {
    borderleft: "╭━━━━╮ ",
    borderright: " ╰━━━━╯",
    symbols: ["🎮", "➽", "🏆"]
  },
  nature: {
    borderleft: "───✿",
    borderright: "✿───",
    symbols: ["🌿", "❃", "🍃"]
  },
  space: {
    borderleft: "☾ ⋆⁺₊✧ ",
    borderright: " ✧₊⋆ ☽",
    symbols: ["🌠", "⋆", "🚀"]
  },
  magic: {
    borderleft: "╰⊱⋆ ",
    borderright: " ⋆⊱╯",
    symbols: ["✨", "♆", "🔮"]
  },
  ocean: {
    borderleft: "╭───── ",
    borderright: " ─────╮",
    symbols: ["🌊", "❂", "🐚"]
  },
  royal: {
    borderleft: "━━ ",
    borderright: " ━━",
    symbols: ["👑", "❖", "💎"]
  },
  love: {
    borderleft: "💞 ",
    borderright: " 💞",
    symbols: ["❤", "❥", "💕"]
  }
};

// Flatten the style categories into a single array
const allStyles = [
  "Fraktur",
  "Bold Fraktur",
  "Script",
  "Negative Circled",
  "Decorated (Thai-like)",
  "Angular",
  "Calligraphy",
  "emoji symbols",
  "Mixed Fonts",
  "Negative Squared",
  "Glitch",
  "Circled",
  "Cyrillic_Style",
  "Math_Style",
  "Currency_Style",
  "Double-Struck",
  "Fullwidth",
  "Small Caps",
  "Cryptocurrency_Style",
  "CJK_Style",
  "Japanese_Style",
  "Subscript",
  "Superscript",
  "Strikethrough",
  "Underline",
  "Upside Down",
  "Regional Indicator",
  "Ornamental",
  "Thai_Style",
  "Greek_Style",
  "Armenian_Style",
  "Ethiopian_Style",
  "Georgian_Style",
  "Lao_Style",
  "Math_Bold",
  "Math_Bold_Sans",
  "Math_Italic",
  "Math_Bold_Italic",
  "Math_Monospace",
  "Square_Bracket",
  "Curly_Bracket",
  "Wavy",
  "Block_Style",
  "Regular",
  "Box_Style",
  "Glitch_Style",
  "Mixed_Style",
  "Block_Letters",
  "Cuneiform_Style",
  "Slash",
  "Double Underline",
  "Circle Above",
  "Heart",
  "Bridge Below",
  "Dot",
  "Wavethrough",
  "Square",
  "Encircled",
];

// Examples for initial display
const styleExamples = [
  '𝓣𝓱𝓲𝓼 𝓲𝓼 𝓯𝓪𝓷𝓬𝔂',
  '🅂🅃🅈🄻🄸🅂🄷',
  '𝙲𝚘𝚘𝚕 𝚃𝚎𝚡𝚝',
  'Ⓢⓣⓨⓛⓔ ⓟⓞⓟ',
  '𝔉𝔞𝔫𝔠𝔶 𝔖𝔠𝔯𝔦𝔭𝔱',
  '🅕🅐🅝🅒🅨 🅕🅞🅝🅣',
  '𝖌𝖔𝖙𝖍 𝖛𝖎𝖇𝖊𝖘',
  '🅼🅰🆁🅺🅴🆃🅸🅽🅶',
  '𝓟𝓻𝓮𝓽𝓽𝔂 𝓒𝓾𝓻𝓵𝓼',
  '🄲🄻🄰🅂🅂🅈 🄻🄾🄾🄺'
];

// Define an interface for the new database structure
interface FontStyle {
  style_id: number;
  "Font Style": string;
  [key: string]: any; // For all character columns (A-Z, a-z, 0-9)
}

interface Toast {
  id: string;
  title: string;
  description: string;
  variant?: string;
}

// Create a custom useToast hook
const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = "default" }: { title: string; description: string; variant?: string }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, variant };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, 3000);
  };

  return { 
    toast, 
    toasts, 
    dismissToast: (id: string) => setToasts(prevToasts => prevToasts.filter(t => t.id !== id)) 
  };
};

// Memoized StyleCard component to prevent unnecessary re-renders
const StyleCard = ({ style, transformedText, copyToClipboard, shareText }: { 
  style: string; 
  transformedText: string;
  copyToClipboard: (text: string) => void;
  shareText: (text: string) => void;
}) => {
  return (
    <Card className="p-4 border border-gray-200 hover:border-gray-400 transition-colors">
      <div className="flex justify-between flex-wrap items-center gap-2 mb-3">
        <p className="text-xl break-words whitespace-pre-wrap overflow-hidden w-full max-w-full">{transformedText}</p>

        <div className="flex justify-end flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(transformedText)}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => shareText(transformedText)}
            className="h-8 w-8 p-0"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <DialogTrigger asChild>
            <span className="text-3xl cursor-pointer">🎨</span>
          </DialogTrigger>
        </div>
      </div>
    </Card>
  );
};

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [styles, setStyles] = useState<FontStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast, toasts, dismissToast } = useToast();
  
  // Use a ref to track if we've loaded data to prevent duplicate fetches
  const dataFetched = useState(false);

  useEffect(() => {
    if (!dataFetched[0]) {
      fetchStyles();
      dataFetched[0] = true;
    }
  }, [dataFetched]);

  async function fetchStyles() {
    try {
      const { data, error } = await supabase
        .from('font_styles')
        .select('*');

      if (error) throw error;

      setStyles(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching styles:', error);
      setLoading(false);
    }
  }

  // Transform text function optimized to memoize results
  const transformTextCache = new Map();
  
  function transformText(text: string, styleName: string) {
    // Create a cache key
    const cacheKey = `${text}-${styleName}`;
    
    // Return cached result if available
    if (transformTextCache.has(cacheKey)) {
      return transformTextCache.get(cacheKey);
    }
    
    // Find the style object that matches the styleName
    const styleRow = styles.find(s => s["Font Style"].toLowerCase() === styleName.toLowerCase());

    if (!styleRow) return text; // Return original text if style not found

    const result = text.split('').map(char => {
      // Check if the character exists as a column in our style row
      if (styleRow[char]) {
        return styleRow[char];
      }
      return char; // Return the original character if no styled version exists
    }).join('');
    
    // Cache the result
    transformTextCache.set(cacheKey, result);
    return result;
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
    });
  }

  function shareText(text: string) {
    if (navigator.share) {
      navigator.share({
        title: 'Styled Text',
        text: text,
      }).catch(console.error);
    } else {
      copyToClipboard(text);
      toast({
        title: "Sharing not supported",
        description: "Text copied to clipboard instead",
      });
    }
  }

  const VariationsDialog = ({ style }: { style: string }) => {
    const transformedText = transformText(inputText, style);
    const themeEntries = Object.entries(emojiThemes);

    // Create the variations more efficiently
    const allVariations = themeEntries.flatMap(([theme, { prefix, suffix, extra }]) => {
      const border = aestheticBorders[theme as keyof typeof aestheticBorders];
      const borderleft = border.borderleft;
      const borderright = border.borderright;
      const symbols = border.symbols;
      
      return [
        {
          type: "Combined",
          theme,
          text: `${prefix} ${borderleft} ${symbols[1]} ${transformedText} ${symbols[1]} ${borderright} ${suffix}`
        },
        {
          type: "Emoji",
          theme,
          text: `${prefix} ${transformedText} ${suffix} ${extra}`
        },
        {
          type: "Border",
          theme,
          text: `${borderleft} ${transformedText} ${borderright}`
        },
        {
          type: "Symbol",
          theme,
          text: `${symbols[0]} ${transformedText} ${symbols[1]}`
        }
      ];
    });

    return (
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto bg-gradient-to-r from-indigo-100 to-purple-100">
        <DialogHeader>
          <DialogTitle className="capitalize text-2xl mb-4">
            {style.replace(/_/g, ' ')} Variations
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {allVariations.map((variation, index) => (
            <Card key={`${variation.type}-${variation.theme}-${index}`} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium capitalize text text-blue-700">{variation.theme} {variation.type}</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(variation.text)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareText(variation.text)}
                    className="h-6 w-6 p-0"
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-lg border-t pt-2 break-words whitespace-pre-wrap overflow-hidden w-full max-w-full">{variation.text}</p>
            </Card>
          ))}
        </div>
      </DialogContent>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100">
        <div className="animate-pulse text-2xl">Loading styles...</div>
      </div>
    );
  }

  // Check if the input has actual content (not just empty or whitespace)
  const hasInputText = inputText.trim().length > 0;

  // For virtualization of styles list
  const displayedStyles = hasInputText ? allStyles : [];

  return (
    <>
      <Head>
        <title>LushFonts | Cool & Aesthetic Text Generator for Social Media</title>
        <meta name="description" content="Generate fancy, stylish, and aesthetic fonts for Instagram, TikTok, Twitter bios & posts. Copy & paste cool text in seconds!" />
        <meta name="keywords" content="fancy fonts, font generator, instagram fonts, tiktok fonts, aesthetic text, social media fonts" />
        <meta property="og:title" content="LushFonts | Cool & Aesthetic Text Generator" />
        <meta property="og:description" content="Generate fancy fonts for Instagram, TikTok, Twitter bios & posts. Copy & paste cool text in seconds!" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Preload important resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Add preloads for critical CSS/JS if you have specific files */}
      </Head>
      <ToastProvider>
        <main className="min-h-screen py-10 px-2 pb-0 bg-gradient-to-r from-indigo-100 to-purple-100 text-foreground">
          <div className="container mx-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto mb-8 text-center">
              <Input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to transform..."
                className="text-xl p-6 border-input focus:border-primary focus:ring-2 focus:ring-accent"
                aria-label="Text to transform"
              />
            </div>

            {!hasInputText ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="text-5xl mb-4">✨📱✨</div>
                <h1 className="text-2xl md:text-3xl font-bold mb-4">LushFonts – Make Your Text Stand Out</h1>
                <p className="text-lg md:text-xl max-w-lg">
                  Enter some text above to transform it into fancy fonts for Instagram, TikTok, social media bios, and more!
                </p>
                <div className="flex py-10 px-6 flex-wrap gap-3 justify-center">
                  {styleExamples.map((style, idx) => (
                    <div
                      key={idx}
                      className="bg-white text-black px-4 py-2 rounded shadow text-xl hover:scale-105 transition-transform duration-200 cursor-pointer"
                    >
                      {style}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {displayedStyles.map((style) => {
                  const transformedText = transformText(inputText, style);
                  return (
                    <Dialog key={style}>
                      <StyleCard 
                        style={style} 
                        transformedText={transformedText} 
                        copyToClipboard={copyToClipboard} 
                        shareText={shareText} 
                      />
                      <VariationsDialog style={style} />
                    </Dialog>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {toasts.map(({ id, title, description, variant }) => (
          <Toast key={id} variant={variant} className="bg-gradient-to-r from-indigo-100 to-purple-100 text-foreground border border-border">
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription className="text-muted-foreground">{description}</ToastDescription>}
            </div>
            <ToastClose onClick={() => dismissToast(id)} className="text-foreground hover:text-foreground/80" />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
      
      {/* Lazy load non-critical components */}
      <Suspense fallback={<div className="h-10 w-full bg-gradient-to-r from-indigo-100 to-purple-100"></div>}>
        <FancyTextFAQ />
      </Suspense>
      <Suspense fallback={<div className="h-10 w-full bg-gradient-to-r from-indigo-100 to-purple-100"></div>}>
        <Footer />
      </Suspense>
    </>
  );
}