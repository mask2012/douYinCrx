# douYinCrx


## 本地打开页面
chrome-extension://lkiggdibegobhgfokljeckoehpkoengg/popup.html 

## 获取用户指纹
https://github.com/fingerprintjs/fingerprintjs2

## 发送任务流程
1. pop内创建用户指纹uid，询问content是否为微信域名，并发送uid给background
2. 发现如果是微信域名，则展示转换按钮
3. 用户点击按钮则记录当前页的url，标题，cookie到chrome存储，并跳转到抖音等待用户登录
4. 监测到用户登录抖音后弹整屏窗让用户确认，
5. 确认后则从chrome存储中读出之前存好的字段，发命令到background创建任务（content页无法发请求因为跨域了），并抹除存储的title字段（弹框需要判断title字段不为空）
6. background收到命令则结合之前收到的uid发送请求给后台，创建成功

