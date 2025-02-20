# 前后端联调配置

## 任务目标

- 配置前端调用后端 API（`/health` 端点）。
- 验证前后端通信正常。
- 更新前端和后端代码，推送至 GitHub `dev` 分支。

## 步骤 1：调整前端代码以调用后端 API

> **目的**：让前端通过 `fetch` 调用后端 `/health` API 并展示结果。

此步骤修改前端主组件，添加 API 调用逻辑。

- 导航到前端目录：

  ```bash
  cd frontend
  ```

- 修改 `frontend/src/App.vue`，内容如下：

  ```vue
  <script setup>
  import { ref, onMounted } from 'vue'

  const status = ref('Loading...')

  onMounted(async () => {
    try {
      const response = await fetch('http://localhost:3000/health')
      const data = await response.json()
      status.value = data.status
    } catch (error) {
      status.value = 'Error: ' + error.message
    }
  })
  </script>

  <template>
    <div>
      <h1>Cube Platform</h1>
      <p>Backend Status: {{ status }}</p>
    </div>
  </template>

  <style>
  /* 可选样式，后续扩展 */
  </style>
  ```

  > **说明**：使用 `<script setup>` 调用后端 API，按 Vue 推荐顺序排列。

## 步骤 2：启用后端跨域支持

> **目的**：解决前端调用后端时的 CORS（跨源资源共享）问题。

此步骤在后端添加 CORS 配置，确保前端可访问。

- 导航到后端目录：

  ```bash
  cd ../backend
  ```

- 安装 CORS 包：

  ```bash
  yarn add cors
  ```

- 修改 `backend/src/app.js`，内容如下：

  ```javascript
  import express from 'express'
  import cors from 'cors'

  const app = express()

  app.use(cors())

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  export default app
  ```

  > **说明**：添加 `cors` 中间件，允许前端跨域请求。

## 步骤 3：验证前后端联调

> **目的**：启动前后端服务，确认通信正常。

此步骤运行服务并检查结果。

- 启动后端服务（在 `backend` 目录）：

  ```bash
  yarn dev
  ```

  > **说明**：访问 `http://localhost:3000/health`，应返回 `{ "status": "ok", "timestamp": "..." }`。

- 在新终端启动前端服务（从根目录）：

  ```bash
  cd ../frontend
  yarn dev
  ```

  > **说明**：访问 `http://localhost:5173`，页面应显示 “Backend Status: ok”。

- 检查联调结果：
  - 如果显示 “Backend Status: ok”，联调成功。
  - 如果显示 “Backend Status: Error...”，检查后端是否运行或网络问题。

## 步骤 4：提交更改至 GitHub

> **目的**：将联调代码推送至 `dev` 分支，完成闭环。

此步骤提交前后端更改。

- 提交前端更改（在 `frontend` 目录）：

  ```bash
  git add src/App.vue
  git commit -m "feat(frontend): add health api call with script setup"
  ```

- 提交后端更改（在 `backend` 目录）：

  ```bash
  cd ../backend
  git add package.json yarn.lock src/app.js
  git commit -m "feat(backend): enable cors for frontend access"
  ```

- 推送更改（从根目录）：

  ```bash
  cd ..
  git push origin dev
  ```

  > **说明**：使用英文提交信息，确保 DevOps 规范。

## 验证清单

- [ ] 运行后端 `yarn dev`（在 `backend` 目录），访问 `http://localhost:3000/health` 返回正常。
- [ ] 运行前端 `yarn dev`（在 `frontend` 目录），访问 `http://localhost:5173` 显示 “Backend Status: ok”。
- [ ] 运行 `yarn format` 和 `yarn lint`（在 `frontend` 和 `backend` 目录），无报错。
- [ ] 提交推送至 `dev` 分支，GitHub 上可见更新。

## 英文文档名称

frontend-backend-integration
