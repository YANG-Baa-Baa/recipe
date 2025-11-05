interface DietTypePickerProps {
  selectedDietType: string;
  setSelectedDietType: (type: string) => void;
}

export const DietTypePicker = ({ selectedDietType, setSelectedDietType }: DietTypePickerProps) => {
  const dietTypes = ['普通', '减肥', '健身'];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">饮食目标</h2>
      <div className="flex flex-wrap gap-4">
        {dietTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedDietType(type)}
            className={`px-6 py-3 rounded-xl text-lg font-medium transition-all ${
              selectedDietType === type
                ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-orange-50 shadow-md'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};