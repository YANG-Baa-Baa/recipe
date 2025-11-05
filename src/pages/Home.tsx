import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { MealTimePicker } from '@/components/MealTimePicker';
import { DietTypePicker } from '@/components/DietTypePicker';
import { IngredientInput } from '@/components/IngredientInput';
import { RecipeCard } from '@/components/RecipeCard';
import { DifficultySolver } from '@/components/DifficultySolver';
import { RecipeDetailModal } from '@/components/RecipeDetailModal';
import { EmptyState } from '@/components/EmptyState';
import { recipes } from '@/data/recipes';

export default function Home() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedMealTime, setSelectedMealTime] = useState<string>('午餐');
  const [selectedDietType, setSelectedDietType] = useState<string>('普通');
  const [recommendedRecipes, setRecommendedRecipes] = useState<typeof recipes>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<typeof recipes[0] | null>(null);
  const [showDifficultySolver, setShowDifficultySolver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 生成食谱推荐
  const generateRecommendations = () => {
    setIsGenerating(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      let filteredRecipes = recipes;
      
      // 按用餐时间过滤
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.mealTime.includes(selectedMealTime)
      );
      
      // 按饮食类型过滤
      if (selectedDietType !== '普通') {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.dietType.includes(selectedDietType)
        );
      }
      
      // 如果有选择食材，优先展示包含所选食材的食谱
      if (selectedIngredients.length > 0) {
        const withSelectedIngredients = filteredRecipes.filter(recipe => 
          selectedIngredients.some(ing => 
            recipe.ingredients.some(recipeIng => 
              recipeIng.name.includes(ing) || ing.includes(recipeIng.name)
            )
          )
        );
        
        const withoutSelectedIngredients = filteredRecipes.filter(recipe => 
          !withSelectedIngredients.some(r => r.id === recipe.id)
        );
        
        // 混合结果，优先展示包含所选食材的
        filteredRecipes = [...withSelectedIngredients, ...withoutSelectedIngredients];
      }
      
      // 限制结果数量在3-8个之间
      const resultCount = Math.min(Math.max(3, Math.floor(filteredRecipes.length * 0.7)), 8);
      filteredRecipes = filteredRecipes.slice(0, resultCount);
      
      setRecommendedRecipes(filteredRecipes);
      setIsGenerating(false);
      
      if (filteredRecipes.length === 0) {
        toast.info('没有找到符合条件的食谱，尝试调整筛选条件吧！');
      }
    }, 800);
  };

  // 当饮食模式改变时自动生成推荐
  useEffect(() => {
    if (recommendedRecipes.length > 0) {
      generateRecommendations();
    }
  }, [selectedMealTime, selectedDietType]);

  // 查看菜谱详情
  const handleViewDetail = (recipe: typeof recipes[0]) => {
    setSelectedRecipe(recipe);
    setShowDetailModal(true);
  };

  // 清空筛选
  const handleClearAll = () => {
    setSelectedIngredients([]);
    setSelectedMealTime('午餐');
    setSelectedDietType('普通');
    setRecommendedRecipes([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-500 flex items-center">
            <i className="fa-solid fa-utensils mr-2"></i>
            食材变美食
          </h1>
          <button 
            onClick={() => setShowDifficultySolver(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow-md transition-all"
          >
            困难症解决器
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* 食材输入区 */}
        <section className="mb-8">
          <IngredientInput 
            selectedIngredients={selectedIngredients}
            setSelectedIngredients={setSelectedIngredients}
          />
        </section>

        {/* 饮食模式切换区 */}
        <section className="mb-8">
          <MealTimePicker 
            selectedMealTime={selectedMealTime}
            setSelectedMealTime={setSelectedMealTime}
          />
          <DietTypePicker 
            selectedDietType={selectedDietType}
            setSelectedDietType={setSelectedDietType}
          />
        </section>

        {/* 推荐触发区 */}
        <section className="mb-8 text-center">
          <button
            onClick={generateRecommendations}
            disabled={isGenerating}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full shadow-lg text-lg font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                生成中...
              </>
            ) : (
              '生成食谱推荐'
            )}
          </button>
        </section>

        {/* 菜谱推荐展示区 */}
        <section>
          {recommendedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id}
                  recipe={recipe}
                  onViewDetail={() => handleViewDetail(recipe)}
                />
              ))}
            </div>
          ) : isGenerating ? null : (
            <EmptyState onClearAll={handleClearAll} />
          )}
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-white/80 backdrop-blur-md py-4 mt-12">
        <div className="container mx-auto text-center text-gray-500">
          <p>© 2025 食材变美食 - 智能食谱推荐网站</p>
        </div>
      </footer>

      {/* 菜谱详情模态框 */}
      {showDetailModal && selectedRecipe && (
        <RecipeDetailModal 
          recipe={selectedRecipe}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {/* 困难症解决器模态框 */}
      {showDifficultySolver && (
        <DifficultySolver 
          onClose={() => setShowDifficultySolver(false)}
        />
      )}
    </div>
  );
}