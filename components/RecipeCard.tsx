import React, { useState } from 'react';
import { Recipe, RecipeStatus, SavedRecipe } from '../types';
import { Clock, ChefHat, Flame, Bookmark, Sparkles, Star, PlayCircle, MessageSquare, Video, Trophy, UtensilsCrossed } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe | SavedRecipe;
  onSave?: (recipe: Recipe, status: RecipeStatus) => void;
  onUpdateNote?: (recipe: SavedRecipe, note: string, rating: number) => void;
  isSaved?: boolean;
  savedStatus?: RecipeStatus;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSave, onUpdateNote, isSaved, savedStatus }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [userNote, setUserNote] = useState((recipe as SavedRecipe).notes || '');
  const [userRating, setUserRating] = useState((recipe as SavedRecipe).userRating || 0);

  const handleRating = (r: number) => {
    setUserRating(r);
    if (onUpdateNote) {
        onUpdateNote({ ...recipe, savedAt: Date.now(), status: RecipeStatus.Eager } as SavedRecipe, userNote, r);
    }
  };

  const handleNoteBlur = () => {
      if (onUpdateNote) {
          onUpdateNote({ ...recipe, savedAt: Date.now(), status: RecipeStatus.Eager } as SavedRecipe, userNote, userRating);
      }
  }

  const keyword = encodeURIComponent(recipe.videoKeyword || recipe.name + ' 做法');

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-stone-100 transition-all hover:shadow-xl animate-fade-in mb-8">
      {/* Header Pattern */}
      <div className="h-2 bg-china-red w-full opacity-80"></div>
      
      {/* Image Section */}
      {recipe.imageUrl && (
          <div className="w-full h-64 overflow-hidden relative group">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <h2 className="absolute bottom-4 left-6 text-3xl font-serif font-bold text-white shadow-sm">{recipe.name}</h2>
          </div>
      )}

      <div className="p-6 md:p-8">
        {!recipe.imageUrl && (
             <h2 className="text-3xl font-serif font-bold text-ink-black mb-4">{recipe.name}</h2>
        )}
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                {recipe.tags?.map(tag => (
                    <span key={tag} className="bg-stone-100 px-2 py-1 rounded-md text-stone-600">#{tag}</span>
                ))}
          </div>
          <div className="flex gap-1">
            {onSave && (
              <>
                <button
                    onClick={() => onSave(recipe, RecipeStatus.Eager)}
                    className={`p-2 rounded-full border transition-all ${isSaved && savedStatus === RecipeStatus.Eager ? 'bg-china-red text-white border-china-red' : 'border-stone-300 text-stone-400 hover:border-china-red hover:text-china-red'}`}
                    title="跃跃欲试"
                >
                  <Bookmark size={18} fill={isSaved && savedStatus === RecipeStatus.Eager ? "currentColor" : "none"} />
                </button>
                 <button
                    onClick={() => onSave(recipe, RecipeStatus.Tried)}
                    className={`p-2 rounded-full border transition-all ${isSaved && savedStatus === RecipeStatus.Tried ? 'bg-jade-green text-white border-jade-green' : 'border-stone-300 text-stone-400 hover:border-jade-green hover:text-jade-green'}`}
                    title="小试牛刀"
                >
                  <UtensilsCrossed size={18} />
                </button>
                 <button
                    onClick={() => onSave(recipe, RecipeStatus.Mastered)}
                    className={`p-2 rounded-full border transition-all ${isSaved && savedStatus === RecipeStatus.Mastered ? 'bg-amber-400 text-white border-amber-400' : 'border-stone-300 text-stone-400 hover:border-amber-400 hover:text-amber-400'}`}
                    title="小有成就"
                >
                  <Trophy size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 mb-6">
            <button 
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 font-serif font-bold transition-colors border-b-2 ${activeTab === 'details' ? 'border-china-red text-china-red' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
                烹饪详情
            </button>
            <button 
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 font-serif font-bold transition-colors border-b-2 ${activeTab === 'reviews' ? 'border-china-red text-china-red' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
                评价反馈
            </button>
        </div>

        {activeTab === 'details' ? (
        <>
            <p className="text-gray-600 italic mb-6 pl-4 border-l-4 border-stone-200 leading-relaxed">
            {recipe.description}
            </p>

            {/* Video Links */}
            <div className="grid grid-cols-3 gap-2 mb-8">
                <a 
                    href={`https://search.bilibili.com/all?keyword=${keyword}`} 
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-bold gap-1"
                >
                    <PlayCircle size={20} />
                    Bilibili
                </a>
                <a 
                    href={`https://www.xiaohongshu.com/search_result?keyword=${keyword}`} 
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-bold gap-1"
                >
                    <Video size={20} />
                    小红书
                </a>
                <a 
                    href={`https://www.douyin.com/search/${keyword}`} 
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-stone-900 text-white rounded-lg hover:bg-black transition-colors text-xs font-bold gap-1"
                >
                    <PlayCircle size={20} />
                    抖音
                </a>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 bg-stone-50 p-4 rounded-lg">
            <div className="flex flex-col items-center text-center">
                <Clock size={20} className="text-china-red mb-1" />
                <span className="text-xs text-gray-400">时间</span>
                <span className="font-semibold">{recipe.cookingTime}</span>
            </div>
            <div className="flex flex-col items-center text-center">
                <ChefHat size={20} className="text-china-red mb-1" />
                <span className="text-xs text-gray-400">难度</span>
                <span className="font-semibold">{recipe.difficulty}</span>
            </div>
            <div className="flex flex-col items-center text-center">
                <Flame size={20} className="text-china-red mb-1" />
                <span className="text-xs text-gray-400">热量</span>
                <span className="font-semibold">{recipe.calories || "适中"}</span>
            </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-serif font-bold border-b border-stone-200 pb-2 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-china-red rotate-45 mr-2"></span> 原料
                    </h3>
                    <ul className="space-y-2">
                        {recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex justify-between border-b border-dashed border-stone-200 pb-1">
                                <span className="text-ink-black">{ing.name}</span>
                                <span className="text-gray-500 font-mono">{ing.amount}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-serif font-bold border-b border-stone-200 pb-2 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-china-red rotate-45 mr-2"></span> 步骤
                    </h3>
                    <div className="space-y-6">
                        {recipe.steps.map((step) => (
                            <div key={step.stepNumber} className="flex gap-4 group">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 text-stone-500 border border-stone-200 flex items-center justify-center text-sm font-bold group-hover:bg-china-red group-hover:text-white group-hover:border-china-red transition-colors">
                                    {step.stepNumber}
                                </div>
                                <p className="text-gray-700 leading-relaxed mt-1">{step.instruction}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {recipe.tips && recipe.tips.length > 0 && (
                <div className="mt-8 bg-amber-50 p-6 rounded-lg border border-amber-100">
                    <h4 className="text-amber-800 font-bold mb-3 flex items-center gap-2 font-serif">
                        <Sparkles size={18} /> 禅意烹饪小贴士
                    </h4>
                    <ul className="list-disc list-inside text-sm text-amber-900 space-y-2">
                        {recipe.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
        ) : (
            <div className="space-y-6 animate-fade-in">
                {/* User Review Section - Always Visible */}
                <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MessageSquare size={18} /> 我的烹饪笔记 { !isSaved && <span className="text-xs font-normal text-china-red bg-red-50 px-2 py-0.5 rounded ml-2">评价将自动收藏此菜谱</span>}
                    </h3>
                    <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} onClick={() => handleRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                                <Star size={24} fill={star <= userRating ? "#C23531" : "none"} stroke={star <= userRating ? "#C23531" : "#D1D5DB"} />
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                        onBlur={handleNoteBlur}
                        placeholder="记录你的心得，例如：盐可以少放一点..."
                        className="w-full p-4 border border-stone-300 rounded-lg focus:ring-2 focus:ring-china-red focus:border-transparent outline-none h-32 resize-none bg-white"
                    />
                    <p className="text-xs text-gray-400 mt-2 text-right">笔记会自动保存</p>
                </div>

                {/* Community Reviews */}
                <h3 className="font-bold text-gray-800 mt-8 mb-4">精选食客评价</h3>
                {recipe.reviews && recipe.reviews.length > 0 ? (
                    <div className="space-y-4">
                        {recipe.reviews.map((review, idx) => (
                            <div key={idx} className="bg-white border-b border-stone-100 pb-4 last:border-0">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600">
                                            {review.author.charAt(0)}
                                        </div>
                                        <span className="font-bold text-sm text-gray-700">{review.author}</span>
                                    </div>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} fill={i < review.rating ? "#FBBF24" : "#E5E7EB"} stroke="none" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm">{review.comment}</p>
                                <p className="text-xs text-gray-300 mt-1">{review.date}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400 italic">暂无更多评论</div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;