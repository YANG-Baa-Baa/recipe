interface MealTimePickerProps {
  selectedMealTime: string;
  setSelectedMealTime: (time: string) => void;
}

export const MealTimePicker = ({ selectedMealTime, setSelectedMealTime }: MealTimePickerProps) => {
  const mealTimes = ['早餐', '午餐', '晚餐', '夜宵'];

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">用餐时间</h2>
      <div className="flex flex-wrap gap-4">
        {mealTimes.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedMealTime(time)}
            className={`px-6 py-3 rounded-xl text-lg font-medium transition-all ${
              selectedMealTime === time
                ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-orange-50 shadow-md'
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};