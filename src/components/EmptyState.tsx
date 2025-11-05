interface EmptyStateProps {
  onClearAll: () => void;
}

export const EmptyState = ({ onClearAll }: EmptyStateProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className="fa-solid fa-utensils text-orange-500 text-3xl"></i>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">还没有推荐的食谱</h3>
      <p className="text-gray-600 mb-6">选择食材和饮食模式，点击"生成食谱推荐"按钮获取个性化推荐</p>
      <button 
        onClick={onClearAll}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
      >
        清空筛选
      </button>
    </div>
  );
};