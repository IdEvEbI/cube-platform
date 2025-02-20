# 后端工程配置

## 任务目标

- 配置后端工程（**Node.js** + **Express**），使用 ES6 Module。
- 支持基本 API（如 `/health` 健康检查）。
- 集成 **ESLint**、**Prettier** 和**单元测试（Jest）**，确保代码质量和功能验证。

## 步骤 1：初始化后端项目

> **目的**：使用 **Node.js** 和 **Express** 搭建后端基础环境，支持 **ES6 Module**。

此步骤创建后端目录，初始化项目，并配置 ES6 支持。

- 创建并导航到后端目录：

  ```bash
  mkdir backend && cd backend
  ```

- 初始化 **Node.js** 项目：

  ```bash
  yarn init -y
  ```

- 安装 **Express** 和开发依赖：

  ```bash
  yarn add express
  yarn add -D nodemon
  ```

  > **说明**：`express` 用于构建 API，`nodemon` 提供开发时自动重启。

- 更新 `package.json`，启用 **ES6 Module** 并添加脚本：

  ```json
  {
    "type": "module",
    "scripts": {
      "start": "node src/index.js",
      "dev": "nodemon src/index.js",
      "format": "prettier --write .",
      "lint": "eslint .",
      "test": "jest"
    },
  }
  ```
  
  > **说明**：`"type": "module"` 启用 ES6，添加完整开发脚本。
  
- 创建基础文件结构和健康检查 API：

  ```bash
  mkdir src
  ```

  - 创建 `src/app.js`：

    ```bash
    echo "import express from 'express'

    const app = express()

    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
    })

    export default app" > src/app.js
    ```

  - 创建 `src/index.js`：

    ```bash
    cat <<EOF > src/index.js
    import app from './app.js'
    
    const port = 3000
    const server = app.listen(port, () => {
      console.log(\`Server running at http://localhost:\${port}\`)
    })
    
    export default server
    EOF
    ```

  > **说明**：使用 `heredoc` 确保多行代码完整，`server` 可导出用于测试。

## 步骤 2：配置代码规范

> **目的**：通过 ESLint 和 Prettier 确保代码一致性和质量。

此步骤集成最新 ESLint 配置，支持 ES6 Module。

- 安装 ESLint 和 Prettier 依赖：

  ```bash
  yarn add -D eslint@9.x prettier eslint-config-prettier eslint-plugin-prettier
  ```

  > **说明**：锁定 ESLint 9.x，避免版本问题。

- 创建 ESLint 配置文件（`eslint.config.js`）：

  ```bash
  echo "import prettier from 'eslint-plugin-prettier'
  import prettierConfig from 'eslint-config-prettier'

  export default [
    {
      files: ['**/*.js'],
      languageOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest'
      },
      plugins: { prettier },
      rules: {
        'no-console': 'off',
        'prettier/prettier': 'error'
      }
    },
    prettierConfig
  ]" > eslint.config.js
  ```

  > **说明**：关闭 `no-console` 规则，避免警告。

- 创建 Prettier 配置文件（`.prettierrc`）：

  ```bash
  echo '{
    "semi": false,
    "singleQuote": true,
    "trailingComma": "es5"
  }' > .prettierrc
  ```

  > **说明**：与前端一致的格式化规则。

## 步骤 3：配置测试环境

> **目的**：集成 Jest，支持单元测试和 API 验证。

此步骤配置 Jest，支持 ES6 Module。

- 安装 Jest、Babel 和测试依赖：

  ```bash
  yarn add -D jest supertest @babel/core @babel/preset-env babel-jest
  ```

  > **说明**：添加 Babel 支持 ES6 转换。

- 创建 Babel 配置文件（`.babelrc`）：

  ```bash
  echo '{
    "presets": ["@babel/preset-env"]
  }' > .babelrc
  ```

  > **说明**：配置 Babel 转换 ES6 代码。

- 创建 Jest 配置文件（`jest.config.js`）：

  ```bash
  echo "export default {
    testEnvironment: 'node',
    testMatch: ['**/*.test.js'],
    transform: {
      '^.+\\.js$': 'babel-jest'
    }
  }" > jest.config.js
  ```

  > **说明**：启用 Babel 转换，支持 ES6。

- 添加健康检查 API 测试（`src/app.test.js`）：

  ```bash
  echo "import request from 'supertest'
  import app from './app.js'
  
  describe('Health API', () => {
    it('should return status ok', async () => {
      const res = await request(app).get('/health')
      expect(res.status).toBe(200)
      expect(res.body.status).toBe('ok')
      expect(res.body.timestamp).toBeDefined()
    })
  })" > src/app.test.js
  ```

  > **说明**：测试 `app` 而非服务器，避免异步问题。

## 步骤 4：配置 `.gitignore`

> **目的**：忽略临时文件和依赖，保持仓库干净。

- 创建或更新 `.gitignore`：

  ```bash
  echo "
  node_modules/
  dist/
  coverage/
  *.log
  " > .gitignore
  ```

  > **说明**：覆盖常见忽略项。

## 步骤 5：验证后端配置并提交

> **目的**：确认配置生效并提交到 GitHub，完成闭环。

- 验证开发环境（在 `backend` 目录下）：

  ```bash
  yarn dev
  ```

  > **说明**：访问 `http://localhost:3000/health`，返回 `{ "status": "ok", "timestamp": "..." }`。

- 验证格式化和代码检查：

  ```bash
  yarn format && yarn lint
  ```

  > **说明**：无报错或警告表示配置成功。

- 验证测试：

  ```bash
  yarn test
  ```

  > **说明**：测试通过，无异步句柄遗留。

- 提交并推送更改（从项目根目录）：

  ```bash
  cd ..
  git add backend
  git commit -m "feat(backend): initial setup with express, jest, and es6 module"
  git push origin dev
  ```

  > **说明**：英文提交信息，推送至 `dev` 分支。

## 验证清单

- [ ] 运行 `yarn dev`（在 `backend` 目录），访问 `http://localhost:3000/health` 返回状态正常。
- [ ] 运行 `yarn format`（在 `backend` 目录），代码格式化无报错。
- [ ] 运行 `yarn lint`（在 `backend` 目录），无 ESLint 错误或警告。
- [ ] 运行 `yarn test`（在 `backend` 目录），测试通过。
