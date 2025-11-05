import { useEffect, useRef } from 'react';

interface Recipe {
  id: string;
  title: string;
  mealTime: string[];
  taste: string[];
  dietType: string[];
  durationMin: number;
  servings: number;
  difficulty: string;
  tags: string[];
  nutrition: { cal: number; protein_g: number };
  ingredients: { name: string; amount: string }[];
  steps: string[];
  image: null | string;
}

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const RecipeDetailModal = ({ recipe, onClose }: RecipeDetailModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // 点击外部关闭模态框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // 阻止模态框内的点击事件冒泡
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        {/* 模态框头部 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{recipe.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fa-solid fa-times text-xl"></i>
            </button>
          </div>
        </div>
        
        {/* 模态框内容 */}
        <div className="p-6">
          {/* 图片占位 */}
          <div className="h-64 w-full bg-gray-200 rounded-lg flex items-center justify-center mb-6">
            <i className="fa-solid fa-utensils text-gray-400 text-4xl"></i>
          </div>
          
          {/* 基本信息 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500">用餐时间</p>
              <p className="font-medium text-orange-600">{recipe.mealTime.join('、')}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500">口味</p>
              <p className="font-medium text-green-600">{recipe.taste.join('、')}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500">饮食目标</p>
              <p className="font-medium text-purple-600">{recipe.dietType.join('、')}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500">难度</p>
              <p className="font-medium text-blue-600">{recipe.difficulty}</p>
            </div>
          </div>
          
          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          
          {/* 营养信息 */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">营养信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <i className="fa-solid fa-fire text-orange-500 text-xl mr-3"></i>
                <div>
                  <p className="text-sm text-gray-500">热量</p>
                  <p className="font-medium text-gray-800">{recipe.nutrition.cal} 卡</p>
                </div>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-drumstick-bite text-red-500 text-xl mr-3"></i>
                <div>
                  <p className="text-sm text-gray-500">蛋白质</p>
                  <p className="font-medium text-gray-800">{recipe.nutrition.protein_g}g</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 食材清单 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">食材清单</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, idx) => (
                <li key={idx} className="flex items-start">
                  <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-3"></i>
                  <span className="text-gray-700">
                    <span className="font-medium">{ingredient.name}</span> - {ingredient.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* 步骤 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">烹饪步骤</h3>
            <ol className="space-y-4">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        
        {/* 模态框底部 */}
        <div className="p-6 border-t border-gray-200 text-center">
          <button 
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
};