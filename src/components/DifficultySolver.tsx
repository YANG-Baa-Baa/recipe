import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { recipes } from '@/data/recipes';

interface DifficultySolverProps {
  onClose: () => void;
}

export const DifficultySolver = ({ onClose }: DifficultySolverProps) => {
  const [mealTime, setMealTime] = useState('全部');
  const [taste, setTaste] = useState('全部');
  const [dietType, setDietType] = useState('普通');
  const [mode, setMode] = useState<'自制模式' | '外卖模式'>('自制模式');
  const [customDish, setCustomDish] = useState('');
  const [customDishes, setCustomDishes] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const controls = useAnimation();
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
  
  // 添加自定义菜名
  const addCustomDish = () => {
    if (customDish.trim() && !customDishes.includes(customDish.trim())) {
      setCustomDishes([...customDishes, customDish.trim()]);
      setCustomDish('');
    }
  };
  
  // 移除自定义菜名
  const removeCustomDish = (dish: string) => {
    setCustomDishes(customDishes.filter(item => item !== dish));
  };
  
  // 开始转盘
  const startSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowResult(false);
    
    // 过滤符合条件的菜谱
    let filteredRecipes = recipes;
    
    if (mealTime !== '全部') {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.mealTime.includes(mealTime)
      );
    }
    
    if (taste !== '全部') {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.taste.includes(taste)
      );
    }
    
    if (dietType !== '普通') {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.dietType.includes(dietType)
      );
    }
    
    // 如果是外卖模式，可以添加一些虚构的外卖选项
    let allOptions: string[] = [];
    
    if (mode === '外卖模式') {
      // 外卖模式下，可以添加一些虚构的外卖选项
      const deliveryOptions = [
        '麦当劳快餐', '肯德基炸鸡', '披萨外卖', '寿司拼盘', 
        '中式快餐', '烤肉套餐', '火锅外卖', '沙拉轻食'
      ];
      
      allOptions = [...filteredRecipes.map(r => r.title), ...deliveryOptions, ...customDishes];
    } else {
      // 自制模式下，只使用筛选后的菜谱和自定义菜名
      allOptions = [...filteredRecipes.map(r => r.title), ...customDishes];
    }
    
    // 如果没有符合条件的选项，使用默认选项
    if (allOptions.length === 0) {
      allOptions = ['番茄炒蛋', '青椒土豆丝', '红烧肉', '清蒸鱼', '麻婆豆腐', '宫保鸡丁', '鱼香肉丝', '糖醋排骨'];
    }
    
    // 确保有8个选项用于转盘显示
    while (allOptions.length < 8) {
      allOptions = [...allOptions, ...allOptions.slice(0, 8 - allOptions.length)];
    }
    
    // 随机选择一个结果
    const randomIndex = Math.floor(Math.random() * allOptions.length);
    const result = allOptions[randomIndex];
    
    // 开始旋转动画
    controls.start({
      rotate: 720 + (randomIndex * 45), // 旋转2圈以上，加上随机位置的角度
      transition: {
        duration: 3 + Math.random() * 1, // 旋转2-4秒
        ease: "easeInOut",
        onComplete: () => {
          setIsSpinning(false);
          setSpinResult(result);
          setShowResult(true);
        }
      }
    });
  };
  
  // 再转一次
  const spinAgain = () => {
    setShowResult(false);
    setTimeout(startSpin, 500);
  };
  
  // 获取转盘选项
  const getWheelOptions = () => {
    // 这里简化处理，实际项目中应该根据筛选条件生成
    return [
      '番茄炒蛋', '青椒土豆丝', '红烧肉', '清蒸鱼', 
      '麻婆豆腐', '鱼香肉丝', '糖醋排骨', '回锅肉'
    ];
  };
  
  const wheelOptions = getWheelOptions();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        {/* 模态框头部 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">困难症解决器</h2>
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
          {/* 筛选项 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* 餐点时间 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">餐点时间</label>
              <select
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="全部">全部</option>
                <option value="早餐">早餐</option>
                <option value="午餐">午餐</option>
                <option value="晚餐">晚餐</option>
                <option value="夜宵">夜宵</option>
              </select>
            </div>
            
            {/* 口味偏好 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">口味偏好</label>
              <select
                value={taste}
                onChange={(e) => setTaste(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="全部">全部</option>
                <option value="清淡">清淡</option>
                <option value="麻辣">麻辣</option>
                <option value="酸甜">酸甜</option>
                <option value="咸鲜">咸鲜</option>
              </select>
            </div>
            
            {/* 饮食目标 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">饮食目标</label>
              <select
                value={dietType}
                onChange={(e) => setDietType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="普通">普通</option>
                <option value="减肥">减肥</option>
                <option value="健身">健身</option>
              </select>
            </div>
            
            {/* 模式选择 */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">模式</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('自制模式')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    mode === '自制模式'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  自制模式
                </button>
                <button
                  onClick={() => setMode('外卖模式')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    mode === '外卖模式'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  外卖模式
                </button>
              </div>
            </div>
            
            {/* 自定义菜名 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">自定义菜名</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customDish}
                  onChange={(e) => setCustomDish(e.target.value)}
                  placeholder="输入你想吃的菜名..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={addCustomDish}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
          
          {/* 自定义菜名列表 */}
          {customDishes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-2">我的菜单池</h3>
              <div className="flex flex-wrap gap-2">
                {customDishes.map((dish, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                  >
                    {dish}
                    <button
                      onClick={() => removeCustomDish(dish)}
                      className="ml-1 text-orange-500 hover:text-orange-700"
                    >
                      <i className="fa-solid fa-times-circle"></i>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* 转盘 */}
          <div className="flex justify-center mb-8">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* 转盘背景 */}
              <motion.div
                animate={controls}
                className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-lg"
                style={{ rotate: 0 }}
              >
                {wheelOptions.map((option, index) => {
                  // 计算每个选项的颜色
                  const colors = [
                    '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9D423', 
                    '#FF9F43', '#6C5CE7', '#FD79A8', '#00B894'
                  ];
                  
                  return (
                    <div
                      key={index}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: colors[index % colors.length],
                        clipPath: `polygon(50% 50%, 50% 0%, ${
                          50 + 50 * Math.cos((index * Math.PI) / 4 - Math.PI / 8)
                        }% ${50 - 50 * Math.sin((index * Math.PI) / 4 - Math.PI / 8)}%, ${
                          50 + 50 * Math.cos((index * Math.PI) / 4 + Math.PI / 8)
                        }% ${50 - 50 * Math.sin((index * Math.PI) / 4 + Math.PI / 8)}%)`
                      }}
                    >
                      <div
                        className="text-white font-bold text-sm md:text-base transform -translate-y-1/2 origin-bottom translate-x-1/2"
                        style={{ transform: `rotate(${index * 45}deg) translateY(-100px) translateX(10px)` }}
                      >
                        {option}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
              
              {/* 转盘中心按钮 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={startSpin}
                  disabled={isSpinning}
                  className="w-16 h-16 md:w-20 md:h-20 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSpinning ? (
                    <i className="fa-solid fa-spinner fa-spin text-xl"></i>
                  ) : (
                    '开始转动'
                  )}
                </button>
              </div>
              
              {/* 转盘指示器 */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-4 h-4 bg-orange-500 rounded-full"></div>
            </div>
          </div>
          
          {/* 结果显示 */}
          <AnimatePresence>
            {showResult && spinResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-orange-50 p-6 rounded-xl text-center"
              >
                <h3 className="text-xl font-bold text-orange-600 mb-2">🎉 恭喜你！今天就吃这个吧：</h3>
                <p className="text-2xl font-bold text-gray-800 mb-4">{spinResult}</p>
                <p className="text-gray-600 mb-6">一道美味的佳肴，适合你的口味和饮食目标。</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={spinAgain}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    再转一次
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};