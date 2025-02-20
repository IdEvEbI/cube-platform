# CI/CD 配置

## 任务目标

- 配置 GitHub Actions，自动化代码检查、测试和镜像构建。
- 确保推送至 `dev` 分支触发工作流，验证前后端功能。
- 推送 Docker 镜像至 Docker Hub（可选，需配置）。

## 步骤 1：配置 ESLint 和 Prettier

> **目的**：适配 ESLint 9.x 和 Prettier，限制检查范围为 `frontend` 和 `backend`。

- 修改根目录 `package.json`，确保一致性：

  ```json
  {
    "name": "cube-platform",
    "version": "1.0.0",
    "private": true,
    "type": "module",
    "workspaces": ["frontend", "backend", "docs"],
    "scripts": {
      "dev:frontend": "yarn workspace frontend dev",
      "dev:backend": "yarn workspace backend dev",
      "dev:docs": "yarn workspace docs dev",
      "format": "prettier --write \"frontend/**/*.{js,mjs,vue}\" \"backend/**/*.{js,mjs}\"",
      "lint": "eslint .",
      "test": "yarn workspace frontend test && yarn workspace backend test"
    },
    "repository": "git@github.com:IdEvEbI/cube-platform.git",
    "author": "IdevebI <idevebi@163.com>",
    "license": "MIT",
    "devDependencies": {
      "nodemon": "^3.1.9",
      "vite": "^6.1.1",
      "eslint": "^9.20.1",
      "eslint-plugin-prettier": "^5.2.3",
      "eslint-config-prettier": "^10.0.1",
      "eslint-plugin-vue": "^9.32.0",
      "vue-eslint-parser": "^9.4.3",
      "prettier": "^3.5.1"
    }
  }
  ```

- 修改根目录 `eslint.config.js`，修复忽略规则：

  ```javascript
  import prettier from 'eslint-plugin-prettier'
  import prettierConfig from 'eslint-config-prettier'
  import vuePlugin from 'eslint-plugin-vue'
  import vueParser from 'vue-eslint-parser'

  export default [
    {
      ignores: [
        'docs/**/*',
        '**/.vitepress/**/*',
        '**/coverage/**/*',
        '**/dist/**/*',
        '**/node_modules/**/*'
      ]
    },
    {
      files: ['frontend/**/*.{js,mjs,vue}', 'backend/**/*.{js,mjs}'],
      languageOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        parser: vueParser,
        parserOptions: { sourceType: 'module' }
      },
      plugins: { prettier, vue: vuePlugin },
      rules: {
        'no-console': 'off',
        'prettier/prettier': 'error',
        'vue/multi-word-component-names': 'off'
      }
    },
    prettierConfig
  ]
  ```

  > **说明**：将 `ignores` 移至单独对象，确保全局生效。

- 创建或确认根目录 `.prettierrc`，内容如下：

  ```json
  {
    "semi": false,
    "singleQuote": true,
    "trailingComma": "es5"
  }
  ```

- 创建根目录 `.prettierignore`，内容如下：

  ```gitignore
  docs/**/*
  **/.vitepress/**/*
  **/coverage/**/*
  **/dist/**/*
  **/node_modules/**/*
  ```

- 清理 ESLint 缓存并安装依赖：

  ```bash
  yarn install
  yeslint . --cache --fix
  yarn format
  ```

  > **说明**：清理缓存并格式化，确保规则生效。

## 步骤 2：为 docs 添加占位测试脚本（可选）

> **目的**：避免 `docs` 子项目测试失败，若跳过 `docs` 测试可忽略。

- 修改 `docs/package.json`（若存在，或新建），添加：

  ```json
  {
    "name": "docs",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "test": "echo 'No tests defined for docs' && exit 0"
    }
  }
  ```

  > **说明**：占位脚本避免报错，已跳过 `docs` 测试，可忽略此步。

## 步骤 3：创建 GitHub Actions 工作流

> **目的**：定义 CI 流水线，运行代码检查和测试。

- 创建 `.github/workflows/ci.yml`，内容如下：

  ```yaml
  name: CI
  on:
    push:
      branches: [dev]
    pull_request:
      branches: [dev]
  jobs:
    build-and-test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
          name: Checkout code
          with:
            fetch-depth: 0
  
        - uses: actions/setup-node@v4
          name: Setup Node.js
          with:
            node-version: '18'
  
        - name: Install dependencies
          run: yarn install --frozen-lockfile
          # 确保依赖与 yarn.lock 一致
  
        - name: Format code
          run: yarn format
          # 格式化前端和后端代码
  
        - name: Lint code
          run: yarn lint
          # 检查前端和后端代码规范
  
        - name: Run tests
          run: yarn test
          # 运行前端和后端单元测试
  
        - name: Build Docker images
          run: docker-compose up -d --build
          # 构建并启动前后端容器
  
        - name: Verify backend health
          run: curl --retry 10 --retry-delay 5 http://localhost:3000/health
          # 检查后端 API 是否正常
  
        - name: Stop containers
          run: docker-compose down
          # 清理测试环境
  ```

  > **说明**：同步格式化和 Lint 的范围限制。

## 步骤 4：验证本地 CI 流程

> **目的**：确保 CI 配置在本地可运行，避免推送后失败。

- 安装依赖并格式化：

  ```bash
  yarn install
  yarn format
  ```

- 运行 lint：

  ```bash
  yarn lint
  ```

- 运行所有测试：

  ```bash
  yarn test
  ```

  > **说明**：仅运行 `frontend` 和 `backend` 测试。

- 构建并验证 Docker 容器：

  ```bash
  docker-compose up -d --build
  curl http://localhost:3000/health
  docker-compose down
  ```

  > **说明**：模拟 CI 步骤，验证后端健康检查。

## 步骤 5：提交 CI 配置至 GitHub

> **目的**：将 CI 配置推送至 `dev` 分支，启用自动化流程。

- 提交更改：

  ```bash
  git add .github/workflows/ci.yml eslint.config.js .prettierrc .prettierignore package.json yarn.lock .gitignore
  git commit -m "feat(ci): fix eslint ignores and remove es5 rule error"
  git push origin dev
  ```

  > **说明**：提交更新后的配置，触发 GitHub Actions。

## 步骤 6：合并 dev 分支到 main 分支

> **目的**：将经过验证的 `dev` 分支代码合并到 `main` 分支，完成开发全流程。

- 创建并推送 PR：
  - 确保本地 `dev` 分支是最新的：

    ```bash
    git checkout dev
    git pull origin dev
    ```

  - 创建 PR（命令行方式，若偏好 GitHub 界面可跳过此步）：

    ```bash
    git checkout main
    git pull origin main
    git checkout dev
    git push origin dev
    gh pr create --base main --head dev --title "Merge dev into main: CI/CD setup complete" --body "Completed CI/CD configuration with lint, test, and Docker build."
    ```

  - 或通过 GitHub 界面：
    1. 访问 `https://github.com/IdEvEbI/cube-platform/pulls`。
    2. 点击 “New pull request”。
    3. 选择 `base: main` 和 `compare: dev`。
    4. 输入标题（如 “Merge dev into main: CI/CD setup complete”）和描述。
    5. 点击 “Create pull request”。

- 合并 PR：
  - 在 GitHub PR 页面，检查 CI 工作流是否通过。
  - 点击 “Merge pull request” 并确认合并。
  - 删除 `dev` 分支（可选）。

  > **说明**：合并后，`main` 分支包含完整开发环境。

## 验证清单

- [ ] 本地运行 `yarn format`，仅格式化 `frontend` 和 `backend` 文件。
- [ ] 本地运行 `yarn lint`，无代码规范错误或警告。
- [ ] 本地运行 `yarn test`，前端和后端测试通过。
- [ ] 本地运行 `docker-compose up -d --build`，访问 `http://localhost:3000/health` 返回正常。
- [ ] 推送至 `dev` 分支后，GitHub Actions 工作流成功运行。
- [ ] PR 创建并合并至 `main` 分支，`main` 分支包含最新代码。
