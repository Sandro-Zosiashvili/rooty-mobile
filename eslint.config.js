// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    // axios-ის default იმპორტზე false-positive (create/AxiosError named export-ებთან კონფლიქტი)
    rules: {
      "import/no-named-as-default-member": "off",
    },
  },
  {
    ignores: ["dist/*"],
  }
]);
