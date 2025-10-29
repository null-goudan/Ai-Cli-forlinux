## Ai-Cli-forlinux
<img width="1716" height="490" alt="无标题" src="https://github.com/user-attachments/assets/cae51d7f-5ad2-4d43-b287-93caeb2f7daf" />

### 灵感
灵感来源于 Copilot CLI https://github.com/features/copilot/cli
### 介绍
希望能够使AI和OS结合，一款用于Linux终端的Shell辅助Ai， 将自然语言处理成shell脚本，并可以选择应用
### 安装
```shell
git clone https://github.com/null-goudan/Ai-Cli-forlinux.git
cd Ai-Cli-forlinux
npm i
npm run start # 可以这样启动文件
npm link # 主要是应用ai 以及 ai-cli命令到本机的环境中 以此达到所有终端直接使用
```
### 使用
```shell
ai-cli "我要删除本文件夹中的第一个文件"
```
```shell
ai "我要删除本文件夹中的第一个文件"
```
### 配置
```shell
ai-cli config
```
此命令会进入一个配置页面进行配置base url以及openai key
### 说明
本项目使用了TypeScript，使用i18n转换了18种语言，可以无缝从中文和英文以及支持的语言中切换（使用 ai config 进行配置）。使用了openai库，故支持所有支持openai接口协议的所有平台（由于openai的影响力很大，理论上是支持主流平台的）。倘若不想使用主流平台的花费，ollama同样支持openai的方式，参照ollama官方文档[https://ollama.com/blog/openai-compatibility]

### 使用本地部署
主要使用ollama进行部署，然后使用端口，配置base url为 http://localhost:11434/v1/ 即可，实际ollama中可以不使用key，故key配置时使用ollama即可
