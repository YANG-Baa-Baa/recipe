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

interface RecipeCardProps {
  recipe: Recipe;
  onViewDetail: () => void;
}

export const RecipeCard = ({ recipe, onViewDetail }: RecipeCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg transform hover:-translate-y-1">
      <div className="flex flex-col md:flex-row">
        {/* 图片占位 */}
        <div className="h-48 w-full md:w-1/3 bg-gray-200 flex items-center justify-center">
          <i className="fa-solid fa-utensils text-gray-400 text-3xl"></i>
        </div>
        
        {/* 内容 */}
        <div className="p-5 w-full md:w-2/3">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{recipe.title}</h3>
          
          {/* 简介（使用tags作为简介） */}
          <p className="text-gray-600 mb-3 truncate">
            {recipe.tags.join('、')}
          </p>
          
          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-3">
            {recipe.mealTime.map((time, idx) => (
              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                {time}
              </span>
            ))}
            {recipe.taste.map((taste, idx) => (
              <span key={idx} className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                {taste}
              </span>
            ))}
            {recipe.dietType.map((type, idx) => (
              <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                {type}
              </span>
            ))}
          </div>
          
          {/* 时长/份量/难度 */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="flex items-center mr-4">
              <i className="fa-solid fa-clock mr-1"></i> {recipe.durationMin}分钟
            </span>
            <span className="flex items-center mr-4">
              <i className="fa-solid fa-user mr-1"></i> {recipe.servings}人份
            </span>
            <span className="flex items-center">
              <i className="fa-solid fa-star mr-1"></i> {recipe.difficulty}
            </span>
          </div>
          
          {/* 营养信息 */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="flex items-center mr-4">
              <i className="fa-solid fa-fire mr-1 text-orange-500"></i> 热量 {recipe.nutrition.cal} 卡
            </span>
            <span className="flex items-center">
              <i className="fa-solid fa-drumstick-bite mr-1 text-red-500"></i> 蛋白质 {recipe.nutrition.protein_g}g
            </span>
          </div>
          
          {/* 查看详情按钮 */}
          <button 
            onClick={onViewDetail}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors"
          >
            查看详情
          </button>
        </div>
      </div>
    </div>
  );
};