import { useState } from 'react';
import { toast } from 'sonner';

interface IngredientInputProps {
  selectedIngredients: string[];
  setSelectedIngredients: (ingredients: string[]) => void;
}

// 常用食材列表
const commonIngredients = [
  '鸡蛋', '番茄', '猪肉', '豆腐', '虾', '玉米', '青椒', '洋葱', 
  '西兰花', '胡萝卜', '南瓜', '香菇', '米饭', '全麦面', '燕麦', 
  '葱花', '蒜末', '盐', '糖', '酱油', '蚝油', '柠檬汁', '黑胡椒', '橄榄油'
];

export const IngredientInput = ({ selectedIngredients, setSelectedIngredients }: IngredientInputProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 添加食材
  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
      toast.success(`已添加食材: ${ingredient}`);
    } else {
      toast.info(`${ingredient} 已在列表中`);
    }
    setSearchTerm('');
  };

  // 删除食材
  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
  };

  // 清空所有食材
  const clearAllIngredients = () => {
    setSelectedIngredients([]);
    toast.info('已清空所有食材');
  };

  // 处理搜索框回车
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      addIngredient(searchTerm.trim());
    }
  };

  // 过滤常用食材
  const filteredIngredients = commonIngredients.filter(ing => 
    ing.includes(searchTerm) && !selectedIngredients.includes(ing)
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">食材选择</h2>
      
      {/* 搜索框 */}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入食材名称，回车或点击添加"
          className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
        {searchTerm && (
          <button 
            onClick={() => addIngredient(searchTerm.trim())}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm hover:bg-orange-600 transition-colors"
          >
            添加
          </button>
        )}
      </div>

      {/* 已选食材 */}
      {selectedIngredients.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-600">已选食材</h3>
            <button 
              onClick={clearAllIngredients}
              className="text-xs text-orange-500 hover:text-orange-700 flex items-center"
            >
              <i className="fa-solid fa-trash-can mr-1"></i> 清空
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((ingredient, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="ml-1 text-orange-500 hover:text-orange-700"
                >
                  <i className="fa-solid fa-times-circle"></i>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 常用食材标签云 */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">常用食材</h3>
        <div className="flex flex-wrap gap-2">
          {filteredIngredients.map((ingredient, index) => (
            <button
              key={index}
              onClick={() => addIngredient(ingredient)}
              className="px-3 py-1 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 rounded-full text-sm transition-colors"
            >
              {ingredient}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};