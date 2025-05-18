'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Bookmark, BookmarkCheck } from 'lucide-react';
import Head from 'next/head'; // If using Next.js




interface FAQItem {
  id: string;
  icon: string;
  question: string;
  answer: string;
  keywords: string[];
}

const FancyTextFAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
  
  const faqData = [
    {
      id: 'what-is',
      icon: '✨',
      question: 'What is a Fancy Text Generator?',
      answer: 'Our Fancy Text Generator transforms ordinary text into extraordinary stylized fonts using Unicode character sets. These aren\'t traditional fonts but special Unicode characters that maintain their style when copied and pasted across different platforms. Perfect for enhancing your Instagram bio, TikTok captions, Twitter posts, Facebook updates, Discord messages, and virtually anywhere text can be displayed online!',
      keywords: ['generator', 'unicode', 'copy paste', 'instagram', 'tiktok', 'social media']
    },
    {
      id: 'how-works',
      icon: '🔤',
      question: 'How Do Fancy Text Fonts Work?',
      answer: 'While your keyboard displays only about 100 standard characters, Unicode actually contains tens of thousands of characters from various writing systems worldwide. Our generator leverages these extensive character sets that resemble standard Latin letters but with different styles—mathematically bold, script, gothic, cursive, and many more. When you type normal text, we instantly convert each character to its stylistic equivalent across multiple font variations.',
      keywords: ['unicode', 'character sets', 'keyboard', 'conversion', 'latin letters']
    },
    {
      id: 'why-use',
      icon: '🌟',
      question: 'Why Use Stylized Text?',
      answer: 'Stylized text helps your content stand out in crowded social feeds! Use it to highlight important points in your posts, create attention-grabbing headlines, design a unique social media aesthetic, express your personality through typography, make your username or bio instantly recognizable, and create trending text symbols for challenges and trends.',
      keywords: ['stand out', 'highlights', 'aesthetic', 'personality', 'trends', 'attention-grabbing']
    },
    {
      id: 'where-use',
      icon: '📱',
      question: 'Where Can I Use These Fancy Fonts?',
      answer: 'Our fancy text works practically everywhere online: Social Media (Instagram, TikTok, Twitter, Facebook, Pinterest, Snapchat), Messaging Apps (WhatsApp, Telegram, Discord, WeChat, Messenger), Content Platforms (YouTube comments, Reddit posts, Tumblr blogs), Professional Networks (LinkedIn with moderation), and Gaming Platforms (Steam profiles, game chats, Twitch). Some platforms may restrict certain Unicode characters, but with our wide selection, you\'ll always find styles that work for your specific needs.',
      keywords: ['instagram', 'tiktok', 'social media', 'messaging', 'youtube', 'discord', 'whatsapp', 'platforms']
    },
    {
      id: 'are-fonts',
      icon: '🔠',
      question: 'Are These Actually "Fonts"?',
      answer: 'Technically speaking, these aren\'t traditional fonts but alternative Unicode characters. Traditional fonts apply styling to standard characters without changing the underlying character code. When you copy regular bold text from a word processor, the boldness doesn\'t transfer to platforms that don\'t support formatting. Our fancy text generator creates text using completely different Unicode characters that visually resemble standard letters but with built-in styling. For example, "𝓮" and "e" are different characters entirely—like "S" and "5"—which is why the style persists when copied anywhere.',
      keywords: ['unicode', 'characters', 'styling', 'copy', 'persistence', 'technical']
    },
    {
      id: 'character-convert',
      icon: '🔄',
      question: 'Will All Characters Convert Properly?',
      answer: 'Most basic Latin letters (A-Z, a-z), numbers (0-9), and common punctuation convert beautifully across multiple styles. However, some specialized characters, accents, or symbols may not have Unicode equivalents in every style. Our generator automatically shows which styles best support your specific text input.',
      keywords: ['conversion', 'support', 'latin', 'numbers', 'special characters', 'compatibility']
    },
    {
      id: 'boxes-issue',
      icon: '⬜',
      question: 'Why Do Some Fonts Appear as Boxes on Certain Devices?',
      answer: 'If you see empty boxes (□) or question marks (�), it means the device or platform doesn\'t support those specific Unicode characters. This typically happens on older operating systems, some mobile devices with limited font support, platforms that deliberately block certain Unicode ranges, or browsers that need updating. We offer multiple font options specifically to address compatibility issues—if one style doesn\'t display correctly, simply try another!',
      keywords: ['compatibility', 'boxes', 'devices', 'support', 'question marks', 'display issues']
    },
    {
      id: 'colors',
      icon: '🎨',
      question: 'Can I Add Colors to My Fancy Text?',
      answer: 'Most social platforms don\'t support colored text through Unicode. While our generator creates stylish effects with borders, symbols, and decorative elements, color formatting won\'t transfer when copying. This is a Unicode limitation rather than a restriction of our tool. However, some platforms like Discord support markdown formatting that allows limited color options in certain contexts.',
      keywords: ['colors', 'formatting', 'limitations', 'discord', 'markdown', 'decoration']
    },
    {
      id: 'difference',
      icon: '⭐',
      question: 'How Is Our Fancy Text Generator Different?',
      answer: 'Unlike basic Unicode converters, our tool offers more font variations (including rare and aesthetic styles not found elsewhere), text decorations (borders, symbols, special effects), smart previews (see exactly how your text will appear on different platforms), saving favorites (create and save your unique text combinations), trending styles (updated regularly with what\'s popular on social networks), custom spacing (adjust character spacing for perfect aesthetic formatting), and combination generator (mix multiple styles for truly unique text).',
      keywords: ['unique', 'features', 'decorations', 'favorites', 'trending', 'preview', 'combinations']
    },
    {
      id: 'privacy',
      icon: '🔒',
      question: 'Is My Text Private and Secure?',
      answer: 'Absolutely! Our text generator operates entirely within your browser—we never store, collect, or transmit your input text to any server. Your privacy matters to us, which is why we\'ve designed our tool to work completely client-side without requiring logins or personal information.',
      keywords: ['privacy', 'security', 'data', 'browser', 'client-side', 'collection']
    },
    {
      id: 'new-styles',
      icon: '🆕',
      question: 'How Often Do You Add New Styles?',
      answer: 'We regularly update our collection with new Unicode styles, decorative options, and trending text formats. We monitor social media trends and respond to user requests to ensure you always have access to the most current and popular text styles.',
      keywords: ['updates', 'new', 'trends', 'collection', 'styles', 'requests']
    },
    {
      id: 'seo',
      icon: '🔍',
      question: 'Do These Fancy Fonts Affect SEO or Searchability?',
      answer: 'While these fancy characters look stylish, they may impact how search engines interpret your content. For critical SEO text like website headings or blog titles, we recommend using standard characters. However, for social media where engagement matters more than search optimization, fancy text can significantly boost visibility through increased engagement.',
      keywords: ['seo', 'search', 'engagement', 'visibility', 'optimization', 'website']
    },
    {
      id: 'username',
      icon: '👤',
      question: 'Can I Use These Fonts for My Username or Password?',
      answer: 'While fancy text works great for display purposes, many websites restrict the characters allowed in usernames, passwords, and functional fields for security reasons. These fonts work best for display text like bios, posts, and comments rather than login credentials.',
      keywords: ['username', 'password', 'restrictions', 'security', 'login', 'credentials']
    },
    {
      id: 'help',
      icon: '💬',
      question: 'Need Help or Have Suggestions?',
      answer: 'We\'re constantly improving our Fancy Text Generator based on your feedback! If you have questions, encounter issues, or want to request new features or styles, please reach out through our contact form. We love hearing from our users and implementing your creative ideas!',
      keywords: ['help', 'support', 'feedback', 'contact', 'suggestions', 'improvements']
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqData.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  useEffect(() => {
    const savedFavorites = localStorage.getItem('faqFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites) as string[]);
    }
    
    setFilteredFaqs(faqData);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = faqData.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredFaqs(filtered);
    } else {
      setFilteredFaqs(faqData);
    }
  }, [searchTerm]);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(item => item !== id)
      : [...favorites, id];
    
    setFavorites(newFavorites);
    localStorage.setItem('faqFavorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <section className=" bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 bg-size-200 animate-gradient-slow flex flex-col items-center justify-start p-6">
      <Head>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
  />
</Head>
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-center drop-shadow-md mb-10 animate-fade-in pb-5">
            FAQs
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Everything you need to know about creating stylish Unicode text
          </p>
          
          <div className="relative max-w-lg mx-auto mb-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search FAQ questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">No FAQ items match your search. Try different keywords.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div 
                key={faq.id} 
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md ${
                  isFavorite(faq.id) ? 'ring-2 ring-indigo-400' : ''
                }`}
              >
                <div className="flex items-center">
                  <button
                    className="flex-grow px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={activeIndex === index}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-4">{faq.icon}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    </div>
                    <span>
                      {activeIndex === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => toggleFavorite(faq.id)}
                    className="px-4 py-5 text-gray-600 hover:text-indigo-600 focus:outline-none"
                    aria-label={isFavorite(faq.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite(faq.id) ? (
                      <BookmarkCheck className="h-5 w-5 text-indigo-600" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <div 
                  id={`faq-answer-${faq.id}`}
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    activeIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                  }`}
                >
                  <div className="prose max-w-none text-gray-600">
                    <p>{faq.answer}</p>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {faq.keywords.map(keyword => (
                      <span 
                        key={keyword} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        onClick={() => setSearchTerm(keyword)}
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FancyTextFAQ;