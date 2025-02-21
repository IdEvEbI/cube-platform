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