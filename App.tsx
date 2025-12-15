import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import { Recipe, SavedRecipe, RecipeStatus, RecipeSummary, SolarTermInfo, SoulDishAnalysis } from './types';
import * as GeminiService from './services/geminiService';
import RecipeCard from './components/RecipeCard';
import { Search, Loader2, Sparkles, MapPin, User, ChevronRight, Leaf, Trash2, BookHeart, Clock, ChefHat, Utensils, BookOpen, UserCircle, Share2, LogIn, Award, Calendar, Coffee, Sun, Moon, UtensilsCrossed, Trophy, Bookmark } from 'lucide-react';

// --- Page Components ---

// 1. Soul Dish (Home)
const SoulDishPage = () => {
  const [name, setName] = useState('');
  const [hometown, setHometown] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SoulDishAnalysis | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !hometown) return;
    setLoading(true);
    try {
      const data = await GeminiService.analyzeSoulDish(name, hometown);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('AI 正在冥想，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-24 px-4">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold text-china-red mb-3 tracking-widest">寻味厨房</h1>
            <p className="text-gray-500 font-serif">一食一味，皆是修行</p>
        </div>

        {!result ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 animate-fade-in">
                <h2 className="text-2xl font-serif text-center mb-6">寻找你的本命菜</h2>
                <form onSubmit={handleAnalyze} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">你的名字</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-300" size={20} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-china-red focus:border-transparent outline-none bg-stone-50"
                                placeholder="例如：李逍遥"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">你的籍贯</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-300" size={20} />
                            <input
                                type="text"
                                value={hometown}
                                onChange={(e) => setHometown(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-china-red focus:border-transparent outline-none bg-stone-50"
                                placeholder="例如：江苏苏州"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !name || !hometown}
                        className="w-full bg-china-red text-white py-3 rounded-lg font-bold hover:bg-red-800 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-md"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                        {loading ? '探寻中...' : '开始探寻'}
                    </button>
                </form>
            </div>
        ) : (
            <div className="bg-white rounded-2xl shadow-lg border-t-4 border-china-red animate-fade-in relative overflow-hidden">
                {result.imageUrl && (
                    <div className="h-48 w-full overflow-hidden">
                        <img src={result.imageUrl} alt={result.dishName} className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="p-8 relative z-10">
                    <button onClick={() => setResult(null)} className="text-sm text-gray-400 mb-4 hover:text-china-red flex items-center gap-1">
                        <ChevronRight size={16} className="rotate-180" /> 再测一次
                    </button>
                    <div className="text-center mb-8">
                        <span className="text-stone-400 text-xs tracking-[0.2em] uppercase">YOUR SOUL DISH</span>
                        <h2 className="text-4xl font-serif font-bold text-ink-black mt-2 mb-4">{result.dishName}</h2>
                        <div className="inline-block p-6 bg-rice-paper rounded-lg border border-stone-200 italic font-serif text-gray-700 w-full relative">
                            <span className="absolute top-2 left-2 text-4xl text-stone-200 font-serif">“</span>
                            {result.poem.split('\n').map((line, i) => <div key={i} className="leading-loose">{line}</div>)}
                            <span className="absolute bottom-[-10px] right-4 text-4xl text-stone-200 font-serif">”</span>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="bg-stone-50 p-4 rounded-lg">
                            <h3 className="font-bold text-china-red mb-2 text-sm uppercase tracking-wider flex items-center gap-2"><User size={16}/> 缘起性格</h3>
                            <p className="text-gray-700 leading-relaxed text-sm">{result.personalityAnalysis}</p>
                        </div>
                        <div className="bg-stone-50 p-4 rounded-lg">
                            <h3 className="font-bold text-china-red mb-2 text-sm uppercase tracking-wider flex items-center gap-2"><MapPin size={16}/> 乡土连接</h3>
                            <p className="text-gray-700 leading-relaxed text-sm">{result.hometownConnection}</p>
                        </div>
                        <div className="bg-stone-50 p-4 rounded-lg">
                             <h3 className="font-bold text-china-red mb-2 text-sm uppercase tracking-wider flex items-center gap-2"><Utensils size={16}/> 风味解读</h3>
                             <p className="text-gray-700 leading-relaxed text-sm">{result.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

// 2. Solar Term
const SolarPage = ({ saveRecipe }: { saveRecipe: (r: Recipe, s: RecipeStatus) => void }) => {
    const [info, setInfo] = useState<SolarTermInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [listImages, setListImages] = useState<Record<string, string>>({});
    // For inline expanding: map dish name to Recipe object
    const [expandedDish, setExpandedDish] = useState<string | null>(null);
    const [details, setDetails] = useState<Record<string, Recipe | null>>({});
    const [loadingDetail, setLoadingDetail] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        GeminiService.getSolarTermRecommendations().then(async (data) => {
            if(!mounted) return;
            setInfo(data);
            setLoading(false);
            
            // Lazy load images
            for (const dish of data.recommendedDishes) {
                if(!mounted) break;
                GeminiService.generateImage(dish.name).then(url => {
                    if (mounted && url) {
                        setListImages(prev => ({...prev, [dish.name]: url}));
                    }
                });
            }
        });
        return () => { mounted = false; };
    }, []);

    const toggleDetail = async (dishName: string) => {
        if (expandedDish === dishName) {
            setExpandedDish(null);
            return;
        }
        setExpandedDish(dishName);

        if (!details[dishName]) {
            setLoadingDetail(dishName);
            try {
                const recipe = await GeminiService.generateRecipeByName(dishName);
                setDetails(prev => ({...prev, [dishName]: recipe}));
            } catch(e) { console.error(e); }
            finally { setLoadingDetail(null); }
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center flex-col"><Loader2 className="animate-spin text-china-red mb-4" size={32} /><span className="text-gray-400 font-serif">正在推算时令...</span></div>;

    const meals = [
        { label: '早餐晨食', icon: Coffee },
        { label: '午餐正食', icon: Sun },
        { label: '晚餐暮食', icon: Moon },
    ];

    return (
        <div className="max-w-2xl mx-auto pt-6 pb-24 px-4">
             {info && (
                 <>
                    <div className="bg-gradient-to-br from-stone-100 to-white p-8 rounded-2xl shadow-md border border-stone-200 text-center mb-8 relative overflow-hidden group">
                        <Leaf className="absolute -top-4 -right-4 text-green-100 w-40 h-40 rotate-12 transition-transform group-hover:rotate-45 duration-700" />
                        <span className="inline-block px-4 py-1.5 bg-china-red text-white text-xs rounded-full tracking-widest mb-4 shadow-sm">节气</span>
                        <h1 className="text-5xl font-serif font-bold text-ink-black mb-2">{info.termName}</h1>
                        <p className="text-gray-400 font-serif mb-6">{info.date}</p>
                        <p className="text-gray-700 leading-relaxed italic border-t border-b border-stone-200 py-6 mb-6 font-serif text-lg">{info.description}</p>
                        <div className="bg-green-50 p-5 rounded-xl text-left border border-green-100">
                            <h3 className="text-jade-green font-bold text-base mb-2 flex items-center gap-2"><Leaf size={16}/> 养生提要</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">{info.healthTips}</p>
                        </div>
                    </div>

                    <h2 className="font-serif font-bold text-xl mb-6 text-center flex items-center justify-center gap-2 text-gray-700">
                        <span className="w-8 h-[1px] bg-gray-300"></span> 每日三餐推荐 <span className="w-8 h-[1px] bg-gray-300"></span>
                    </h2>
                    
                    <div className="grid gap-6">
                        {info.recommendedDishes.map((dish, i) => {
                             const MealIcon = meals[i]?.icon || Sparkles;
                             return (
                             <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-100 hover:shadow-lg transition-all group">
                                <div className="h-48 bg-stone-100 w-full overflow-hidden relative cursor-pointer" onClick={() => toggleDetail(dish.name)}>
                                    {listImages[dish.name] ? (
                                        <img src={listImages[dish.name]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={dish.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                                            <Sparkles className="animate-pulse" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-ink-black flex items-center gap-1 shadow-sm">
                                        <MealIcon size={12} className="text-china-red" />
                                        {meals[i]?.label || '时令推荐'}
                                    </div>
                                    <h3 className="absolute bottom-3 left-4 text-white font-bold text-2xl font-serif">{dish.name}</h3>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-600 line-clamp-2 flex-1 mr-4">{dish.description}</p>
                                        <button 
                                            onClick={() => toggleDetail(dish.name)}
                                            className="px-5 py-2 bg-stone-800 text-white rounded-full text-sm hover:bg-china-red transition-colors whitespace-nowrap shadow-md"
                                        >
                                            {expandedDish === dish.name ? '收起做法' : '看做法'}
                                        </button>
                                    </div>
                                    
                                    {/* Inline Detail View */}
                                    {expandedDish === dish.name && (
                                        <div className="mt-6 border-t border-stone-100 pt-6 animate-fade-in">
                                            {loadingDetail === dish.name ? (
                                                <div className="text-center py-8">
                                                    <Loader2 className="animate-spin text-china-red mx-auto mb-2" />
                                                    <p className="text-gray-400 text-sm">正在加载食谱...</p>
                                                </div>
                                            ) : details[dish.name] ? (
                                                <RecipeCard recipe={details[dish.name]!} onSave={saveRecipe} onUpdateNote={(r, n, rate) => saveRecipe({...r, notes: n, userRating: rate} as SavedRecipe, RecipeStatus.Eager)} />
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                             </div>
                             );
                        })}
                    </div>
                 </>
             )}
        </div>
    );
};

// 3. Search & Ingredients
const SearchPage = ({ saveRecipe, onUpdateNote }: { saveRecipe: (r: Recipe, s: RecipeStatus) => void, onUpdateNote: (r: SavedRecipe, n: string, rate: number) => void }) => {
    const [mode, setMode] = useState<'name' | 'ingredients'>('name');
    const [query, setQuery] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [loading, setLoading] = useState(false);
    
    // For name search
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    
    // For ingredients search
    const [suggestions, setSuggestions] = useState<RecipeSummary[]>([]);
    const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);
    const [details, setDetails] = useState<Record<string, Recipe | null>>({});
    const [loadingDetail, setLoadingDetail] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setRecipe(null);
        setSuggestions([]);
        setExpandedSuggestion(null);
        setLoading(true);
        try {
            if (mode === 'name') {
                if(!query) return;
                const data = await GeminiService.generateRecipeByName(query);
                setRecipe(data);
            } else {
                if(!ingredients) return;
                const data = await GeminiService.recommendByIngredients(ingredients);
                setSuggestions(data);
            }
        } catch (e) {
            alert('AI 暂时有些繁忙，请稍后再试');
        } finally {
            setLoading(false);
        }
    };

    const toggleSuggestionDetail = async (name: string) => {
        if (expandedSuggestion === name) {
            setExpandedSuggestion(null);
            return;
        }
        setExpandedSuggestion(name);
        
        if (!details[name]) {
            setLoadingDetail(name);
            try {
                const data = await GeminiService.generateRecipeByName(name);
                setDetails(prev => ({...prev, [name]: data}));
            } catch(e) { console.error(e); } 
            finally { setLoadingDetail(null); }
        }
    };

    return (
        <div className="max-w-2xl mx-auto pt-6 pb-24 px-4">
            <h1 className="text-2xl font-serif font-bold mb-6 text-center">寻味·厨房灵感</h1>
            
            <div className="flex bg-stone-200 p-1 rounded-full mb-8">
                <button 
                    onClick={() => { setMode('name'); setRecipe(null); setSuggestions([]); }}
                    className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${mode === 'name' ? 'bg-white text-china-red shadow-sm' : 'text-gray-500'}`}
                >
                    搜菜名
                </button>
                <button 
                    onClick={() => { setMode('ingredients'); setRecipe(null); setSuggestions([]); }}
                    className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${mode === 'ingredients' ? 'bg-white text-jade-green shadow-sm' : 'text-gray-500'}`}
                >
                    配食材
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 mb-8 transition-all">
                {mode === 'name' ? (
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="想吃什么？例如：红烧肉"
                            className="w-full pl-4 pr-14 py-4 border border-stone-200 rounded-xl bg-stone-50 focus:ring-2 focus:ring-china-red focus:bg-white outline-none transition-all"
                        />
                        <button type="submit" disabled={loading} className="absolute right-2 top-2 bottom-2 aspect-square bg-china-red text-white rounded-lg hover:bg-red-800 disabled:opacity-50 flex items-center justify-center">
                             {loading ? <Loader2 className="animate-spin" /> : <Search />}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSearch}>
                        <textarea 
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            className="w-full p-4 border border-stone-200 rounded-xl mb-4 focus:ring-2 focus:ring-jade-green outline-none h-32 resize-none bg-stone-50 focus:bg-white transition-all"
                            placeholder="输入冰箱里的食材，用逗号分隔...&#10;例如：鸡蛋, 番茄, 青椒"
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-jade-green text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-100"
                        >
                             {loading ? <Loader2 className="animate-spin" /> : <Utensils size={18} />}
                             {loading ? '大厨思考中...' : '生成推荐菜单'}
                        </button>
                    </form>
                )}
            </div>

            {loading && !recipe && suggestions.length === 0 && (
                <div className="text-center py-12">
                     <Loader2 className="animate-spin text-gray-300 mx-auto mb-4" size={48} />
                     <p className="text-gray-400 font-serif">正在翻阅食谱...</p>
                </div>
            )}

            {suggestions.length > 0 && (
                 <div className="space-y-4 animate-fade-in">
                     <h2 className="font-serif font-bold text-lg text-gray-700 mb-4">为您推荐</h2>
                     {suggestions.map((item, idx) => (
                         <div key={idx} 
                            className="bg-white p-5 rounded-xl shadow-sm border border-stone-100 hover:border-jade-green transition-all group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start cursor-pointer" onClick={() => toggleSuggestionDetail(item.name)}>
                                <div className="relative z-10">
                                    <h3 className="font-bold text-lg text-ink-black group-hover:text-jade-green transition-colors flex items-center gap-2">
                                        {item.name}
                                        <ChevronRight size={18} className={`text-gray-300 group-hover:text-jade-green transition-transform ${expandedSuggestion === item.name ? 'rotate-90' : ''}`} />
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2 mt-1">{item.description}</p>
                                    <div className="inline-block bg-green-50 text-jade-green text-xs px-3 py-1 rounded-full font-medium">
                                        推荐理由: {item.matchReason}
                                    </div>
                                </div>
                                <div className="absolute right-0 top-0 w-16 h-16 bg-jade-green/5 rounded-bl-full -mr-8 -mt-8"></div>
                            </div>

                            {expandedSuggestion === item.name && (
                                <div className="mt-6 border-t border-stone-100 pt-6 animate-fade-in relative z-20">
                                    {loadingDetail === item.name ? (
                                        <div className="text-center py-4">
                                            <Loader2 className="animate-spin text-jade-green mx-auto mb-2" />
                                            <p className="text-gray-400 text-sm">正在加载...</p>
                                        </div>
                                    ) : details[item.name] ? (
                                        <RecipeCard recipe={details[item.name]!} onSave={saveRecipe} onUpdateNote={onUpdateNote} />
                                    ) : null}
                                </div>
                            )}
                         </div>
                     ))}
                 </div>
             )}

             {recipe && (
                 <div className="animate-slide-up">
                     <RecipeCard recipe={recipe} onSave={saveRecipe} onUpdateNote={onUpdateNote} />
                 </div>
             )}
        </div>
    );
};

// 4. Recipe Book / Category Page
const RecipeBookPage = ({ saveRecipe, onUpdateNote }: { saveRecipe: (r: Recipe, s: RecipeStatus) => void, onUpdateNote: (r: SavedRecipe, n: string, rate: number) => void }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [dishes, setDishes] = useState<RecipeSummary[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Inline detail state
    const [expandedDish, setExpandedDish] = useState<string | null>(null);
    const [details, setDetails] = useState<Record<string, Recipe | null>>({});
    const [loadingDetail, setLoadingDetail] = useState<string | null>(null);

    const categories = [
        { name: '川菜', desc: '麻辣鲜香' }, { name: '鲁菜', desc: '咸鲜纯正' },
        { name: '粤菜', desc: '鲜嫩滑爽' }, { name: '苏菜', desc: '甜咸适口' },
        { name: '浙菜', desc: '清鲜爽脆' }, { name: '湘菜', desc: '香辣软嫩' },
        { name: '徽菜', desc: '重油重色' }, { name: '闽菜', desc: '鲜香清淡' },
        { name: '家常菜', desc: '温馨滋味' }, { name: '汤羹', desc: '滋补养生' },
        { name: '凉菜', desc: '开胃爽口' }, { name: '面点', desc: '中华面食' }
    ];

    const handleCategoryClick = async (cat: string) => {
        setSelectedCategory(cat);
        setDishes([]);
        setExpandedDish(null);
        setLoading(true);
        try {
            const data = await GeminiService.recommendByCategory(cat);
            setDishes(data);
        } catch(e) { console.error(e); }
        finally { setLoading(false); }
    };

    const toggleDetail = async (dishName: string) => {
        if (expandedDish === dishName) {
            setExpandedDish(null);
            return;
        }
        setExpandedDish(dishName);

        if (!details[dishName]) {
            setLoadingDetail(dishName);
            try {
                const recipe = await GeminiService.generateRecipeByName(dishName);
                setDetails(prev => ({...prev, [dishName]: recipe}));
            } catch(e) { console.error(e); } 
            finally { setLoadingDetail(null); }
        }
    };

    return (
        <div className="max-w-2xl mx-auto pt-6 pb-24 px-4">
            <h1 className="text-2xl font-serif font-bold mb-6 text-center">菜谱大全·八大菜系</h1>

            {!selectedCategory ? (
                <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => handleCategoryClick(cat.name)}
                            className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:border-china-red hover:shadow-md transition-all text-left group"
                        >
                            <h3 className="text-xl font-serif font-bold mb-1 group-hover:text-china-red">{cat.name}</h3>
                            <p className="text-gray-400 text-sm">{cat.desc}</p>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="animate-fade-in">
                     <button onClick={() => setSelectedCategory(null)} className="mb-4 text-sm text-gray-500 hover:text-china-red flex items-center gap-1">
                        <ChevronRight className="rotate-180" size={16}/> 返回分类
                     </button>
                     <h2 className="text-3xl font-serif font-bold text-china-red mb-6">{selectedCategory}经典</h2>
                     
                     {loading && dishes.length === 0 && (
                        <div className="text-center py-12">
                             <Loader2 className="animate-spin text-gray-300 mx-auto mb-4" size={32} />
                             <p className="text-gray-400">正在挑选菜品...</p>
                        </div>
                     )}

                     <div className="grid gap-4">
                         {dishes.map((dish, i) => (
                             <div key={i} className="bg-white rounded-lg shadow-sm border border-stone-100 overflow-hidden">
                                 <div 
                                    onClick={() => toggleDetail(dish.name)} 
                                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-stone-50 transition-colors"
                                 >
                                     <div>
                                        <h3 className="font-bold text-lg">{dish.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{dish.description}</p>
                                     </div>
                                     <ChevronRight size={16} className={`text-gray-300 transition-transform ${expandedDish === dish.name ? 'rotate-90' : ''}`} />
                                 </div>

                                 {expandedDish === dish.name && (
                                     <div className="border-t border-stone-100 p-4 bg-stone-50/30">
                                         {loadingDetail === dish.name ? (
                                             <div className="text-center py-4">
                                                 <Loader2 className="animate-spin text-china-red mx-auto mb-2" />
                                                 <p className="text-xs text-gray-400">加载食谱中...</p>
                                             </div>
                                         ) : details[dish.name] ? (
                                             <RecipeCard recipe={details[dish.name]!} onSave={saveRecipe} onUpdateNote={onUpdateNote} />
                                         ) : null}
                                     </div>
                                 )}
                             </div>
                         ))}
                     </div>
                </div>
            )}
        </div>
    );
};

// 5. Mine Page
const MinePage = ({ savedRecipes, deleteRecipe, toggleStatus, updateNote }: { 
    savedRecipes: SavedRecipe[], 
    deleteRecipe: (id: string) => void, 
    toggleStatus: (id: string, s: RecipeStatus) => void,
    updateNote: (r: SavedRecipe, n: string, rate: number) => void
}) => {
    const [filter, setFilter] = useState<'all' | RecipeStatus>('all');
    
    const filtered = savedRecipes.filter(r => filter === 'all' || r.status === filter);
    const sorted = [...filtered].sort((a, b) => b.savedAt - a.savedAt);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const tabs = [
        { id: 'all', label: '全部' },
        { id: RecipeStatus.Eager, label: '跃跃欲试' },
        { id: RecipeStatus.Tried, label: '小试牛刀' },
        { id: RecipeStatus.Mastered, label: '小有成就' },
    ];

    const getStatusLabel = (s: RecipeStatus) => {
        switch(s) {
            case RecipeStatus.Eager: return '跃跃欲试';
            case RecipeStatus.Tried: return '小试牛刀';
            case RecipeStatus.Mastered: return '小有成就';
            default: return '待烹饪';
        }
    }

    const getStatusColor = (s: RecipeStatus) => {
        switch(s) {
            case RecipeStatus.Eager: return 'text-china-red bg-red-50';
            case RecipeStatus.Tried: return 'text-jade-green bg-green-50';
            case RecipeStatus.Mastered: return 'text-amber-500 bg-amber-50';
            default: return 'text-gray-500';
        }
    }

    return (
        <div className="max-w-2xl mx-auto pt-6 pb-24 px-4">
            <h1 className="text-2xl font-serif font-bold mb-6">我的·味蕾记忆</h1>

            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id as any)}
                        className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors shadow-sm ${filter === tab.id ? 'bg-china-red text-white' : 'bg-white text-gray-500 border border-stone-200'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {sorted.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <BookHeart size={48} className="mx-auto mb-4 opacity-20" />
                        <p>暂无收藏，快去探索美食吧</p>
                    </div>
                ) : (
                    sorted.map(recipe => (
                        <div key={recipe.savedAt} className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden transition-all hover:shadow-md">
                             <div className="p-5 flex gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === recipe.savedAt.toString() ? null : recipe.savedAt.toString())}>
                                 {recipe.imageUrl && (
                                     <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                         <img src={recipe.imageUrl} className="w-full h-full object-cover" alt={recipe.name} />
                                     </div>
                                 )}
                                 <div className="flex-1 min-w-0">
                                     <div className="flex justify-between items-start mb-1">
                                         <h3 className="font-bold text-lg text-ink-black truncate">{recipe.name}</h3>
                                         <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ml-2 flex-shrink-0 ${getStatusColor(recipe.status)}`}>
                                            {getStatusLabel(recipe.status)}
                                        </span>
                                     </div>
                                     <p className="text-sm text-gray-500 line-clamp-2 mb-2">{recipe.description}</p>
                                     <div className="flex items-center gap-3 text-xs text-gray-400">
                                         <span className="flex items-center"><Clock size={12} className="mr-1"/>{recipe.cookingTime}</span>
                                         {recipe.userRating && recipe.userRating > 0 && (
                                             <span className="flex items-center text-yellow-500 font-bold"><Sparkles size={12} className="mr-1"/>{recipe.userRating}分</span>
                                         )}
                                     </div>
                                 </div>
                             </div>
                             
                             {/* Actions Bar */}
                             <div className="bg-stone-50 px-5 py-3 flex justify-between items-center border-t border-stone-100">
                                <button 
                                    onClick={() => setExpandedId(expandedId === recipe.savedAt.toString() ? null : recipe.savedAt.toString())}
                                    className="text-xs font-bold text-gray-500 hover:text-china-red transition-colors"
                                >
                                    {expandedId === recipe.savedAt.toString() ? '收起详情' : '查看详情'}
                                </button>
                                <div className="flex gap-2">
                                     <button 
                                        onClick={() => toggleStatus(recipe.name + recipe.savedAt, RecipeStatus.Eager)}
                                        className={`p-1.5 rounded-lg border transition-colors ${recipe.status === RecipeStatus.Eager ? 'border-china-red text-china-red bg-white' : 'border-transparent text-gray-400 hover:text-china-red'}`}
                                        title="跃跃欲试"
                                     >
                                         <Bookmark size={16} fill={recipe.status === RecipeStatus.Eager ? "currentColor" : "none"} />
                                     </button>
                                     <button 
                                        onClick={() => toggleStatus(recipe.name + recipe.savedAt, RecipeStatus.Tried)}
                                        className={`p-1.5 rounded-lg border transition-colors ${recipe.status === RecipeStatus.Tried ? 'border-jade-green text-jade-green bg-white' : 'border-transparent text-gray-400 hover:text-jade-green'}`}
                                        title="小试牛刀"
                                     >
                                         <UtensilsCrossed size={16} />
                                     </button>
                                     <button 
                                        onClick={() => toggleStatus(recipe.name + recipe.savedAt, RecipeStatus.Mastered)}
                                        className={`p-1.5 rounded-lg border transition-colors ${recipe.status === RecipeStatus.Mastered ? 'border-amber-400 text-amber-400 bg-white' : 'border-transparent text-gray-400 hover:text-amber-400'}`}
                                        title="小有成就"
                                     >
                                         <Trophy size={16} />
                                     </button>
                                     <div className="w-px h-6 bg-gray-200 mx-1"></div>
                                     <button 
                                        onClick={() => deleteRecipe(recipe.name + recipe.savedAt)}
                                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 transition-colors"
                                        title="删除"
                                     >
                                         <Trash2 size={16} />
                                     </button>
                                </div>
                             </div>

                             {expandedId === recipe.savedAt.toString() && (
                                 <div className="border-t border-stone-100">
                                     <RecipeCard 
                                        recipe={recipe} 
                                        isSaved={true} 
                                        savedStatus={recipe.status} 
                                        onUpdateNote={updateNote}
                                        onSave={(r, s) => toggleStatus(recipe.name + recipe.savedAt, s)}
                                     />
                                 </div>
                             )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// --- Main App Component ---

const App: React.FC = () => {
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem('zenCuisineRecipes');
    if (stored) {
      try {
        setSavedRecipes(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load recipes", e);
      }
    }
  }, []);

  const saveToLocal = (recipes: SavedRecipe[]) => {
      setSavedRecipes(recipes);
      localStorage.setItem('zenCuisineRecipes', JSON.stringify(recipes));
  };

  const handleSaveRecipe = (recipe: Recipe, status: RecipeStatus) => {
    // Check if duplicate (simple name check)
    const existingIndex = savedRecipes.findIndex(r => r.name === recipe.name && r.savedAt === (recipe as SavedRecipe).savedAt);
    
    // If it's already a saved recipe instance (has savedAt), update it
    if ((recipe as SavedRecipe).savedAt && existingIndex !== -1) {
         const updated = [...savedRecipes];
         updated[existingIndex] = { ...recipe as SavedRecipe, status };
         saveToLocal(updated);
         return;
    }
    
    // Check if name exists generally
    const existingByName = savedRecipes.find(r => r.name === recipe.name);
    if(existingByName) {
         // Just update status
         const updated = savedRecipes.map(r => r.name === recipe.name ? { ...r, status } : r);
         saveToLocal(updated);
    } else {
        const newRecipe: SavedRecipe = {
            ...recipe,
            savedAt: (recipe as SavedRecipe).savedAt || Date.now(),
            status,
            reviews: recipe.reviews || []
        };
        saveToLocal([newRecipe, ...savedRecipes]);
    }
  };

  const handleDelete = (id: string) => {
      const updated = savedRecipes.filter(r => (r.name + r.savedAt) !== id);
      saveToLocal(updated);
  }

  const handleToggleStatus = (id: string, newStatus: RecipeStatus) => {
      const updated = savedRecipes.map(r => (r.name + r.savedAt) === id ? {...r, status: newStatus} : r);
      saveToLocal(updated);
  }

  const handleUpdateNote = (recipe: SavedRecipe, note: string, rating: number) => {
      // Find and update
      // Logic handled in handleSaveRecipe somewhat, but specific note update needs precise ID matching
      const updated = savedRecipes.map(r => {
          // If the recipe passed in matches one in our list
          if (r.name === recipe.name && (r.savedAt === recipe.savedAt || !recipe.savedAt)) {
              return { ...r, notes: note, userRating: rating, status: r.status };
          }
          return r;
      });
      
      // If not found (e.g. from search result interacting first time), add it
      if (!savedRecipes.some(r => r.name === recipe.name)) {
          handleSaveRecipe({...recipe, notes: note, userRating: rating} as SavedRecipe, RecipeStatus.Eager);
      } else {
          saveToLocal(updated);
      }
  }

  return (
    <HashRouter>
      <div className="min-h-screen font-sans text-ink-black pb-20 md:pb-0 md:pt-20 bg-rice-paper">
        <Routes>
          <Route path="/" element={<SoulDishPage />} />
          <Route path="/solar" element={<SolarPage saveRecipe={handleSaveRecipe} />} />
          <Route path="/search" element={<SearchPage saveRecipe={handleSaveRecipe} onUpdateNote={handleUpdateNote} />} />
          <Route path="/categories" element={<RecipeBookPage saveRecipe={handleSaveRecipe} onUpdateNote={handleUpdateNote} />} />
          <Route path="/mine" element={<MinePage savedRecipes={savedRecipes} deleteRecipe={handleDelete} toggleStatus={handleToggleStatus} updateNote={handleUpdateNote} />} />
        </Routes>
        <Navigation />
      </div>
    </HashRouter>
  );
};

export default App;