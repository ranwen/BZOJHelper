# BZOJ Helper

## 介绍

[BZOJ讨论地址](https://lydsy.com/JudgeOnline/wttl/thread.php?tid=6676)

[项目地址](https://github.com/ranwen/BZOJHelper)

[GreasyFork安装地址](https://greasyfork.org/zh-CN/scripts/372181-bzoj-helper)

### 目前功能

- 在status页面显示是否AC此题
- 在题目页面显示是否AC此题以及查看My Status
- 自动续命当前登录用户

注意：

- 为了方便，目前将所有链接均跳转至@
- 只有登录用户后才可实用
- 可在ModifyUser页面更改插件设置

- 每次访问其他用户(或自己)的主页都会更新数据



欢迎各位反馈bug,提出意见与建议



## 更新日志

### v0.2更新日志:
- 修复www匹配，增加表前缀(需手动更新数据)

### v1.0更新日志:
- 增加题目标记功能
- 增加自动续命功能(防止长时间未操作而自动登出)
- 将www跳转至@
- 可以在题目页面进行标记改动
- 可在Status和ProblemSet页面看到标记的题目(在ProblemSet页面内可单独列出)

### v1.1更新日志：
- 取消标记默认不弹窗

- 修复SPJ题无法加载脚本

### v1.2更新日志:
- 解决discuss脚本失效
- 增加设置功能(在ModifyUser页面)

### v1.3更新日志
- 增加自动续命，Status显示NY 设置

### v1.4更新日志

- 在Github发布
- 稍微整理了下源码
- 从Status更新AC列表
- 如果当前用户AC列表没有存储则自动获取

### v1.4.1更新日志

- 修复(似乎由于chrome版本问题造成的)多余空白字符的bug，由于本地无法复现固测试困难，如还有问题请反馈
- discuss页面增加顶部按钮

### v1.4.2更新日志

- 修复bug

### v1.5更新日志

- 自动从ProblemSet页面等更新用户AC题目
- 用户AC题目比较

### v1.5.1更新日志

- 修复BZOJ在无Notice时脚本失效问题(暂无条件测试有Notice时情况)

### v1.5.2更新日志

- 修复同时在多个页面Mark时部分失效问题

## TODO
- Discuss跳转楼层
- 题目笔记
- 完善设置
- 云同步
- 关注Discuss





另外对于云同步，大家有什么想法可以提issue/BZOJ讨论版讨论
使用bzoj帐号(cookies验证，安全性较欠)
使用独立帐号(安全性较好，较麻烦)


以及是否需要一个帐号多个同步库