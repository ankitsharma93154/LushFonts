"use client";

import { useState, useEffect, lazy, Suspense, memo, useRef, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";

// Lazy load non-critical components with specific loading boundaries
const FancyTextFAQ = lazy(() => import("@/components/ui/faqs"));
const Footer = lazy(() => import("@/components/ui/footer"));

// Move Supabase initialization to a separate module to avoid WebLocks
import { fetchFontStyles } from "@/lib/supabase";

// Create a lightweight Supabase client to avoid the heavy WebLock issue
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pwxejnelixbqnuwovqvp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Pre-compute theme data instead of recalculating during render
const emojiThemes = {
  kawaii: { prefix: "🌺", suffix: "✿", extra: "🧸" },     
  dark: { prefix: "🕷️", suffix: "☾", extra: "⛓️" },    
  cyberpunk: { prefix: "⚡", suffix: "🤖", extra: "💻" }, 
  gaming: { prefix: "🎯", suffix: "🎲", extra: "🎪" },    
  nature: { prefix: "🌱", suffix: "🌻", extra: "🌺" },   
  space: { prefix: "🪐", suffix: "👽", extra: "🌌" },     
  magic: { prefix: "🧙", suffix: "🪄", extra: "⭐" },    
  ocean: { prefix: "🐬", suffix: "🐋", extra: "🐙" },   
  royal: { prefix: "🏛️", suffix: "💫", extra: "🔱" },     
  love: { prefix: "💖", suffix: "💝", extra: "🌹" },       
  vintage: { prefix: "📻", suffix: "🧵", extra: "🎭" },   
  celestial: { prefix: "🌌", suffix: "☄️", extra: "🌜" }, 
  geometric: { prefix: "◼️", suffix: "◻️", extra: "◾" },  
  steampunk: { prefix: "🧭", suffix: "📐", extra: "🗝️" },  
  fantasy: { prefix: "🧝", suffix: "🧚", extra: "🏰" },    
  vaporwave: { prefix: "🌴", suffix: "📺", extra: "📼" }, 
  cottagecore: { prefix: "🍂", suffix: "🌼", extra: "🍯" }, 
  techno: { prefix: "🔊", suffix: "📱", extra: "💾" },     
  minimalist: { prefix: "·", suffix: "○", extra: "□" },    
  gothic: { prefix: "🦇", suffix: "📿", extra: "🕯️" }      
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
  },

  vintage: {
    borderleft: "❈┈┈┈┈ ",
    borderright: " ┈┈┈┈❈",
    symbols: ["🕰️", "📜", "🪶"]
  },
  celestial: {
    borderleft: "✧･ﾟ: ",
    borderright: " :･ﾟ✧",
    symbols: [ "⋆","✮", "✫"]
  },
  geometric: {
    borderleft: "◢◤ ",
    borderright: " ◥◣",
    symbols: ["◆", "⬢", "⌬"]
  },
  steampunk: {
    borderleft: "╔═♜═╗ ",
    borderright: " ╚═♜═╝",
    symbols: ["⚙️", "⌚", "🔩"]
  },
  fantasy: {
    borderleft: "⚜️✧✦✧✦ ",
    borderright: " ✦✧✦✧⚜️",
    symbols: ["🐉", "🗡️", "🛡️"]
  },
  vaporwave: {
    borderleft: "░▒▓█ ",
    borderright: " █▓▒░",
    symbols: ["💾", "🏙️", "🌊"]
  },
  cottagecore: {
    borderleft: "⊰❁⊱ ",
    borderright: " ⊰❁⊱",
    symbols: [ "🧺", "🦋", "🌲"]
  },
  techno: {
    borderleft: "█▓▒░ ",
    borderright: " ░▒▓█",
    symbols: [ "⌁", "📡", "🤖"]
  },
  minimalist: {
    borderleft: "┌─── ",
    borderright: " ───┐",
    symbols: [ "■", "▫", "▬"]
  },
  gothic: {
    borderleft: "†┈┈┈ ",
    borderright: " ┈┈┈†",
    symbols: [ "🗝️", "🥀", "🕸️"]
  }
};

// Only loading the most commonly used styles initially to reduce bundle size
const commonStyles = [
"Script,Calligraphy",
"Negative Circled",
"emoji symbols",
"Bold Fraktur",
"Encircled",
"Coptic_Style",
"Runic_Style",
];

// Rest of the styles that will be loaded on demand
const additionalStyles = [
  "Script",
  "Circled",
  "Double-Struck",
  "Fraktur",
  "Decorated (Thai-like)",
  "Angular",
  "Calligraphy",
  "Mixed Fonts",
  "Negative Squared",
  "Glitch",
  "Cyrillic_Style",
  "Math_Style",
  "Currency_Style",
  "Fullwidth",
  "Cryptocurrency_Style",
  "CJK_Style",
  "Japanese_Style",
  "Small Caps",
  "Strikethrough",
  "Upside Down",
  "Subscript",
  "Superscript",
  "Underline",
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
  "Phonetic_Style",
  "Greek_Style",
  "Mixed_Fonts",
  "Symbol_Style",
  
];

// Precomputed examples for faster initial render
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

interface ToastInfo {
  id: string;
  title: string;
  description: string;
  variant?: string;
}

// Create a custom useToast hook with optimized rendering
const useToast = () => {
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const toast = ({ title, description, variant = "default" }: { title: string; description: string; variant?: string }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }]);

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

// Create memoized VariationsDialog component with optimized rendering
const VariationsDialog = memo(({ 
  style, 
  inputText, 
  transformedText,
  copyToClipboard, 
  shareText 
}: { 
  style: string;
  inputText: string;
  transformedText: string;
  copyToClipboard: (text: string) => void;
  shareText: (text: string) => void;
}) => {
  // Generate variations once using useMemo
  const variations = useMemo(() => {
    const themeEntries = Object.entries(emojiThemes);
    
    return themeEntries.flatMap(([theme, { prefix, suffix, extra }]) => {
      const border = aestheticBorders[theme as keyof typeof aestheticBorders];
      const borderleft = border.borderleft;
      const borderright = border.borderright;
      const symbols = border.symbols;
      
      return [
        {
          type: "Combined",
          theme,
          text: `${prefix} ${borderleft} ${symbols[0]} ${transformedText} ${symbols[0]} ${borderright} ${suffix}`
        },
        {
          type: "Emoji",
          theme,
          text: `${prefix}${suffix} ${transformedText} ${suffix}${prefix} ${extra}`
        },
        {
          type: "Border",
          theme,
          text: `${borderleft} ${transformedText} ${borderright}`
        },
        {
          type: "Symbol",
          theme,
          text: `${symbols[2]}${symbols[1]} ${transformedText} ${symbols[1]}${symbols[2]}`
        }
      ];
    });
  }, [transformedText]);

  return (
    <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto bg-gradient-to-r from-indigo-100 to-purple-100">
      <DialogHeader>
        <DialogTitle className="capitalize text-2xl mb-4">
          {style.replace(/_/g, ' ')} Variations
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        {variations.map((variation, index) => (
          <Card key={`${variation.type}-${variation.theme}-${index}`} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium capitalize text text-blue-700">{variation.theme} {variation.type}</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(variation.text);
                  }}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    shareText(variation.text);
                  }}
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
});

// Optimized StyleCard component
const StyleCard = memo(({ 
  style, 
  transformedText, 
  copyToClipboard, 
  shareText,
  onClickVariations
}: { 
  style: string; 
  transformedText: string;
  copyToClipboard: (text: string) => void;
  shareText: (text: string) => void;
  onClickVariations: () => void;
}) => {
  return (
    <Card className="p-4 border border-gray-200 hover:border-gray-400 transition-colors">
      <div className="flex justify-between flex-wrap items-center gap-2 mb-3">
        <p className="text-xl break-words whitespace-pre-wrap overflow-hidden w-full max-w-full">{transformedText}</p>

        <div className="flex justify-end flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(transformedText);
            }}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              shareText(transformedText);
            }}
            className="h-8 w-8 p-0"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <span 
            className="text-3xl cursor-pointer" 
            onClick={(e) => {
              e.stopPropagation();
              onClickVariations();
            }}
          >
            🎨
          </span>
        </div>
      </div>
    </Card>
  );
});

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [styles, setStyles] = useState<FontStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedAllStyles, setLoadedAllStyles] = useState(false);
  const { toast, toasts, dismissToast } = useToast();
  const allowedVariants = ['default', 'destructive'];
  
  // Use state to track which dialog is open
  const [openDialogStyle, setOpenDialogStyle] = useState<string | null>(null);
  
  // Transform text cache using an actual Map for better performance
  const transformTextCacheRef = useRef(new Map());

  // Add a reference to check if we've already fetched data
  const hasInitializedRef = useRef(false);

  // Prioritize loading critical styles first
  useEffect(() => {
    if (!hasInitializedRef.current) {
      fetchStyles();
      hasInitializedRef.current = true;
    }
  }, []);

  // Load additional styles only when user starts typing
  useEffect(() => {
    if (inputText.length > 0 && !loadedAllStyles) {
      setLoadedAllStyles(true);
    }
  }, [inputText, loadedAllStyles]);

  async function fetchStyles() {
    try {
      const data = await fetchFontStyles();
      setStyles(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching styles:', error);
      setLoading(false);
    }
  }

  // Transform text function with optimized caching
  const transformText = useMemo(() => {
    return (text: string, styleName: string) => {
      // Create a cache key
      const cacheKey = `${text}-${styleName}`;
      
      // Return cached result if available
      if (transformTextCacheRef.current.has(cacheKey)) {
        return transformTextCacheRef.current.get(cacheKey);
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
      transformTextCacheRef.current.set(cacheKey, result);
      return result;
    };
  }, [styles]);

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

  // Loading component optimized for First Contentful Paint
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100">
        <div className="text-2xl font-bold">Loading styles...</div>
      </div>
    );
  }

  // Check if the input has actual content (not just empty or whitespace)
  const hasInputText = inputText.trim().length > 0;

  // For better performance, only display styles when there's input
  const displayedStyles = hasInputText 
    ? loadedAllStyles 
      ? [...commonStyles, ...additionalStyles] 
      : commonStyles
    : [];

  return (
    <>
      <ToastProvider>
        <main className="min-h-screen py-10 px-2 pb-0 bg-gradient-to-r from-indigo-100 to-purple-100 text-foreground">
          <div className="container mx-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto mb-8 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 ">LushFonts - Fancy Text Generator</h1>
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
              <div className="flex flex-col items-center justify-center md:py-10 text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-4">✨📱✨</div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">Make Your Text Stand Out</h2>
                <p className="text-base sm:text-lg md:text-xl max-w-lg" font-display="swap">
                Transform text into fancy fonts for Instagram, TikTok, social media bios, and more!
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
                  const isDialogOpen = openDialogStyle === style;
                  
                  return (
                    <div key={style}>
                      <StyleCard 
                        style={style} 
                        transformedText={transformedText} 
                        copyToClipboard={copyToClipboard} 
                        shareText={shareText}
                        onClickVariations={() => setOpenDialogStyle(style)}
                      />
                      
                      {isDialogOpen && (
                        <Dialog 
                          open={isDialogOpen} 
                          onOpenChange={(open) => {
                            if (!open) setOpenDialogStyle(null);
                          }}
                        >
                          <VariationsDialog 
                            style={style}
                            inputText={inputText}
                            transformedText={transformedText}
                            copyToClipboard={copyToClipboard}
                            shareText={shareText}
                          />
                        </Dialog>
                      )}
                    </div>
                  );
                })}
                
                {!loadedAllStyles && (
                  <div className="col-span-full text-center py-4">
                    <Button onClick={() => setLoadedAllStyles(true)}>
                      Load More Styles
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {toasts.map(({ id, title, description, variant }) => (
          <Toast
            key={id}
            variant={allowedVariants.includes(variant ?? '') ? (variant as 'default' | 'destructive') : undefined}
            className="bg-gradient-to-r from-indigo-100 to-purple-100 text-foreground border border-border"
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription className="text-muted-foreground">{description}</ToastDescription>}
            </div>
            <ToastClose onClick={() => dismissToast(id)} className="text-foreground hover:text-foreground/80" />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
      
      {/* Lazy load non-critical components with explicit height placeholders */}
      <Suspense fallback={<div className="h-24 w-full bg-gradient-to-r from-indigo-100 to-purple-100"></div>}>
        {hasInputText && <FancyTextFAQ />}
      </Suspense>
      <Suspense fallback={<div className="h-16 w-full bg-gradient-to-r from-indigo-100 to-purple-100"></div>}>
        <Footer />
      </Suspense>
    </>
  );
}