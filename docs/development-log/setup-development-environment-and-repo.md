# 开发环境与仓库配置

## 任务目标

- 配置全新 VS Code 开发环境及其插件。
- 创建并配置 GitHub 仓库。
- 初始化 Monorepo 结构和 VitePress 文档目录。

## 步骤 1：安装本地开发环境

### 1.1 安装并配置 VS Code 及其插件

> 目的：安装 VS Code 和必要插件，为开发提供高效支持。

VS Code 是轻量级代码编辑器，新安装后需配置插件以支持 Vue 3 开发、代码规范和文档管理。

- 下载并安装 [VS Code](https://code.visualstudio.com/)（选择适合你操作系统的版本）。
- 打开 VS Code，进入插件管理（左侧活动栏 **Extensions** 图标，或 `Ctrl+Shift+X`）。
- 在插件市场搜索并安装以下插件（点击 **Install** 按钮）：
  - **Vue - Official**：Vue 官方插件，提供 Vue 3 语法高亮、自动补全和调试支持，核心开发工具。
  - **Prettier - Code formatter**：自动格式化代码（如 JS、Vue、Markdown），保持代码风格一致，需配合 ESLint 使用。
  - **ESLint**：检查 JavaScript 和 Vue 代码规范，提示潜在错误，提升代码质量。
  - **EditorConfig for VS Code**：读取 `.editorconfig` 文件，确保跨编辑器代码风格一致（如缩进）。
  - **Vitest**：辅助运行 Vitest 测试（本项目前端测试框架），提供测试文件导航和结果查看。
  - **GitLens — Git supercharged**：增强 Git 功能，显示提交历史、作者信息，方便版本管理。
  - **Docker**：管理 Docker 容器和镜像，提供图形化操作，简化容器调试（可选，若熟悉命令行可省）。
  - **Markdown All in One**：Markdown 编写增强，支持快捷键、预览和自动补全，提升文档效率。
  - **markdownlint**：检查 Markdown 文件格式，遵循规范（如标题层级），确保文档质量。
- 配置：
  - 打开设置（`Ctrl+,`），搜索 **Format on Save**，勾选启用（Prettier 生效）。
  - 确保 ESLint 提示生效（保存文件时检查代码）。

### 1.2 安装 Docker

> 目的：Docker 提供容器化支持，避免本地环境差异，后续部署依赖此工具。

- 下载并安装 [Docker Desktop](https://www.docker.com/products/docker-desktop)。
- 验证安装：

  ```bash
  docker --version  # 检查版本，如 20.x
  docker run hello-world  # 测试容器运行
  ```

## 步骤 2：创建 GitHub 仓库

> 目的：创建远程仓库，托管代码并管理任务。

GitHub 提供版本控制和 **Projects** 看板，追踪开发进度。

- 在 GitHub 上创建仓库：
  - 名称：`cube-platform`
  - 描述：`A full-stack Rubik's Cube learning platform with 3D visualization`
  - 选项：公开，添加 **MIT License**，不初始化 `.gitignore`（后续手动配置）。
- 配置 Projects：
  - 创建 **Kanban** 项目：`Cube Platform Development`。
  - 添加列：`Backlog`、`Todo`、`In Progress`、`In Review`、`Done`。
  - 初始化任务（标签 `Phase1`、`Infra`）：

    ```markdown
    - [ ] 初始化 Monorepo
    - [ ] 配置前端环境
    - [ ] 配置后端环境
    - [ ] 设置 VitePress 文档
    ```

## 步骤 3：克隆仓库与分支配置

> 目的：拉取仓库并配置开发分支。

克隆仓库到本地，`dev` 分支用于持续开发。

- 克隆并进入目录：

  ```bash
  git clone git@github.com:your-account/cube-platform.git
  cd cube-platform
  ```

- 创建并推送 `dev` 分支：

  ```bash
  git checkout -b dev
  git push origin dev
  ```

## 步骤 4：初始化 Monorepo 结构

> 目的：设置 Monorepo 根目录，统一管理子项目。

**Yarn Workspace** 可以管理多个子项目（如 **前端**、**后端**、**文档**），简化依赖管理。

- 初始化根目录：

  ```bash
  yarn init -y
  echo '{
    "name": "cube-platform",
    "version": "1.0.0",
    "private": true,
    "workspaces": ["frontend", "backend", "docs"],
    "scripts": {
      "dev:frontend": "yarn workspace frontend dev",
      "dev:backend": "yarn workspace backend dev",
      "format": "prettier --write .",
      "lint": "eslint . --ext .js,.mjs,.vue",
      "test": "yarn workspaces run test"
    },
    "repository": "git@github.com:your-account/cube-platform.git",
    "author": "your-name <your-email>",
    "license": "MIT"
  }' > package.json
  ```

- 创建根目录 `.gitignore`（确保换行符正确）：

  ```bash
  echo ".DS_Store" > .gitignore
  echo ".vscode/" >> .gitignore
  echo "**/node_modules/" >> .gitignore
  echo "*.log" >> .gitignore
  echo ".env" >> .gitignore
  echo ".env.*.local" >> .gitignore
  ```

- 添加 `.editorconfig`：

  ```bash
  echo "root = true
  [*]
  indent_style = space
  indent_size = 2
  end_of_line = lf
  charset = utf-8" > .editorconfig
  ```

## 步骤 5：配置 VitePress 文档目录

> 目的：设置 VitePress，支持文档管理和 GitHub Pages。

VitePress 是现代化文档工具，基于 Vite 和 Vue，支持 Markdown 编写和 GitHub Pages 部署，符合 DevOps 文档自动化要求。

- 创建并初始化文档目录：

  ```bash
  mkdir docs && cd docs
  yarn init -y
  yarn add -D vitepress
  ```

- 配置 VitePress：

  - 初始化文档结构：

    ```bash
    echo '# 魔方学习平台文档
    
    ## 产品文档
    
    1. [魔方学习平台产品需求文档（PRD）](./cube-platform-product-requirements.md)
    
    ## 开发日志
    
    ### 1. 项目初始化与环境配置
    
    1. [开发环境与仓库配置](./development-log/setup-development-environment-and-repo.md)
    
    ## 参考文档
    
    1. [Markdown 文档编写指南](./markdown-doc-guide.md)' > index.md
    
    echo "module.exports = {
      title: '魔方学习平台',
      description: '魔方学习平台文档',
      base: '/cube-platform/'
    }" > config.js
    ```

  - 更新 `package.json` 脚本：

    ```bash
    echo '{
      "name": "docs",
      "version": "1.0.0",
      "main": "index.js",
      "license": "MIT",
      "scripts": {
        "dev": "vitepress dev .",
        "build": "vitepress build .",
        "serve": "vitepress serve ."
      },
      "devDependencies": {
        "vitepress": "^1.6.3"
      }
    }' > package.json
    ```

- 添加文档 `.gitignore`：

  ```bash
  echo ".vitepress/dist/" > .gitignore
  echo ".vitepress/cache/" >> .gitignore
  ```

- 运行测试：

  ```bash
  yarn dev
  ```

- 提交变化：

  ```bash
  cd ..
  git add .
  git commit -m "chore(infra): initialize monorepo and vitepress docs"
  git push origin dev
  ```

## 验证清单

- [ ] VS Code 打开项目，插件生效（保存时格式化，ESLint 提示）。
- [ ] Docker 运行 `hello-world` 成功。
- [ ] GitHub 仓库和 Projects 创建完成。
- [ ] 本地 `dev` 分支推送成功，`.gitignore` 生效。
- [ ] 运行 `yarn workspace docs dev`，访问 `http://localhost:5173`，确认文档首页和链接可访问。
