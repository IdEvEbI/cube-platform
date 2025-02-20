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