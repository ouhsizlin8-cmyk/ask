# 体验调研问卷 · GitHub Pages 静态版

此目录可直接作为 GitHub Pages 的网站根目录上传。它保留问卷填写、截图切换、校验和答卷确认。填写人最后可下载一份 CSV 答卷；文件只保存在填写人的设备上，不会自动发送给问卷发起人。

## 上传步骤

1. 在 GitHub 新建仓库，例如 delivery-survey。
2. 把本目录内的 index.html、app.js、style.css、favicon.svg、.nojekyll 和整个 screens 文件夹上传到仓库根目录。不要只上传 ZIP 压缩包。
3. 在仓库的 Settings → Pages → Build and deployment 中选择 Deploy from a branch、main、/(root)，然后点击 Save。
4. 等待发布完成，在 Pages 设置里点击 Visit site。请使用不连接 VPN 的目标网络实测访问。

## 正式回收答卷前

当前下载方式需要填写人手动交回 CSV 文件。若需要点击“提交”后自动汇总到一个地方，仍需接入可从填写人网络访问的后台、数据库和仅发起人可查看的结果页。原站数据库中的历史答卷也不会自动出现在此静态版中。

页面中的产品截图会随网站公开，请在上传前确认可对外展示。
