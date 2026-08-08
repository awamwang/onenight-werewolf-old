# onenight-wolf

一夜终极狼人杀（Vue 3 + Vite）

## 技术栈

- Vue 3 + Vue Router 4 + Vuex 4
- Vite 6
- Vant 4（移动端 UI）
- Axios + Day.js

## 使用

```bash
# 复制环境配置
cp env.example.js env.js

# 安装依赖
npm install

# 开发（默认 http://localhost:8083）
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 构建模式

- `npm run build`：正式发布
- `npm run build-test`：测试 / CI
- `npm run build-release`：内部 / beta 发布

## Docker

```bash
docker build -f docker/Dockerfile -t onenight-werewolf .
docker run --rm -p 8080:80 onenight-werewolf
```

## 说明

+ `dev`：本地开发与热更新
+ `build*`：按 Vite mode 输出到 `dist`
