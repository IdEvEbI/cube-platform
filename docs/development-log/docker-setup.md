# Docker 配置

## 任务目标

- 为前端（Vue 3 + Vite）和后端（Node.js + Express）创建 Docker 容器。
- 确保容器化后的前后端服务可本地运行并完成联调。
- 更新项目配置，推送至 GitHub `dev` 分支。

## 步骤 1：准备 Workspaces 依赖

> **目的**：确保根目录依赖完整，支持前端和后端子项目。

- 修改根目录 `package.json`，确保包含 Workspaces 和必要依赖：

  ```json
  {
    "name": "cube-platform",
    "private": true,
    "workspaces": ["frontend", "backend", "docs"],
    "scripts": {
      "dev:frontend": "yarn workspace frontend dev",
      "dev:backend": "yarn workspace backend dev",
      "dev:docs": "yarn workspace docs dev",
      "format": "prettier --write .",
      "lint": "eslint . --ext .js,.mjs,.vue",
      "test": "yarn workspaces run test"
    },
    "devDependencies": {
      "vite": "^6.1.1",
      "nodemon": "^3.1.9"
    }
  }
  ```

- 安装依赖并更新 `yarn.lock`：

  ```bash
  yarn install --force
  ```

  > **说明**：`--force` 确保 `yarn.lock` 更新，包含所有子项目依赖。

## 步骤 2：为前端创建 Dockerfile

> **目的**：构建前端应用的 Docker 镜像，支持开发环境。

- 修改 `frontend/Dockerfile`，内容如下：

  ```dockerfile
  # 使用 Node.js 18 Alpine 镜像，轻量且适合开发
  FROM node:18-alpine

  # 设置容器内的工作目录
  WORKDIR /app

  # 复制 Workspaces 根目录的依赖文件
  COPY package.json yarn.lock ./
  COPY frontend/ ./frontend/
  COPY backend/ ./backend/
  COPY docs/ ./docs/

  # 安装所有依赖，支持 Monorepo 结构
  RUN yarn install

  # 切换到前端子目录运行命令
  WORKDIR /app/frontend

  # 暴露 Vite 的默认开发端口
  EXPOSE 5173

  # 启动 Vite 开发服务器，--host 允许外部访问
  CMD ["yarn", "dev", "--host"]
  ```

  > **说明**：复制完整 Workspaces 结构，安装依赖后运行前端 `dev` 脚本。

## 步骤 3：为后端创建 Dockerfile

> **目的**：构建后端应用的 Docker 镜像，支持 API 服务运行。

- 修改 `backend/Dockerfile`，内容如下：

  ```dockerfile
  # 使用 Node.js 18 Alpine 镜像，轻量且适合开发
  FROM node:18-alpine

  # 设置容器内的工作目录
  WORKDIR /app

  # 复制 Workspaces 根目录的依赖文件
  COPY package.json yarn.lock ./
  COPY frontend/ ./frontend/
  COPY backend/ ./backend/
  COPY docs/ ./docs/

  # 安装所有依赖，支持 Monorepo 结构
  RUN yarn install

  # 切换到后端子目录运行命令
  WORKDIR /app/backend

  # 暴露 Express 的默认端口
  EXPOSE 3000

  # 启动 nodemon 开发服务器，支持热重载
  CMD ["yarn", "dev"]
  ```

  > **说明**：复制完整 Workspaces 结构，安装依赖后运行后端 `dev` 脚本。

## 步骤 4：配置 Docker Compose

> **目的**：通过 Docker Compose 编排前后端服务，实现一键启动。

- 修改根目录 `docker-compose.yml`，内容如下：

  ```yaml
  services:
    frontend:
      build:
        context: .
        dockerfile: frontend/Dockerfile
      ports:
        - '5173:5173'
      volumes:
        - ./frontend:/app/frontend
        - /app/frontend/node_modules
      environment:
        - NODE_ENV=development

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - '3000:3000'
    volumes:
      - ./backend:/app/backend
      - /app/backend/node_modules
    environment:
      - NODE_ENV=development
  ```

> **说明**：构建上下文为根目录，挂载子目录以支持热更新。

## 步骤 5：验证 Docker 容器运行

> **目的**：启动 Docker 容器，确认前后端服务正常联调。

- 构建并启动容器：

  ```bash
  docker-compose up --build
  ```

  > **说明**：`--build` 确保重新构建镜像。

- 验证后端：

  - 访问 `http://localhost:3000/health`，应返回 `{ "status": "ok", "timestamp": "..." }`。

- 验证前端：

  - 访问 `http://localhost:5173`，页面应显示 **Backend Status: ok**。
  - 若显示异常（如 “Error...”），检查后端是否运行或网络连接。

- 停止容器（在新终端或 **Ctrl+C**）：

  ```bash
  docker-compose down
  ```

  > **说明**：清理容器，保持环境干净。

## 步骤 6：提交更改至 GitHub

> **目的**：将 Docker 配置推送至 `dev` 分支，完成闭环。

- 更新根目录 `.gitignore`（如果未包含），添加：

  ```gitignore
  node_modules/
  dist/
  ```

- 提交更改：

  ```bash
  git add package.json yarn.lock frontend/Dockerfile backend/Dockerfile docker-compose.yml .gitignore
  git commit -m "feat(docker): fix workspaces context and enhance docs readability"
  git push origin dev
  ```

  > **说明**：提交完整配置，反映修复和文档优化。

## 验证清单

- [ ] 确认根目录 `yarn.lock` 已更新并提交。
- [ ] 运行 `docker-compose up --build`，后端 `http://localhost:3000/health` 返回正常。
- [ ] 运行 `docker-compose up --build`，前端 `http://localhost:5173` 显示 **Backend Status: ok**。
- [ ] 停止容器后（`docker-compose down`），无残留进程。
- [ ] 提交推送至 `dev` 分支，GitHub 上可见更新。
