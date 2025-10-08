// recipes.ts
export const recipes = [
  {
    _id: "67c7d5dce226695da4a0c05a",
    author: "67da698621ed26778eb7804e",
    name: "Banana Pudding",
    servings: 6,
    description:
      "This dish features layers of creamy vanilla pudding, ripe banana slices, and crunchy vanilla wafers. The dessert strikes a perfect balance of textures, with the softness of the pudding and bananas contrasting the crunch of the wafers, which soften slightly as they absorb the pudding.",
    cookMinutes: 10,
    difficulty: 1,
    imageUrl:
      "https://www.southernliving.com/thmb/l5DQAyFyQ38FLwYjRLm49nLW0K0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Banana_Pudding_022-2000-6a7f3ba402044e5488b429a7141097fa.jpg",
    tags: ["vegetarian", "dessert", "sweet", "easy"],
    ingredients: [
      {
        name: "Vanilla pudding mix",
        amount: 1,
        unit: "packet",
        notes: "sifted",
      },
      { name: "Bananas", amount: 3, unit: "piece", notes: "ripe" },
      { name: "Vanilla wafers", amount: 200, unit: "gram", notes: "" },
      { name: "Milk", amount: 2, unit: "cup", notes: "room temperature" },
    ],
    instructions: [
      {
        description:
          "Prepare vanilla pudding according to package instructions.",
        minutes: 10,
      },
      {
        description:
          "Layer pudding, banana slices, and vanilla wafers in a dish.",
        minutes: 5,
      },
      {
        description: "Repeat layers until ingredients are used up.",
        minutes: 5,
      },
      {
        description: "Chill in the refrigerator for 2 hours before serving.",
        minutes: 120,
      },
    ],
    calories: 460,
    proteinGrams: 6,
    carbohydratesGrams: 80,
    fatGrams: 14,
    fiberGrams: 2,
    sugarGrams: 50,
    notes:
      "For extra flavor, top with whipped cream or a sprinkle of cinnamon.",
    shared: true,
    createdAt: "2024-01-05T04:41:00.082Z",
    updatedAt: "2025-03-19T06:30:15.942Z",
    views: [
      { viewer: "67da698621ed26778eb7804e", date: 1688660315112 },
      { viewer: "67da699121ed26778eb78053", date: 1696536285031 },
      { viewer: "67da698621ed26778eb7804e", date: 1703491195983 },
      { viewer: "67da699121ed26778eb78053", date: 1722034463531 },
    ],
  },
  {
    _id: "67c7e4490ac0305442cd21f1",
    author: "67da699121ed26778eb78053",
    name: "Chorizo and Mozzarella Gnocchi Bake",
    servings: 4,
    description:
      "A comforting and flavorful dish. It features soft, pillowy gnocchi cooked in a rich and tangy tomato sauce infused with the smoky and slightly spicy flavor of chorizo. The dish is topped with gooey, melted mozzarella cheese, which forms a golden crust when baked. It's often garnished with fresh herbs like basil or parsley for added color and aroma. This dish is a perfect combination of hearty, cheesy, and savory elements, making it an ideal option for a satisfying meal.",
    cookMinutes: 55,
    difficulty: 2,
    imageUrl:
      "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?resize=768,574",
    tags: ["italian", "cheesy", "dinner", "comfort food"],
    ingredients: [
      { name: "Gnocchi", amount: 500, unit: "gram", notes: "softened" },
      { name: "Chorizo", amount: 200, unit: "gram", notes: "diced" },
      { name: "Mozzarella", amount: 150, unit: "gram", notes: "" },
      { name: "Tomato sauce", amount: 2, unit: "cup", notes: "optional" },
    ],
    instructions: [
      { description: "Preheat oven to 200°C (400°F).", minutes: 10 },
      {
        description: "Cook the gnocchi in boiling water until they float.",
        minutes: 5,
      },
      {
        description: "Sauté chorizo in a pan and mix with tomato sauce.",
        minutes: 10,
      },
      {
        description: "Combine gnocchi with sauce and top with mozzarella.",
        minutes: 5,
      },
      {
        description: "Bake for 15 minutes until golden and bubbly.",
        minutes: 15,
      },
    ],
    calories: 550,
    proteinGrams: 20,
    carbohydratesGrams: 65,
    fatGrams: 25,
    fiberGrams: 4,
    sugarGrams: 6,
    notes: "Garnish with fresh basil for added flavor.",
    shared: true,
    createdAt: "2024-06-12T05:42:33.280Z",
    updatedAt: "2024-06-18T06:02:16.727Z",
    views: [
      { viewer: "67da698621ed26778eb7804e", date: 1680623337297 },
      { viewer: "67da699121ed26778eb78053", date: 1686071228232 },
      { viewer: "67da698621ed26778eb7804e", date: 1691314786809 },
      { viewer: "67da698621ed26778eb7804e", date: 1691904272173 },
      { viewer: "67da699121ed26778eb78053", date: 1693577680104 },
      { viewer: "67da699121ed26778eb78053", date: 1695145024218 },
      { viewer: "67da698621ed26778eb7804e", date: 1698688214527 },
      { viewer: "67da698621ed26778eb7804e", date: 1700312948453 },
      { viewer: "67da698621ed26778eb7804e", date: 1701320186011 },
      { viewer: "67da698621ed26778eb7804e", date: 1710370419354 },
    ],
  },
  {
    _id: "67d8e207395b045498447eef",
    author: "67da698621ed26778eb7804e",
    name: "Mediterranean Mezze Platter",
    servings: 3,
    description:
      "This platter features a vibrant array of fresh and flavorful components often associated with Mediterranean cuisine. It offers a delightful mix of textures and flavors, ideal for sharing and enjoying as an appetizer or light meal.",
    cookMinutes: 30,
    difficulty: 1,
    imageUrl:
      "https://www.chasinglenscapes.com/wp-content/media/2020/06/food-photography-on-the-go-tips.jpg",
    tags: ["appetizer", "vegetarian", "shareable", "fresh"],
    ingredients: [
      { name: "Hummus", amount: 1, unit: "cup", notes: "" },
      { name: "Pita bread", amount: 2, unit: "piece", notes: "sliced" },
      { name: "Olives", amount: 150, unit: "gram", notes: "pitted" },
      { name: "Feta cheese", amount: 100, unit: "gram", notes: "" },
    ],
    instructions: [
      {
        description:
          "Arrange hummus, pita, olives, and feta on a large platter.",
        minutes: 5,
      },
      {
        description:
          "Add other optional items like cucumber, tomatoes, or roasted peppers.",
        minutes: 5,
      },
      {
        description: "Serve with a drizzle of olive oil on the hummus.",
        minutes: 2,
      },
    ],
    calories: 500,
    proteinGrams: 12,
    carbohydratesGrams: 45,
    fatGrams: 30,
    fiberGrams: 6,
    sugarGrams: 5,
    notes: "Customize with your favorite Mediterranean ingredients.",
    shared: true,
    createdAt: "2024-11-18T03:01:27.193Z",
    updatedAt: "2024-11-19T06:02:43.858Z",
    views: [],
  },
  {
    _id: "67d8e2b5395b045498447ef4",
    author: "67da698621ed26778eb7804e",
    name: "Penne with Vodka Sauce and Mini Meatballs",
    servings: 4,
    description:
      "Garnished with freshly grated Parmesan cheese and a sprinkle of fresh parsley or basil, this comforting meal combines classic Italian flavors with a touch of indulgence.",
    cookMinutes: 45,
    difficulty: 2,
    imageUrl:
      "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2016/6/12/3/FNM070116_Penne-with-Vodka-Sauce-and-Mini-Meatballs-recipe_s4x3.jpg.rend.hgtvcom.1280.1280.85.suffix/1465939620872.webp",
    tags: ["italian", "pasta", "dinner", "comfort food"],
    ingredients: [
      {
        name: "Penne pasta",
        amount: 500,
        unit: "gram",
        notes: "cooked al dente",
      },
      { name: "Vodka sauce", amount: 2, unit: "cup", notes: "" },
      { name: "Ground beef", amount: 300, unit: "gram", notes: "lean" },
      {
        name: "Parmesan cheese",
        amount: 50,
        unit: "gram",
        notes: "freshly grated",
      },
    ],
    instructions: [
      { description: "Cook penne pasta until al dente.", minutes: 10 },
      {
        description: "Prepare mini meatballs and cook in a skillet.",
        minutes: 15,
      },
      { description: "Mix vodka sauce with meatballs and pasta.", minutes: 5 },
      { description: "Serve with grated Parmesan on top.", minutes: 5 },
    ],
    calories: 600,
    proteinGrams: 25,
    carbohydratesGrams: 70,
    fatGrams: 28,
    fiberGrams: 5,
    sugarGrams: 7,
    notes: "For a special twist, add a splash of cream to the vodka sauce.",
    shared: true,
    createdAt: "2025-01-12T03:04:21.566Z",
    updatedAt: "2025-01-12T06:16:53.057Z",
    views: [
      { viewer: "67da698621ed26778eb7804e", date: 1741856271916 },
      { viewer: "67da699121ed26778eb78053", date: 1742115890351 },
      { viewer: "67da698621ed26778eb7804e", date: 1743063096796 },
    ],
  },
  {
    _id: "67d8e33f395b045498447ef9",
    author: "67da699121ed26778eb78053",
    name: "Gluten-Free Angel Food Cake",
    servings: 8,
    description:
      "This dessert features a golden, slightly crisp exterior with a soft, fluffy, and cloud-like interior. Made with gluten-free flour and whipped egg whites, the cake achieves its signature texture and delicate sweetness without any gluten.",
    cookMinutes: 75,
    difficulty: 3,
    imageUrl:
      "https://meaningfuleats.com/wp-content/uploads/2013/08/gluten-free-angel-food-cake.jpg",
    tags: ["dessert", "gluten-free", "sweet", "baking"],
    ingredients: [
      { name: "Gluten-free flour", amount: 1.5, unit: "cup", notes: "" },
      { name: "Sugar", amount: 1, unit: "cup", notes: "granulated" },
      { name: "Egg whites", amount: 12, unit: "piece", notes: "" },
      { name: "Vanilla extract", amount: 1, unit: "teaspoon", notes: "" },
    ],
    instructions: [
      { description: "Preheat oven to 325°F (160°C).", minutes: 10 },
      { description: "Whip egg whites until stiff peaks form.", minutes: 10 },
      {
        description: "Gently fold in sugar, flour, and vanilla extract.",
        minutes: 10,
      },
      {
        description:
          "Pour batter into an ungreased tube pan and bake for 35-40 minutes.",
        minutes: 35,
      },
      {
        description: "Cool upside down before removing from the pan.",
        minutes: 30,
      },
    ],
    calories: 800,
    proteinGrams: 14,
    carbohydratesGrams: 150,
    fatGrams: 0,
    fiberGrams: 3,
    sugarGrams: 120,
    notes:
      "Serve with fresh berries or a dollop of whipped cream for a delightful treat.",
    shared: false,
    createdAt: "2025-02-01T03:06:39.730Z",
    updatedAt: "2025-02-02T06:17:22.875Z",
    views: [
      { viewer: "67da698621ed26778eb7804e", date: 1688348787908 },
      { viewer: "67da698621ed26778eb7804e", date: 1695081142114 },
      { viewer: "67da698621ed26778eb7804e", date: 1715023338120 },
      { viewer: "67da699121ed26778eb78053", date: 1718280270524 },
      { viewer: "67da699121ed26778eb78053", date: 1742024188385 },
      { viewer: "67da698621ed26778eb7804e", date: 1743158310009 },
    ],
  },
];
