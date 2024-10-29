// 项目配置文件
module.exports = {
  // 关闭eslint , 默认是true
  // lintOnSave: false

  // 配置反向代理, 解决请求时的跨域
  devServer: {
    port: 8068,
    proxy: {
      '/api': { // 只要是以 '/ajax' 开头的ajax请求都会自动加上 target 属性值
        target: 'https://shiyan520.cn',
        changeOrigin: true
      }
    }
  }
}
