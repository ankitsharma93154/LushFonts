"use client";

import { useState, useEffect, lazy, Suspense, memo, useRef, useMemo, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { Analytics } from "@vercel/analytics/next"
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

const styleExamples = [
  '𝓣𝓱𝓲𝓼 𝓲𝓼 𝓯𝓪𝓷𝓬𝔂',
  'Ⓢⓣⓨⓛⓔ ⓟⓞⓟ',
  '𝔉𝔞𝔫𝔠𝔶 𝔖𝔠𝔯𝔦𝔭𝔱',
  '🅕🅐🅝🅒🅨 🅕🅞🅝🅣',
  '𝖌𝖔𝖙𝖍 𝖛𝖎𝖇𝖊𝖘',
  '𝓟𝓻𝓮𝓽𝓽𝔂 𝓒𝓾𝓻𝓵𝓼',
  '🄲🄻🄰🅂🅂🅈 🄻🄾🄾🄺'
];

const quickTemplates = [
  {
    label: 'Instagram Bio',
    description: 'Clean and cute profile intro',
    text: 'soft vibes only | dream in color',
  },
  {
    label: 'Discord Name',
    description: 'Stylish gamer-style identity',
    text: 'midnight lotus',
  },
  {
    label: 'TikTok Caption',
    description: 'Short hook with personality',
    text: 'main character energy today',
  },
  {
    label: 'Highlight Title',
    description: 'Aesthetic one-word category',
    text: 'weekend diary',
  },
  {
    label: 'Status Line',
    description: 'Mood line for social apps',
    text: 'offline but glowing',
  },
];

const getStyleBadge = (style: string) => {
  const normalized = style.toLowerCase();
  if (normalized.includes('script') || normalized.includes('calligraphy')) return 'Elegant';
  if (normalized.includes('fraktur') || normalized.includes('goth')) return 'Bold';
  if (normalized.includes('circled') || normalized.includes('negative')) return 'Trendy';
  if (normalized.includes('small') || normalized.includes('regular')) return 'Clean';
  if (normalized.includes('glitch') || normalized.includes('symbol')) return 'Edgy';
  return 'Popular';
};

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

// OPTIMIZATION 1: Extract Toast logic to a custom hook with controlled updates
const useToast = () => {
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  
  // Use useCallback for stable function references
  const toast = useCallback(({ title, description, variant = "default" }: { title: string; description: string; variant?: string }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(t => t.id !== id));
  }, []);

  return { toast, toasts, dismissToast };
};


// Create memoized VariationsDialog component with improved UI
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
  // State for style options - now with per-element theme selection
  const [options, setOptions] = useState({
    useBorder: true,
    useEmoji: true,
    useSymbol: true,
    borderTheme: "kawaii",
    emojiTheme: "kawaii",
    symbolTheme: "kawaii"
  });
  
  // State for selected overall theme (for UI display)
  const [selectedTheme, setSelectedTheme] = useState<string>("kawaii"); // Default theme
  
  // Generate the current preview text based on selected options
  const previewText = useMemo(() => {
    // Get theme elements from potentially different themes
    const borderThemeData = emojiThemes[options.borderTheme as keyof typeof emojiThemes];
    const emojiThemeData = emojiThemes[options.emojiTheme as keyof typeof emojiThemes];
    const symbolThemeData = emojiThemes[options.symbolTheme as keyof typeof emojiThemes];
    
    const borderElements = aestheticBorders[options.borderTheme as keyof typeof aestheticBorders];
    const symbolElements = aestheticBorders[options.symbolTheme as keyof typeof aestheticBorders];
    
    if (!borderThemeData || !emojiThemeData || !symbolThemeData || !borderElements || !symbolElements) {
      return transformedText;
    }
    
    // Extract specific elements from each theme
    const { borderleft, borderright } = borderElements;
    const symbols = symbolElements.symbols;
    const { prefix, suffix, extra } = emojiThemeData;
    
    let result = transformedText;
    
    // Apply symbol decoration if enabled
    if (options.useSymbol) {
      result = `${symbols[1]} ${result} ${symbols[1]}`;
    }
    
    // Apply border if enabled
    if (options.useBorder) {
      result = `${borderleft} ${result} ${borderright}`;
    }
    
    // Apply emoji if enabled
    if (options.useEmoji) {
      result = `${prefix} ${result} ${suffix}`;
      // Add extra emoji at the end if we have both symbol and emoji enabled
      if (options.useSymbol) {
        result = `${result} ${extra}`;
      }
    }
    
    return result;
  }, [transformedText, options]);
  
  // Function to handle random selection
  const handleRandom = () => {
    const themeKeys = Object.keys(emojiThemes);
    
    // Select potentially different themes for each element
    const borderTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    const emojiTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    const symbolTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    
    // Generate random boolean values for each option
    let newBorder = Math.random() > 0.5;
    let newEmoji = Math.random() > 0.5;
    let newSymbol = Math.random() > 0.5;
    
    // Ensure at least one option is selected
    if (!newBorder && !newEmoji && !newSymbol) {
      // If all are false, randomly choose one to be true
      const randomOption = Math.floor(Math.random() * 3);
      if (randomOption === 0) newBorder = true;
      else if (randomOption === 1) newEmoji = true;
      else newSymbol = true;
    }
    
    // Update options
    setOptions({
      useBorder: newBorder,
      useEmoji: newEmoji,
      useSymbol: newSymbol,
      borderTheme: borderTheme,
      emojiTheme: emojiTheme,
      symbolTheme: symbolTheme
    });
    
    // For UI display purposes, we still need to set a primary selected theme
    // Let's use the theme that corresponds to the first enabled option
    if (newBorder) setSelectedTheme(borderTheme);
    else if (newEmoji) setSelectedTheme(emojiTheme);
    else setSelectedTheme(symbolTheme);
  };

  // Toggle a specific option
  const toggleOption = (option: 'useBorder' | 'useEmoji' | 'useSymbol') => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  // Update theme for all elements
  const updateTheme = (theme: string) => {
    setSelectedTheme(theme);
    setOptions(prev => ({
      ...prev,
      borderTheme: theme,
      emojiTheme: theme,
      symbolTheme: theme
    }));
  };

  return (
    <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 bg-size-200 ">
      <DialogHeader>
        <DialogTitle className="capitalize text-2xl mb-4">
          {style.replace(/_/g, ' ')} Variations
        </DialogTitle>
      </DialogHeader>

      {/* Preview section styled like homepage */}
      <Card className="p-4 border border-gray-200 hover:border-gray-400 transition-colors mb-6">
        <div className="flex justify-between items-center gap-2 mb-3">
          <p className="text-xl break-words whitespace-pre-wrap overflow-hidden w-full max-w-full">{previewText}</p>

          <div className="flex justify-end items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(previewText)}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareText(previewText)}
              className="h-8 w-8 p-0"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Style options as toggle switches and random button */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <div className="flex-1 flex flex-wrap gap-2">
          <Button
            variant={options.useBorder ? "default" : "outline"}
            onClick={() => toggleOption('useBorder')}
            className="flex-1"
          >
            {options.useBorder ? "✓ Border" : "Border"}
          </Button>
          <Button
            variant={options.useEmoji ? "default" : "outline"}
            onClick={() => toggleOption('useEmoji')}
            className="flex-1"
          >
            {options.useEmoji ? "✓ Emoji" : "Emoji"}
          </Button>
          <Button
            variant={options.useSymbol ? "default" : "outline"}
            onClick={() => toggleOption('useSymbol')}
            className="flex-1"
          >
            {options.useSymbol ? "✓ Symbol" : "Symbol"}
          </Button>
        </div>
        <Button 
          onClick={handleRandom}
          variant="secondary"
          className="flex gap-1 items-center"
        >
          <span>Random</span>
          <span className="text-lg">🎲</span>
        </Button>
      </div>

      {/* Theme grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {Object.entries(emojiThemes).map(([theme, { prefix, suffix }]) => (
          <Button
            key={theme}
            variant={selectedTheme === theme ? "default" : "outline"}
            onClick={() => updateTheme(theme)}
            className="p-2 h-auto flex flex-col items-center"
            title={theme}
          >
           
            <span className="text-xl">{prefix} <span className="text-sm capitalize mb-1">{theme}</span>{suffix}</span>
          </Button>
        ))}
      </div>
    </DialogContent>
  );
});



// OPTIMIZATION 3: Improved StyleCard component with proper memoization
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
  // Separate handlers to avoid function recreation on each render
  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(transformedText);
  }, [copyToClipboard, transformedText]);
  
  const handleShare = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    shareText(transformedText);
  }, [shareText, transformedText]);
  
  const handleVariations = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClickVariations();
  }, [onClickVariations]);

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyWithFeedback = useCallback((e: React.MouseEvent) => {
    handleCopy(e);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1400);
  }, [handleCopy]);

  return (
    <Card className="p-4 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold tracking-wide uppercase text-indigo-700 bg-indigo-100/80 px-2 py-1 rounded-full">
          {getStyleBadge(style)}
        </span>
        {isCopied && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full animate-pulse">
            Copied
          </span>
        )}
      </div>
      <div className="flex justify-between items-center gap-2 mb-3">
        <p className="text-xl break-words whitespace-pre-wrap overflow-hidden w-full max-w-full">{transformedText}</p>
        <div className="flex justify-end items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyWithFeedback}
          className="h-8 w-8 p-0"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="h-8 w-8 p-0"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <span 
          className="text-3xl cursor-pointer" 
          onClick={handleVariations}
        >
          🎨
        </span>
        </div>
      </div>
    </Card>
  );
});

// OPTIMIZATION 4: Create a virtualized list component for better rendering
const VirtualizedStyleList = memo(({ 
  styles, 
  inputText, 
  transformText, 
  copyToClipboard, 
  shareText, 
  openDialogStyle, 
  setOpenDialogStyle 
}: {
  styles: string[];
  inputText: string;
  transformText: (text: string, style: string) => string;
  copyToClipboard: (text: string) => void;
  shareText: (text: string) => void;
  openDialogStyle: string | null;
  setOpenDialogStyle: (style: string | null) => void;
}) => {
  // Only render a limited number of items initially
  const [visibleCount, setVisibleCount] = useState(9); // Start with 9 items (3x3 grid)
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Load more items when scrolling near the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < styles.length) {
          setVisibleCount(prev => Math.min(prev + 6, styles.length));
        }
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [styles.length, visibleCount]);
  
  // Only render the visible items
  const visibleStyles = styles.slice(0, visibleCount);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {visibleStyles.map((style) => {
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
      
      {/* Loading trigger element */}
      {visibleCount < styles.length && (
        <div ref={containerRef} className="h-4 col-span-full" />
      )}
      
    </div>
  );
});

// OPTIMIZATION 6: Main component with better resource management
export default function Home() {
  // Set default input text to "welcome!"
  const [inputText, setInputText] = useState("");
  const [styles, setStyles] = useState<FontStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedAllStyles, setLoadedAllStyles] = useState(false);
  const { toast, toasts, dismissToast } = useToast();
  const allowedVariants = ['default', 'destructive'];
  
  const [openDialogStyle, setOpenDialogStyle] = useState<string | null>(null);
  
  // OPTIMIZATION 7: Better cache with size limits to prevent memory leaks
  const transformTextCacheRef = useRef(new Map());
  const MAX_CACHE_SIZE = 1000; // Limit cache size
  
  const hasInitializedRef = useRef(false);
  
  // OPTIMIZATION 8: Smarter data fetching
  useEffect(() => {
    if (!hasInitializedRef.current) {
      fetchStyles();
      hasInitializedRef.current = true;
      // Always load all styles since we now have default text
      setLoadedAllStyles(true);
    }
    
    // Clean up the cache when component unmounts to prevent memory leaks
    return () => {
      transformTextCacheRef.current.clear();
    };
  }, []);

  // OPTIMIZATION 9: Better error handling for data fetching
  const fetchStyles = useCallback(async () => {
    try {
      const data = await fetchFontStyles();
      if (data) {
        setStyles(data);
      } else {
        // Handle empty data case
        toast({
          title: "Warning",
          description: "Could not load font styles. Some features may be limited.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching styles:', error);
      toast({
        title: "Error",
        description: "Failed to load font styles. Please try refreshing.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  // OPTIMIZATION 10: Improved transform function with better memoization and cache management
  const transformText = useCallback((text: string, styleName: string) => {
    // Don't process empty text
    if (!text) return "";
    
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
    
    // Manage cache size
    if (transformTextCacheRef.current.size >= MAX_CACHE_SIZE) {
      // Delete oldest entry (first key in Map)
      const firstKey = transformTextCacheRef.current.keys().next().value;
      transformTextCacheRef.current.delete(firstKey);
    }
    
    // Cache the result
    transformTextCacheRef.current.set(cacheKey, result);
    return result;
  }, [styles]);
  
  // OPTIMIZATION 11: Stable function references with useCallback
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
    });
  }, [toast]);
  
  const shareText = useCallback((text: string) => {
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
  }, [copyToClipboard, toast]);

  const applyTemplate = useCallback((template: string) => {
    setInputText(template);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // OPTIMIZATION 12: Better loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 bg-size-200">
        <div className="text-2xl font-bold">Loading styles...</div>
      </div>
    );
  }
  
  // OPTIMIZATION 13: Smart style list management - now we always show styles
  const displayedStyles = loadedAllStyles 
    ? [...commonStyles, ...additionalStyles]
    : commonStyles;
  
  // OPTIMIZATION 14: Debounced input handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
  };
  
  return (
    <>
      <ToastProvider>
        <Analytics />
        
        {/* OPTIMIZATION 2: Use a gradient background with animation */}
        <main className="relative overflow-hidden bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 bg-size-200 animate-gradient-slow flex flex-col items-center justify-start p-6"
>
          <div className="pointer-events-none absolute -top-28 -left-20 h-64 w-64 rounded-full bg-pink-400/30 blur-3xl animate-pulse" />
          <div className="pointer-events-none absolute top-20 -right-20 h-72 w-72 rounded-full bg-indigo-400/30 blur-3xl animate-pulse" />
          <div className="pointer-events-none absolute top-80 left-1/3 h-56 w-56 rounded-full bg-purple-400/20 blur-3xl animate-pulse" />

          <div className="container mx-auto p-2 md:p-6 relative z-10">
            <div className="max-w-4xl mx-auto mb-10 text-center">
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-center drop-shadow-md mb-4 animate-fade-in pb-5">Aesthetic Font Generator Keyboard</h1>
              <p className="text-slate-900 text-base sm:text-lg mb-6 leading-relaxed bg-white rounded-xl px-4 py-3 shadow-lg border-2 border-purple-300">
                Type with your normal keyboard, convert text into cool aesthetic fonts, and copy and paste in one click.
                {' '}Jump to <a href="#aesthetic-text-styles" className="font-semibold text-indigo-700 hover:text-pink-600 transition-colors">styles</a>, <a href="#aesthetic-text-layout" className="font-semibold text-indigo-700 hover:text-pink-600 transition-colors">layouts</a>, or <a href="#aesthetic-text-templates" className="font-semibold text-indigo-700 hover:text-pink-600 transition-colors">templates</a>.
              </p>
              <Input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter text to transform..."
                className="text-xl p-6 border-input focus:border-primary focus:ring-2 focus:ring-accent"
                aria-label="Text to transform"
              />
            </div>

        {inputText &&
              <VirtualizedStyleList 
                styles={displayedStyles}
                inputText={inputText}
                transformText={transformText}
                copyToClipboard={copyToClipboard}
                shareText={shareText}
                openDialogStyle={openDialogStyle}
                setOpenDialogStyle={setOpenDialogStyle}
              />
          }

          
<div className="flex py-6 px-4 mx-auto my-5 flex-wrap gap-5 justify-center sm:max-w-[900px]">
  {styleExamples.map((style, idx) => (
    <div
      key={idx}
      className="bg-white text-slate-900 border border-purple-200
             text-base sm:text-lg md:text-xl
             px-3 py-1.5 sm:px-5 sm:py-2 md:px-5 md:py-2.5
             rounded-lg shadow-sm transition-all duration-200"
    >
      {style}
    </div>
  ))}
</div>

<section className="max-w-4xl mx-auto mt-12 bg-white/95 rounded-2xl p-6 sm:p-8 shadow-xl border border-purple-200" id="aesthetic-text-styles">
  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-2xl sm:text-3xl font-extrabold mb-4">Aesthetic Text Styles Library</h2>
  <p className="text-slate-700 mb-4 text-base sm:text-lg leading-relaxed">
    Explore aesthetic text styles for bios, usernames, captions, and chats. This generator includes script, gothic,
    minimal, and decorative Unicode styles that are easy to copy and paste.
  </p>
  <h3 className="text-xl font-bold mb-2 text-indigo-700">Popular style categories</h3>
  <ul className="list-disc pl-6 text-slate-700 space-y-1 marker:text-pink-500">
    <li>Script and calligraphy for elegant bios</li>
    <li>Bold and gothic styles for standout names</li>
    <li>Minimal styles for clean profile text</li>
    <li>Decorative styles for highlights and captions</li>
  </ul>
</section>

<section className="max-w-4xl mx-auto mt-8 bg-white/95 rounded-2xl p-6 sm:p-8 shadow-xl border border-purple-200" id="aesthetic-text-layout">
  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-2xl sm:text-3xl font-extrabold mb-4">Aesthetic Text Layout Generator</h2>
  <p className="text-slate-700 mb-4 text-base sm:text-lg leading-relaxed">
    Build aesthetic text layouts with line breaks, symbols, and spacing. Use these layouts for Instagram bios,
    highlight names, and caption openers.
  </p>
  <h3 className="text-xl font-bold mb-2 text-indigo-700">Quick layout ideas</h3>
  <ul className="list-disc pl-6 text-slate-700 space-y-1 marker:text-pink-500">
    <li>Soft bio layout: symbol + name + short mood line</li>
    <li>Highlight title layout: one word + decorative border</li>
    <li>Caption opener layout: style line + call to action</li>
  </ul>
</section>

<section className="max-w-4xl mx-auto mt-8 bg-white/95 rounded-2xl p-6 sm:p-8 shadow-xl border border-purple-200" id="aesthetic-text-templates">
  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-2xl sm:text-3xl font-extrabold mb-4">Aesthetic Text Templates and Keyboard Tips</h2>
  <p className="text-slate-700 mb-4 text-base sm:text-lg leading-relaxed">
    Use these ready-to-copy templates and keyboard workflow tips to publish stylish text faster on iPhone, Android,
    Instagram, TikTok, Discord, and WhatsApp.
  </p>
  <h3 className="text-xl font-bold mb-2 text-indigo-700">How to use with your keyboard</h3>
  <ol className="list-decimal pl-6 text-slate-700 space-y-1 marker:text-pink-500">
    <li>Type normal text in the generator input.</li>
    <li>Pick a style that is readable on your target platform.</li>
    <li>Copy and paste into your bio, username, caption, or message.</li>
  </ol>

  <div className="mt-6">
    <h3 className="text-xl font-bold mb-3 text-indigo-700">Swipe and apply quick templates</h3>
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
      {quickTemplates.map((template) => (
        <Card
          key={template.label}
          className="min-w-[260px] sm:min-w-[300px] snap-start bg-white border border-purple-200 shadow-md hover:shadow-xl transition-shadow"
        >
          <div className="p-4">
            <p className="text-xs uppercase tracking-wide font-bold text-pink-600 mb-1">{template.label}</p>
            <p className="text-sm text-slate-600 mb-3">{template.description}</p>
            <p className="text-lg font-semibold text-slate-800 mb-4">{template.text}</p>
            <Button
              onClick={() => applyTemplate(template.text)}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:opacity-90"
            >
              Apply Template
            </Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
</section>


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
      
      {/* OPTIMIZATION 15: Smarter lazy loading */}
      <Suspense fallback={<div className="h-16 bg-gradient-to-r from-indigo-100 to-purple-100"></div>}>
        {<FancyTextFAQ />}
      </Suspense>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}