// /src/lib/recommend.ts
// 适配你的 src/data/recipes.ts (export const recipes = [...] as const)

import { recipes as seed } from "@/data/recipes";

// 推断你的 Recipe 类型（来自 recipes.ts 导出的数据）
export type Recipe = typeof seed[number];

export type MealTime = "早餐" | "午餐" | "晚餐" | "夜宵";
export type DietType = "普通" | "减肥" | "健身";

/** 归一化：去空格/小写 */
function norm(s: string) {
  return s.replace(/\s+/g, "").toLowerCase();
}

/** 把选中食材做成 Set，提高匹配速度 */
function makeIngSet(ings: string[]): Set<string> {
  return new Set(ings.map(norm));
}

/** 针对“健身/减肥”做一些标签加权映射 */
function dietBonusByTags(recipe: Recipe, diet: DietType): number {
  const t = new Set(recipe.tags);
  let bonus = 0;
  if (diet === "健身") {
    if (t.has("高蛋白")) bonus += 4;
    if (t.has("高纤维")) bonus += 1;
  } else if (diet === "减肥") {
    if (t.has("低油少盐") || t.has("低热量") || t.has("低碳")) bonus += 4;
    if (t.has("快手菜")) bonus += 1; // 轻量易做
  }
  return bonus;
}

/** 计算一道菜的综合分数 */
function scoreRecipe(
  recipe: Recipe,
  selectedIngredients: string[],
  diet: DietType,
  tastePreference?: string // 可选口味偏好：清淡/麻辣/酸甜/咸鲜
): number {
  let score = 0;

  // 1) 食材命中：每命中一个加 5 分
  if (selectedIngredients.length) {
    const ingSet = makeIngSet(selectedIngredients);
    const hit = recipe.ingredients.reduce((acc, it) => {
      return acc + (ingSet.has(norm(it.name)) ? 1 : 0);
    }, 0);
    score += hit * 5;
  } else {
    // 没选食材时，给个基础分，避免全为 0
    score += 2;
  }

  // 2) 饮食目标与标签的协同加分
  score += dietBonusByTags(recipe, diet);

  // 3) 口味偏好命中（可选）+3
  if (tastePreference && recipe.taste?.includes(tastePreference)) {
    score += 3;
  }

  // 4) 制作时长：<=20 分钟 +2；<=30 分钟 +1；>45 略减
  const d = recipe.durationMin ?? 0;
  if (d > 0 && d <= 20) score += 2;
  else if (d <= 30) score += 1;
  else if (d > 45) score -= 1;

  // 5) 轻微抖动，防止分数完全一致导致列表总是相同（不影响整体排序）
  score += Math.random() * 0.5;

  return score;
}

/** 核心：按两级条件先“过滤”，再“打分排序”，返回 Top N */
export function recommendRecipes(
  all: Recipe[],
  opts: {
    mealTime: MealTime;              // 第一级：早餐/午餐/晚餐/夜宵
    dietType: DietType;              // 第二级：普通/减肥/健身
    selectedIngredients?: string[];  // 勾选的食材名数组
    tastePreference?: string;        // 清淡/麻辣/酸甜/咸鲜（可选）
    topN?: number;                   // 默认 8 条
  }
): Recipe[] {
  const {
    mealTime,
    dietType,
    selectedIngredients = [],
    tastePreference,
    topN = 8,
  } = opts;

  // 1) 严格过滤：必须同时包含 mealTime、dietType
  const filtered = all.filter(r =>
    (r.mealTime?.includes(mealTime)) &&
    (r.dietType?.includes(dietType))
  );

  // 2) 打分排序
  const sorted = filtered
    .map(r => ({
      r,
      s: scoreRecipe(r, selectedIngredients, dietType, tastePreference),
    }))
    .sort((a, b) => b.s - a.s)
    .map(x => x.r);

  // 3) 返回 TopN
  return sorted.slice(0, Math.max(1, topN));
}

/** 困难症解决器：根据筛选得到候选池（供转盘随机） */
export function rouletteCandidates(
  all: Recipe[],
  opts: {
    mealTime?: MealTime | "全部";
    dietType?: DietType;             // 普通/减肥/健身
    tastePreference?: string;        // 清淡/麻辣/酸甜/咸鲜
  }
): Recipe[] {
  const { mealTime = "全部", dietType, tastePreference } = opts;

  return all.filter(r => {
    const timeOK = mealTime === "全部" ? true : r.mealTime?.includes(mealTime);
    const dietOK = dietType ? r.dietType?.includes(dietType) : true;
    const tasteOK = tastePreference ? r.taste?.includes(tastePreference) : true;
    return timeOK && dietOK && tasteOK;
  });
}
