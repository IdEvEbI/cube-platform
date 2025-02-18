# Task 1：项目初始化与环境配置

## 任务目标

1. 创建 GitHub 仓库并配置 **Projects** 管理开发进度
2. 初始化 **Monorepo** 仓库，使用单一 `dev` 分支管理全栈代码
3. 使用 `yarn` 完成前后端工程化配置
4. 配置分层级 `.gitignore` 规则

## 步骤 1：创建 GitHub 仓库与 Projects 看板

### 1.1 创建仓库

1. 仓库名称：`cube-platform`
2. 描述：`A full-stack Rubik's Cube learning platform with 3D visualization`
3. 初始化选项：
   - **LICENSE**: MIT
   - **.gitignore**: 暂不添加（后续手动配置分层规则）

### 1.2 配置 GitHub Projects

1. 使用 **Kanban** 模板，命名为 `Cube Platform Development`
2. 预定义列（支持 Issue 自动流转）：

   | 列名            | 功能说明                                  |
   |-----------------|-----------------------------------------|
   | **Backlog**     | 需求池（按阶段打标签 `Phase1`/`Phase2`） |
   | **Todo**        | 待开发任务（绑定 Milestone）             |
   | **In Progress** | 进行中任务（自动关联 PR）                |
   | **In Review**   | 代码审查（Required reviewers 配置）      |
   | **Done**        | 已合并到 `dev` 分支的任务                |

3. 创建初始化任务：
   ```markdown
   - [ ] 初始化 Monorepo 结构
   - [ ] 配置 yarn workspace
   - [ ] 前端 Vue3 脚手架
   - [ ] 后端 Express 基础模板
   - [ ] 文档站点框架
   ```

   - 添加标签：`Phase1`, `Infra`

## 步骤 2：克隆仓库与分支策略

### 2.1 克隆仓库

```bash
git clone git@github.com:your-account/cube-platform.git
cd cube-platform
```

### 2.2 分支策略（企业级 Monorepo 实践）

1. **主分支**：`main`（保护分支，仅接受 PR 合并）
2. **开发分支**：`dev`（长期存在，所有功能向此分支提交）
3. **特性分支**：`feat/xxx`（短期分支，按功能拆分，合并后删除）

```bash
# 创建并切换到 dev 分支
git checkout -b dev
```

## 步骤 3：工程化配置（yarn 优先）

### 3.1 根目录初始化

```bash
# 初始化 Monorepo 的 package.json
yarn init -y

# 启用 workspace 功能（根目录 package.json）
{
  "private": true,
  "workspaces": ["frontend", "backend", "docs"],
  "scripts": {
    "dev:frontend": "yarn workspace frontend dev",
    "dev:backend": "yarn workspace backend dev"
  }
}

# 创建 根目录 .gitignore
echo "
# 全局通用
.DS_Store
.vscode/
.idea/

# 依赖目录
**/node_modules/

# 日志文件
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 环境文件
.env
.env.*.local" > .gitignore
```

### 3.2 前端项目初始化（Vue3）

```bash
# 创建子目录并初始化（使用 yarn 而非 npm）
mkdir frontend && cd frontend
yarn create vite . --template vue
yarn install

# 确保前端 .gitignore 包含以下内容（补充你的配置）
echo "
# Vite 扩展
.cache/
.temp/

# 本地调试文件
*.local" >> .gitignore
```

### 3.3 后端项目初始化（Node.js）

```bash
mkdir backend && cd backend
yarn init -y
yarn add express cors
yarn add -D nodemon

# 后端 .gitignore 内容
echo "# Node
node_modules/
.env

# 日志
logs/
*.log

# 调试文件
*.cpuprofile
*.heapsnapshot" > .gitignore
```

### 3.4 文档目录初始化

```bash
mkdir docs && cd docs
# 使用 GitHub Pages 默认 Jekyll 结构
touch .nojekyll  # 禁用 Jekyll 处理

# 创建 需求文档 和 开发日志 文档目录
mkdir requirements development-log
```

## 步骤 4：提交初始化代码

### 4.1 提交到 dev 分支

```bash
git add .
git commit -m "chore(infra): monorepo init with yarn workspace"
git push origin dev
```

### 4.2 创建 Pull Request

1. 在 GitHub 上创建 `dev` -> `main` 的 PR
2. 添加描述：
   ```markdown
   ### 变更内容
   - Monorepo 结构初始化
   - yarn workspace 配置
   - 前后端基础模板
   - 分层 .gitignore 规则
   ```
3. 在 Projects 中将任务标记为 **Done**

## 最终验证清单

- [ ] 所有项目通过 `yarn dev:frontend` 可运行
- [ ] **GitHub Projects** 任务状态已更新
- [ ] 根目录与子目录 `.gitignore` 规则生效
