module.exports = {
  devPort: 8083,
  backendUrl: 'http://localhost',
  // 启用自动构建的项目需要配置
  deploy: {
    jenkinsJobName: 'common_project'
  }
}
