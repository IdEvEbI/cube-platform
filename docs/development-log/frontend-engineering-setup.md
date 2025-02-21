# 前端工程配置

## 任务目标

- 配置前端工程（**Vue 3** + **Vitest** + **Cypress**）。
- 支持完整脚本（开发、构建、格式化、检查、测试）和测试覆盖率。
- 验证前端功能正常运行。

## 步骤 1：初始化前端项目

> **目的**：使用 Vite 快速搭建 Vue 3 项目基础环境，支持开发和构建。

此步骤创建前端目录并初始化项目，Vite 的 Vue 模板已包含必要依赖，避免手动重复安装。

- 创建并导航到前端目录：

  ```bash
  mkdir frontend && cd frontend
  ```

- 使用 Vite 初始化 Vue 3 项目：

  ```bash
  yarn create vite . --template vue
  yarn install
  ```

- 更新 `package.json` 中的 `scripts` 脚本：

  ```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "format": "prettier --write .",
    "lint": "eslint .",
    "test": "vitest run --coverage",
    "test:e2e": "cypress run"
  }
  ```

  > **说明**：添加开发、格式化、检查和测试脚本，支持完整工作流。

## 步骤 2：配置代码规范

> **目的**：通过 ESLint 和 Prettier 确保代码一致性和质量。

此步骤集成代码检查和格式化工具，支持自动化规范化。

- 安装 ESLint 和 Prettier 依赖：

  ```bash
  yarn add -D eslint eslint-plugin-vue vue-eslint-parser prettier
  ```

  > **说明**：只安装核心依赖，减少冗余，其他插件根据需要后续添加。

- 创建 ESLint 配置文件（`eslint.config.js`）：

  ```bash
  echo "import vuePlugin from 'eslint-plugin-vue';
  import vueParser from 'vue-eslint-parser';

  export default [
    {
      files: ['**/*.js', '**/*.vue'],
      languageOptions: {
        parser: vueParser,
        parserOptions: { sourceType: 'module' }
      },
      plugins: { vue: vuePlugin },
      rules: {
        'no-console': 'warn',
        'vue/multi-word-component-names': 'off',
        'vue/no-unused-vars': 'warn'
      }
    }
  ]" > eslint.config.js
  ```

  > **说明**：简化规则，专注 Vue 项目常见问题，后续可扩展。

- 创建 Prettier 配置文件（`.prettierrc`）：

  ```bash
  echo '{
    "semi": false,
    "singleQuote": true,
    "trailingComma": "es5"
  }' > .prettierrc
  ```

  > **说明**：设置基础格式化规则，与 ESLint 无冲突。

## 步骤 3：配置测试环境

> **目的**：集成 Vitest 和 Cypress，支持单元测试和端到端测试。

此步骤为项目添加测试能力，确保功能可验证。

- 安装测试相关依赖：

  ```bash
  yarn add -D vitest @vitest/coverage-v8 cypress
  ```

  > **说明**：Vitest 用于单元测试，Cypress 用于 E2E 测试，覆盖率报告由 V8 提供。

- 创建 Cypress 配置文件（`cypress.config.js`）：

  ```bash
  echo "import { defineConfig } from 'cypress';
  export default defineConfig({
    e2e: {
      baseUrl: 'http://localhost:5173',
      supportFile: false,
      specPattern: 'cypress/e2e/**/*.cy.{js,ts}'
    }
  })" > cypress.config.js
  ```

  > **说明**：配置默认开发服务器地址，简化测试运行。

- 添加单元测试示例（`src/example.test.js`）：

  ```bash
  echo "import { describe, it, expect } from 'vitest'
  describe('example', () => {
    it('should pass', () => expect(true).toBe(true))
  })" > src/example.test.js
  ```

  > **说明**：简单测试用例，验证 Vitest 配置。

- 创建 E2E 测试文件（`cypress/e2e/example.cy.js`）：

  ```bash
  mkdir -p cypress/e2e && echo "describe('Root Page', () => {
    it('visits root and checks content', () => {
      cy.visit('/');
      cy.contains('h1', 'Vite + Vue');
    });
  })" > cypress/e2e/example.cy.js
  ```

  > **说明**：测试访问首页并检查默认内容。

## 步骤 4：配置 `.gitignore`

> **目的**：忽略临时文件和测试报告，保持仓库干净。

此步骤更新忽略规则，避免推送无关文件。

- 创建或更新 `.gitignore`：

  ```bash
  echo "
  .cache/
  .temp/
  coverage/
  cypress/videos/
  cypress/screenshots/" >> .gitignore
  ```

  > **说明**：覆盖常见忽略项，包括测试生成的视频和截图。

## 步骤 5：验证前端配置并提交

> **目的**：确认配置生效并提交到 GitHub，完成闭环。

此步骤验证所有功能并推送代码。

- 验证开发环境（在 `frontend` 目录下）：

  ```bash
  yarn dev
  ```

  > **说明**：访问 `http://localhost:5173`，应显示 Vue 欢迎页。

- 验证格式化和代码检查：

  ```bash
  yarn format && yarn lint
  ```

  > **说明**：无报错表示配置成功。

- 验证测试：

  ```bash
  yarn test
  yarn dev & yarn test:e2e
  ```

  > **说明**：单元测试生成 `coverage/` 报告，E2E 测试通过。

- 提交并推送更改（从项目根目录）：

  ```bash
  cd ..
  git add frontend
  git commit -m "feat(frontend): initial setup with vue3, vitest, and cypress"
  git push origin dev
  ```

  > **说明**：使用英文提交信息，符合 DevOps 规范。

## 验证清单

- [ ] 运行 `yarn dev`（在 `frontend` 目录），访问 `http://localhost:5173` 显示 Vue 欢迎页。
- [ ] 运行 `yarn format`（在 `frontend` 目录），代码格式化无报错。
- [ ] 运行 `yarn lint`（在 `frontend` 目录），无 ESLint 错误。
- [ ] 运行 `yarn test`（在 `frontend` 目录），测试通过并生成 `frontend/coverage/` 报告。
- [ ] 运行 `yarn test:e2e`（需先启动 `yarn dev`），E2E 测试通过。
