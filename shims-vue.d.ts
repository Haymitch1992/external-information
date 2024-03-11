// 这个声明是在ts项目中使用了js，编译报警any类型。
// ex:Could not find a declaration file for module ''. '' implicitly has an 'any' type.
// 在src新建 shims-vue.d.ts 文件，并填写以下内容即可
declare module '*.js'
declare module '*.json'
declare module '*.png'
declare module '*.svg'

declare module '@amap/amap-jsapi-loader'

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}

// TypeScript 扩展全局 Window 时报错的解决
// 需要将自定义变量扩展到全局 window 上，可通过在项目中添加类型文件或正常的 .ts 文件，只要在 tsconfig.json 配置范围内能找到即可
// 配置完重启IED
interface Window {
  formatDateTime: any
  _AMapSecurityConfig: any
  bMapTransQQMap: any
  qqMapTransBMap: any
  gaodeEvent: any
}
