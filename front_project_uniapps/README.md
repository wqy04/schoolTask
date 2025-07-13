# 开发注意事项

## 安装、运行

```
pnpm i
pnpm dev

pnpm dev:mp-weixin  这是小程序
其他平台用到了再给你说
```

## 代码块

```
在 vue 文件中，输入 v3 按 tab 即可快速生成页面模板，可以大大加快页面生成

若代码里面自动引入的 API 报错，只需要 pnpm dev 即可。
若代码运行后，H5端 浏览器界面底部没有 tabbar， 刷新浏览器或者再次 pnpm dev 即可。
```

## 动态路由 - 引入了动态路由支持, 简写uniapp代码, 方便快速开发

```
动态路由写在vue文件中即可,类似如下
<route lang="json5">
{
  layout: 'demo',
  style: {
    navigationBarTitleText: '标题1',
  },
}
</route>

具体引用开源项目为
@uni-helper/vite-plugin-uni-pages  ，让你可以直接在本文件就能设置页面的路元信息，无需跑去 pages.json 配置，同时支持 pages.config.ts 编写 pages.json

@uni-helper/vite-plugin-uni-layouts  支多种 layouts 布局，群友脑洞大开，充分利用这个特性实现平时不容实现的写法

@uni-helper/vite-plugin-uni-manifest  支持 manifest.config.ts 编写 manifest.json

```

## 样式说明

### 项目集成了2025年最优秀火爆的的css框架 tailwindcss 和 unocss

```
以后没事别在代码里写样式
下面2个文档基本一直, 喜欢用哪个都行 (别给我说你看不懂英文)
unocss 原子类文档 https://unocss.dev/interactive/
tailwindcss 原子类文档 https://tailwindcss.com/

-- 常用的原子类
宽高内外边距： w-2, h-4, px-6, mt-8等
前景色背景色：text-green-400, bg-green-500
border: border-2, border-solid, border-green-600, b-r-2 (注意 border = border-1，就是说边框 1px 时，一般简写为 border )
border-radius: rounded-full, rounded-6, rounded-sm (不是 br-10, 也不是 b-r-10)
line-height: leading-10 (不是 l-10, 也不是 lh-10)
hover: hover:text-green-200, hover:bg-green-300, hover:border-dashed
flex: flex, items-center, justify-center, flex-1
```

## 设计稿尺寸说明

```
如果有设计稿，通常使用传统的编写 CSS 的方式，里面的对应尺寸规律如下。以即时设计为例，假如设计稿宽度为 750px，则直接复制样式代码到 css 代码，同时把 px 批量替换为 rpx 即可。

如果设计稿不是 750px 可以调整设计稿的设置，让设计稿宽度为 750px。

元素 A 在设计稿上的宽度为 100px，则写 w-100rpx 即可。
```

## 图标使用

```
图标支持 wot-ui的图标 网址 : https://wot-design-uni.netlify.app/component/icon.html  例子:
<wd-icon name="add-circle"></wd-icon>
<wd-icon name="add-circle" color="red"></wd-icon>
<wd-icon name="add-circle" class="text-green"></wd-icon>
<wd-icon name="add-circle" class="text-green" color="red"></wd-icon>


还支持iconify 图标库, 图标库 https://icones.js.org/ ,搜索 carbon  例子:
<view class="i-carbon-user-avatar text-red" />

可以扩展iconify图标库,例子. 没事尽量不要去扩展几千个图标总有一个适合你, 需要扩展汇报上级

在使用 iconify 之前需要安装对应的图标库，安装格式如下：
pnpm i -D @iconify-json/[the-collection-you-want]
以安装 carbon 为例，执行 pnpm i -D @iconify-json/carbon 即可。

```

## 组件库 组件库使用 Wot Design Uni (wot 系)

```
网址 :  https://wot-design-uni.netlify.app/
```

## 占位随机图片

```
随机图片
如果想生成某个宽高的随机图片，可以使用 https://picsum.photos。
格式如：https://picsum.photos/<width>/<height>?random=1
代码编写举例：
<image src="https://picsum.photos/400/200?random=1"></image>


色块占位图
下面是一个 400x200 - 宽高，3c9cff - 背景颜色，fff - 文本颜色 的色块占位图。
<image src="https://via.placeholder.com/400x200.png/3c9cff/fff"></image>
```

## 接口请求

```
同步请求方法

注意 : 接口写在
http.api.ts 文件内

 const req = await uni.$api.base.login({
    username: '123',
    password: '2222',
  })


异步请求方法
uni.$api.base
  .login({
    username: '123',
    password: '2222',
  })
.then((res) => {
  console.log(222)
  console.log(res)
})

ajax请求使用的组件是 luch-request ,具体可以看文档
https://www.quanzhan.co/luch-request/guide/3.x/#example

```

## 常见问题

```
1. 如何设置/修改首页？
vue 文件的 route-block 块里面设置 type="home" 即可，请确保项目里面 只有一个页面 是这个配置。

注意：如果有多个，会按照字母顺序排列，第一个是首页。（可能不是您的想要的效果。）


2. 修改 pages.json、manifest.json 被覆盖问题
pages.json
本项目引入了 @uni-helper/vite-plugin-uni-pages，pages.json 文件将会自动生成，手动修改 pages.json 将会被覆盖。

全局的东西请在 pages.config.ts 里面配置，页面的东西请在 vue 文件的 route-block 配置。

manifest.json
与上面类似。本项目引入了 @uni-helper/vite-plugin-uni-manifest，manifest.json 文件将会自动生成，手动修改 manifest.json 将会被覆盖。

如需修改，请在 manifest.config.ts 里面修改。


3. uni-app 无法使用 process.env 变量，怎么办？
使用 import.meta.env 替代！



4.如何把已经加入 git 管理的文件移出 git 管理?
第一步，先把文件移出git 管理，操作如下：

# git rm -r --cached file1 file2  ## 针对某些文件
# git rm -r --cached dir1 dir2  ## 针对某些文件夹
# git rm -r --cached .  ## 针对所有文件
第二步，提交 commit 以正式删除的文件
总结：git rm -r --cached . + git commit 即可。
```

## git提交问题 -- 这里面的方法没事别用,别用,别用,别用,别用,别用,别用,

```
项目内有代码格式检查, 错误的代码格式或者问题是不允许提交的. 特殊情况向领导请示后再看下面的方法

git commit 报错。
请看 commitlint.config.ts 里面的配置，需要满足对应的设定。根据自己的需要，可以修改 commitlint.config.ts 里面的配置。

如果是一次的（比如引入了某个第三方库），可以通过 --no-verify 参数跳过校验：


git commit -m "feat: xxx" --no-verify
第三方库还有另外一种处理方式，放到特定的文件夹，然后在 .eslintignore 和 .styleintignore 里面加上该文件夹。

6. 不想要严格的 git 提交检测，怎么办？
直接把 .husky 这个文件删掉即可。(或者不删除，只把里面的文件内容注释掉。)

```
