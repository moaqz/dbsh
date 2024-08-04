import antfu from "@antfu/eslint-config";

export default antfu({
  stylistic: {
    quotes: "double",
    semi: true,
  },

  rules: {
    "curly": "off",
    "no-console": "off",
  },
});
