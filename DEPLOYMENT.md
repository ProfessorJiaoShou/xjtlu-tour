# XJTLU Campus Tour - Vercel部署指南

## 🚀 快速部署

### 方法1: 通过Vercel CLI部署（推荐）

```bash
# 1. 安装Vercel CLI
pnpm i -g vercel

# 2. 登录Vercel
vercel login

# 3. 在项目根目录部署
cd c:\Users\wyf\Documents\office\cpt\333
vercel
```

### 方法2: 通过Vercel Dashboard部署

1. 访问 [https://vercel.com](https://vercel.com) 并登录
2. 点击 "Add New Project"
3. 选择 "Import Git Repository"
4. 连接你的Git仓库并选择此项目
5. Vercel会自动检测Vite配置并开始部署

## ⚙️ 环境变量配置

在Vercel Dashboard中设置以下环境变量：

- `VITE_AMAP_KEY`: `76098a9a85a43e2dd84ade8475cec962`
- `VITE_AMAP_SECURITY_CODE`: `84ce068129c5ca6c297cf65918adf524`

**设置步骤**：
1. 进入项目设置 → Environment Variables
2. 添加上述两个变量
3. 重新部署项目使变量生效

## 📋 部署前检查清单

- [ ] 本地构建成功：`pnpm run build`
- [ ] 所有功能正常工作
- [ ] 环境变量已配置
- [ ] API密钥已添加到高德开放平台白名单
- [ ] 响应式设计已测试

## 🔍 常见问题解决

### 构建失败
```bash
# 清理依赖重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 本地测试构建
pnpm run build
```

### 环境变量未生效
- 确保变量名以`VITE_`开头
- 重新部署项目
- 检查Vercel日志确认变量已加载

### 地图API无法访问
- 检查API密钥是否正确
- 确认域名已添加到高德开放平台白名单
- 检查网络连接

## 🚀 快速部署命令

```bash
# 一键部署（推荐）
vercel --prod

# 预览部署
vercel

# 查看部署状态
vercel ls
```

## 📊 部署监控

Vercel提供的监控功能：
1. **构建日志** - 查看构建过程和错误
2. **部署历史** - 查看所有部署记录
3. **性能分析** - 监控网站性能
4. **错误追踪** - 查看运行时错误

## 💡 最佳实践

### 部署前检查清单
- [ ] 本地构建成功
- [ ] 所有功能正常工作
- [ ] 环境变量已配置
- [ ] API密钥已添加到白名单
- [ ] 响应式设计已测试

### 持续集成
- 设置自动部署（Git push自动触发）
- 配置预览环境（PR自动部署预览）
- 设置部署通知

### 性能优化
- 使用CDN加速静态资源
- 启用图片懒加载
- 优化打包体积

## 🎯 项目特性

- ✅ 交互式校园地图（SVG + 高德地图）
- ✅ 360°全景查看器（支持陀螺仪）
- ✅ 地点详情和趣味知识
- ✅ 游戏化积分系统
- ✅ 响应式设计（桌面 + 移动端）
- ✅ 双地图模式切换

## 📞 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **包管理器**: pnpm
- **样式框架**: Tailwind CSS
- **地图服务**: 高德地图 JSAPI v2.0
- **全景查看**: Photo Sphere Viewer
- **部署平台**: Vercel

## 📞 联系支持

如有问题，请检查：
- Vercel部署日志
- 浏览器控制台错误
- 高德地图API文档

---
**部署成功后，你的应用将在 `https://your-project.vercel.app` 上线！**