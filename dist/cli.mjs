#!/usr/bin/env node
import { command, cli } from 'cleye';
import { dim, red, cyan } from 'kolorist';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import ini from 'ini';
import * as p from '@clack/prompts';
import { intro } from '@clack/prompts';
import i18next from 'i18next';
import { createRequire } from 'module';
import { OpenAIApi, Configuration } from 'openai';
import dedent from 'dedent';
import { IncomingMessage } from 'http';
import readline from 'readline';
import { execaCommand } from 'execa';
import clipboardy from 'clipboardy';
import fs$1 from 'fs';

var version = "1.0.0";

const commandName = "ai-cli";
const projectName = "Ai Cli For Linux";

class KnownError extends Error {
}
const indent = " ".repeat(4);
const handleCliError = (error) => {
  if (error instanceof Error && !(error instanceof KnownError)) {
    if (error.stack) {
      console.error(dim(error.stack.split("\n").slice(1).join("\n")));
    }
    console.error(`
${indent}${dim(`ai-shell v${version}`)}`);
    console.error(
      `
${indent}${"Please open a Bug report with the information above"}:`
    );
    console.error(`${indent}https://github.com/null-goudan/Ai-Cli-forlinux/issues/new`);
  }
};

var Model$c = "模型";
var Language$c = "语言";
var Explanation$c = "解释";
var Yes$c = "是";
var Edit$c = "编辑";
var Revise$c = "修改";
var Copy$c = "复制";
var Cancel$c = "取消";
var Running$c = "正在运行";
var You$c = "您";
var zhHansTranslation = {
	"Starting new conversation": "开始新的对话",
	"Goodbye!": "再见！",
	"send a message ('exit' to quit)": "发送消息（'exit' 退出）",
	"Please enter a prompt.": "请输入提示语",
	"THINKING...": "思考中...",
	"Please set your OpenAI API key via `ai config set OPENAI_KEY=<your token>`": "请通过 `ai config set OPENAI_KEY=<your token>` 设置您的 OpenAI API 密钥",
	"Set config": "设置配置",
	"Enter your OpenAI API key": "输入您的 OpenAI API 密钥",
	"(not set)": "(未设置)",
	"OpenAI Key": "OpenAI 密钥",
	"Please enter a key": "请输入密钥",
	"OpenAI API Endpoint": "OpenAI API 端点",
	"Enter your OpenAI API Endpoint": "输入您的 OpenAI API 端点",
	"Silent Mode": "静默模式",
	"Enable silent mode?": "启用静默模式？",
	Model: Model$c,
	"Enter the model you want to use": "输入您想要使用的模型",
	Language: Language$c,
	"Enter the language you want to use": "输入您想要使用的语言",
	"What would you like me to do?": "您想让我做什么？",
	"delete all log files": "删除所有日志文件",
	"list js files": "列出 js 文件",
	"fetch me a random joke": "随便给我讲个笑话",
	"list all commits": "列出所有提交",
	"Say hello": "打个招呼",
	"you can edit script here": "您可以在这里编辑脚本",
	"What would you like me to change in this script?": "您想让我在这个脚本中做什么修改？",
	"e.g.": "例如:",
	"e.g. change the folder name": "例如：更改文件夹名称",
	"Your script": "您的脚本",
	"Loading...": "加载中...",
	"Getting explanation...": "获取解释中...",
	Explanation: Explanation$c,
	"Run this script?": "运行这个脚本？",
	"Revise this script?": "修改这个脚本？",
	Yes: Yes$c,
	"Lets go!": "开始运行吧！",
	Edit: Edit$c,
	"Make some adjustments before running": "在运行之前进行一些调整",
	Revise: Revise$c,
	"Give feedback via prompt and get a new result": "通过提示提供反馈并获得新结果",
	Copy: Copy$c,
	"Copy the generated script to your clipboard": "将生成的脚本复制到剪贴板",
	Cancel: Cancel$c,
	"Exit the program": "退出程序",
	Running: Running$c,
	"Copied to clipboard!": "已复制到剪贴板！",
	"Your new script": "您的新脚本",
	"Invalid config property": "无效的配置属性",
	"Shell detection failed unexpectedly": "Shell 检测到意外失败",
	"Invalid model": "无效的模型",
	"Error": "错误",
	"Missing required parameter": "缺少必需的参数",
	"Please open a Bug report with the information above": "请使用上面的信息打开 Bug 报告",
	"Prompt to run": "要运行的提示语",
	You: You$c
};

var Model$b = "模型";
var Language$b = "語言";
var Explanation$b = "解釋";
var Yes$b = "是";
var Edit$b = "編輯";
var Revise$b = "修改";
var Copy$b = "複製";
var Cancel$b = "取消";
var Running$b = "正在運行";
var You$b = "您";
var zhHantTranslation = {
	"Starting new conversation": "開始新的對話",
	"Goodbye!": "再見！",
	"send a message ('exit' to quit)": "發送消息（'exit' 退出）",
	"Please enter a prompt.": "請輸入提示語",
	"THINKING...": "思考中...",
	"Please set your OpenAI API key via `ai config set OPENAI_KEY=<your token>`": "請藉由 `ai config set OPENAI_KEY=<your token>` 設定您的 OpenAI API 密鑰",
	"Set config": "設置配置",
	"Enter your OpenAI API key": "輸入您的 OpenAI API 密鑰",
	"(not set)": "（未設置）",
	"OpenAI Key": "OpenAI 密鑰",
	"Please enter a key": "請輸入密鑰",
	"OpenAI API Endpoint": "OpenAI API 端點",
	"Enter your OpenAI API Endpoint": "輸入您的 OpenAI API 端點",
	"Silent Mode": "靜默模式",
	"Enable silent mode?": "啟用靜默模式？",
	Model: Model$b,
	"Enter the model you want to use": "輸入您想要使用的模型",
	Language: Language$b,
	"Enter the language you want to use": "輸入您想要使用的語言",
	"What would you like me to do?": "您想讓我做什麼？",
	"delete all log files": "刪除所有日誌文件",
	"list js files": "列出 js 文件",
	"fetch me a random joke": "隨便給我講個笑話",
	"list all commits": "列出所有提交",
	"Say hello": "打個招呼",
	"you can edit script here": "您可以在這裡編輯腳本",
	"What would you like me to change in this script?": "您想讓我在這個腳本中做什麼修改？",
	"e.g.": "例如:",
	"e.g. change the folder name": "例如：更改文件夾名稱",
	"Your script": "您的腳本",
	"Loading...": "加載中...",
	"Getting explanation...": "獲取解釋中...",
	Explanation: Explanation$b,
	"Run this script?": "運行這個腳本？",
	"Revise this script?": "修改這個腳本？",
	Yes: Yes$b,
	"Lets go!": "開始運行吧！",
	Edit: Edit$b,
	"Make some adjustments before running": "在運行之前進行一些調整",
	Revise: Revise$b,
	"Give feedback via prompt and get a new result": "通過提示提供回饋並獲得新結果",
	Copy: Copy$b,
	"Copy the generated script to your clipboard": "將生成的腳本複製到剪貼簿",
	Cancel: Cancel$b,
	"Exit the program": "退出程序",
	Running: Running$b,
	"Copied to clipboard!": "已複製到剪貼簿！",
	"Your new script": "您的新腳本",
	"Invalid config property": "無效的配置屬性",
	"Shell detection failed unexpectedly": "Shell 檢測到意外失敗",
	"Invalid model": "無效的模型",
	"Error": "錯誤",
	"Missing required parameter": "缺少必需的參數",
	"Please open a Bug report with the information above": "請使用上面的訊息打開 Bug 報告",
	"Prompt to run": "要運行的提示語",
	You: You$b
};

var Model$a = "Modelo";
var Language$a = "Idioma";
var Explanation$a = "Explicación";
var Yes$a = "Sí";
var Edit$a = "Editar";
var Revise$a = "Revisar";
var Copy$a = "Copiar";
var Cancel$a = "Cancelar";
var Running$a = "Ejecutando";
var You$a = "Tú";
var esTranslation = {
	"Starting new conversation": "Comenzando nueva conversación",
	"Goodbye!": "¡Adiós!",
	"send a message ('exit' to quit)": "enviar un mensaje ('exit' para salir)",
	"Please enter a prompt.": "Por favor ingrese un indicio.",
	"THINKING...": "PENSANDO...",
	"Please set your OpenAI API key via `ai config set OPENAI_KEY=<your token>`": "Por favor configure su clave de API de OpenAI a través de `ai config set OPENAI_KEY=<your token>`",
	"Set config": "Configuración",
	"Enter your OpenAI API key": "Ingrese su clave de API de OpenAI",
	"(not set)": "(no establecido)",
	"OpenAI Key": "Clave de OpenAI",
	"Please enter a key": "Por favor ingrese una clave",
	"OpenAI API Endpoint": "Punto final de la API de OpenAI",
	"Enter your OpenAI API Endpoint": "Ingrese su punto final de API de OpenAI",
	"Silent Mode": "Modo silencioso",
	"Enable silent mode?": "¿Habilitar el modo silencioso?",
	Model: Model$a,
	"Enter the model you want to use": "Ingrese el modelo que desea utilizar",
	Language: Language$a,
	"Enter the language you want to use": "Ingrese el idioma que desea utilizar",
	"What would you like me to do?": "¿Qué te gustaría que hiciera?",
	"delete all log files": "eliminar todos los archivos de registro",
	"list js files": "listar archivos js",
	"fetch me a random joke": "traerme una broma aleatoria",
	"list all commits": "listar todos los commits",
	"Say hello": "Decir hola",
	"you can edit script here": "puede editar el script aquí",
	"What would you like me to change in this script?": "¿Qué te gustaría cambiar en este script?",
	"e.g.": "por ejemplo",
	"e.g. change the folder name": "por ejemplo, cambie el nombre de la carpeta",
	"Your script": "Tu script",
	"Loading...": "Cargando...",
	"Getting explanation...": "Obteniendo explicación...",
	Explanation: Explanation$a,
	"Run this script?": "¿Ejecutar este script?",
	"Revise this script?": "¿Revisar este script?",
	Yes: Yes$a,
	"Lets go!": "¡Vamos!",
	Edit: Edit$a,
	"Make some adjustments before running": "Haga algunos ajustes antes de ejecutar",
	Revise: Revise$a,
	"Give feedback via prompt and get a new result": "Dé su opinión a través del indicio y obtenga un nuevo resultado",
	Copy: Copy$a,
	"Copy the generated script to your clipboard": "Copie el script generado en su portapapeles",
	Cancel: Cancel$a,
	"Exit the program": "Salir del programa",
	Running: Running$a,
	"Copied to clipboard!": "¡Copiado al portapapeles!",
	"Your new script": "Tu nuevo script",
	"Invalid config property": "Propiedad de configuración no válida",
	"Shell detection failed unexpectedly": "La detección de shell falló inesperadamente",
	"Invalid model": "Modelo no válido",
	"Error": "Error",
	"Missing required parameter": "Falta el parámetro requerido",
	"Please open a Bug report with the information above": "Por favor abra un informe de error con la información anterior",
	"Prompt to run": "Indicio para ejecutar",
	You: You$a
};

var Model$9 = "モデル";
var Language$9 = "言語";
var Explanation$9 = "説明";
var Yes$9 = "はい";
var Edit$9 = "編集";
var Revise$9 = "修正";
var Copy$9 = "コピー";
var Cancel$9 = "キャンセル";
var Running$9 = "実行中";
var You$9 = "あなた";
var jpTranslation = {
	"Starting new conversation": "新しい会話を開始する",
	"Goodbye!": "さようなら！",
	"send a message ('exit' to quit)": "メッセージを送信する（終了するには 'exit'）",
	"Please enter a prompt.": "プロンプトを入力してください。",
	"THINKING...": "考え中...",
	"Please set your OpenAI API key via `ai config set OPENAI_KEY=<your token>`": "OpenAI APIキーを `ai config set OPENAI_KEY=<your token>` で設定してください",
	"Set config": "設定",
	"Enter your OpenAI API key": "OpenAI APIキーを入力してください",
	"(not set)": "(未設定)",
	"OpenAI Key": "OpenAIキー",
	"Please enter a key": "キーを入力してください",
	"OpenAI API Endpoint": "OpenAI APIエンドポイント",
	"Enter your OpenAI API Endpoint": "OpenAI APIエンドポイントを入力してください",
	"Silent Mode": "サイレントモード",
	"Enable silent mode?": "サイレントモードを有効にしますか？",
	Model: Model$9,
	"Enter the model you want to use": "使用するモデルを入力してください",
	Language: Language$9,
	"Enter the language you want to use": "使用する言語を入力してください",
	"What would you like me to do?": "何をしてほしいですか？",
	"delete all log files": "すべてのログファイルを削除する",
	"list js files": "jsファイルをリストアップする",
	"fetch me a random joke": "ランダムなジョークを取得する",
	"list all commits": "すべてのコミットをリストアップする",
	"Say hello": "こんにちは",
	"you can edit script here": "ここでスクリプトを編集できます",
	"What would you like me to change in this script?": "このスクリプトで何を変更したいですか？",
	"e.g.": "例：",
	"e.g. change the folder name": "例：フォルダ名を変更する",
	"Your script": "あなたのスクリプト",
	"Loading...": "読み込み中...",
	"Getting explanation...": "説明を取得中...",
	Explanation: Explanation$9,
	"Run this script?": "このスクリプトを実行しますか？",
	"Revise this script?": "このスクリプトを修正しますか？",
	Yes: Yes$9,
	"Lets go!": "始めましょう！",
	Edit: Edit$9,
	"Make some adjustments before running": "実行前に調整を行う",
	Revise: Revise$9,
	"Give feedback via prompt and get a new result": "プロンプトを介してフィードバックを提供し、新しい結果を取得する",
	Copy: Copy$9,
	"Copy the generated script to your clipboard": "生成されたスクリプトをクリップボードにコピーする",
	Cancel: Cancel$9,
	"Exit the program": "プログラムを終了する",
	Running: Running$9,
	"Copied to clipboard!": "クリップボードにコピーしました！",
	"Your new script": "あなたの新しいスクリプト",
	"Invalid config property": "無効な設定プロパティ",
	"Shell detection failed unexpectedly": "シェルの検出が予期せず失敗しました",
	"Invalid model": "無効なモデル",
	"Error": "エラー",
	"Missing required parameter": "必要なパラメーターがありません",
	"Please open a Bug report with the information above": "上記の情報を含めてバグレポートを開いてください",
	"Prompt to run": "実行するプロンプト",
	You: You$9
};

var Model$8 = "모델";
var Language$8 = "언어";
var Explanation$8 = "설명";
var Yes$8 = "예";
var Edit$8 = "편집";
var Revise$8 = "수정";
var Copy$8 = "복사";
var Cancel$8 = "취소";
var Running$8 = "실행 중";
var You$8 = "당신";
var koTranslation = {
	"Starting new conversation": "새 대화 시작",
	"Goodbye!": "안녕!",
	"send a message ('exit' to quit)": "메시지 보내기 ('exit' 입력 시 종료)",
	"Please enter a prompt.": "프롬프트를 입력하세요.",
	"THINKING...": "생각 중...",
	"Please set your OpenAI API key via `ai config set OPENAI_KEY=<your token>`": "OpenAI API 키를 `ai config set OPENAI_KEY=<your token>`으로 설정하세요.",
	"Set config": "설정",
	"Enter your OpenAI API key": "OpenAI API 키를 입력하세요.",
	"(not set)": "(설정되지 않음)",
	"OpenAI Key": "OpenAI 키",
	"Please enter a key": "키를 입력하세요.",
	"OpenAI API Endpoint": "OpenAI API 엔드포인트",
	"Enter your OpenAI API Endpoint": "OpenAI API 엔드포인트를 입력하세요.",
	"Silent Mode": "조용한 모드",
	"Enable silent mode?": "조용한 모드를 활성화하시겠습니까?",
	Model: Model$8,
	"Enter the model you want to use": "사용하려는 모델을 입력하세요.",
	Language: Language$8,
	"Enter the language you want to use": "사용하려는 언어를 입력하세요.",
	"What would you like me to do?": "무엇을 도와드릴까요?",
	"delete all log files": "모든 로그 파일 삭제",
	"list js files": "js 파일 목록",
	"fetch me a random joke": "랜덤한 농담 가져오기",
	"list all commits": "모든 커밋 목록",
	"Say hello": "인사하기",
	"you can edit script here": "여기서 스크립트를 편집할 수 있습니다.",
	"What would you like me to change in this script?": "이 스크립트에서 무엇을 변경하시겠습니까?",
	"e.g.": "예시:",
	"e.g. change the folder name": "예시: 폴더 이름 변경",
	"Your script": "스크립트",
	"Loading...": "로딩 중...",
	"Getting explanation...": "설명 가져오는 중...",
	Explanation: Explanation$8,
	"Run this script?": "이 스크립트를 실행하시겠습니까?",
	"Revise this script?": "이 스크립트를 수정하시겠습니까?",
	Yes: Yes$8,
	"Lets go!": "시작!",
	Edit: Edit$8,
	"Make some adjustments before running": "실행 전에 일부 조정을 하세요.",
	Revise: Revise$8,
	"Give feedback via prompt and get a new result": "프롬프트를 통해 피드백을 제공하고 새 결과를 얻으세요.",
	Copy: Copy$8,
	"Copy the generated script to your clipboard": "생성된 스크립트를 클립보드에 복사하세요.",
	Cancel: Cancel$8,
	"Exit the program": "프로그램 종료",
	Running: Running$8,
	"Copied to clipboard!": "클립보드에 복사됨!",
	"Your new script": "새 스크립트",
	"Invalid config property": "잘못된 구성 속성",
	"Shell detection failed unexpectedly": "쉘 감지가 예기치 않게 실패했습니다.",
	"Invalid model": "잘못된 모델",
	"Error": "오류",
	"Missing required parameter": "필수 매개변수가 누락되었습니다.",
	"Please open a Bug report with the information above": "위 정보를 포함하여 버그 보고서를 열어주세요.",
	"Prompt to run": "실행할 프롬프트",
	You: You$8
};

var Model$7 = "Modèle";
var Language$7 = "Langue";
var Explanation$7 = "Explication";
var Yes$7 = "Oui";
var Edit$7 = "Modifier";
var Revise$7 = "Réviser";
var Copy$7 = "Copier";
var Cancel$7 = "Annuler";
var Running$7 = "En cours d'exécution";
var You$7 = "Vous";
var frTranslation = {
	"Starting new conversation": "Démarrer une nouvelle conversation",
	"Goodbye!": "Au revoir!",
	"send a message ('exit' to quit)": "envoyer un message ('exit' pour quitter)",
	"Please enter a prompt.": "Veuillez entrer une invite.",
	"THINKING...": "EN RÉFLEXION...",
	"Please set your OpenAI API key via `ai config set OPENAI_KEY=<your token>`": "Veuillez définir votre clé API OpenAI via `ai config set OPENAI_KEY=<your token>`",
	"Set config": "Configurer",
	"Enter your OpenAI API key": "Entrez votre clé API OpenAI",
	"(not set)": "(non défini)",
	"OpenAI Key": "Clé OpenAI",
	"Please enter a key": "Veuillez entrer une clé",
	"OpenAI API Endpoint": "Point de terminaison de l'API OpenAI",
	"Enter your OpenAI API Endpoint": "Entrez votre point de terminaison d'API OpenAI",
	"Silent Mode": "Mode silencieux",
	"Enable silent mode?": "Activer le mode silencieux?",
	Model: Model$7,
	"Enter the model you want to use": "Entrez le modèle que vous souhaitez utiliser",
	Language: Language$7,
	"Enter the language you want to use": "Entrez la langue que vous souhaitez utiliser",
	"What would you like me to do?": "Que voulez-vous que je fasse?",
	"delete all log files": "supprimer tous les fichiers journaux",
	"list js files": "liste des fichiers js",
	"fetch me a random joke": "apporte-moi une blague aléatoire",
	"list all commits": "liste de tous les engagements",
	"Say hello": "Dire bonjour",
	"you can edit script here": "vous pouvez éditer le script ici",
	"What would you like me to change in this script?": "Que voulez-vous que je change dans ce script?",
	"e.g.": "par exemple",
	"e.g. change the folder name": "par exemple, changer le nom du dossier",
	"Your script": "Votre script",
	"Loading...": "Chargement...",
	"Getting explanation...": "Obtenir une explication...",
	Explanation: Explanation$7,
	"Run this script?": "Exécuter ce script?",
	"Revise this script?": "Réviser ce script?",
	Yes: Yes$7,
	"Lets go!": "Allons-y!",
	Edit: Edit$7,
	"Make some adjustments before running": "Faites quelques ajustements avant de lancer",
	Revise: Revise$7,
	"Give feedback via prompt and get a new result": "Donnez votre avis via une invite et obtenez un nouveau résultat",
	Copy: Copy$7,
	"Copy the generated script to your clipboard": "Copiez le script généré dans votre presse-papiers",
	Cancel: Cancel$7,
	"Exit the program": "Quitter le programme",
	Running: Running$7,
	"Copied to clipboard!": "Copié dans le presse-papiers!",
	"Your new script": "Votre nouveau script",
	"Invalid config property": "Propriété de configuration non valide",
	"Shell detection failed unexpectedly": "La détection de la coquille a échoué de manière inattendue",
	"Invalid model": "Modèle invalide",
	"Error": "Erreur",
	"Missing required parameter": "Paramètre requis manquant",
	"Please open a Bug report with the information above": "Veuillez ouvrir un rapport de bogue avec les informations ci-dessus",
	"Prompt to run": "Invite pour exécuter",
	You: You$7
};

var Model$6 = "Modell";
var Language$6 = "Sprache";
var Explanation$6 = "Erklärung";
var Yes$6 = "Ja";
var Edit$6 = "Bearbeiten";
var Revise$6 = "Überarbeiten";
var Copy$6 = "Kopieren";
var Cancel$6 = "Abbrechen";
var Running$6 = "Läuft";
var You$6 = "Sie";
var deTranslation = {
	"Starting new conversation": "Neues Gespräch beginnen",
	"Goodbye!": "Auf Wiedersehen!",
	"send a message ('exit' to quit)": "Nachricht senden ('exit' zum Beenden)",
	"Please enter a prompt.": "Bitte geben Sie eine Aufforderung ein.",
	"THINKING...": "DENKEN...",
	"Please set your OpenAI API key via `ai config set OPENAI_KEY=<your token>`": "Bitte setzen Sie Ihren OpenAI-API-Schlüssel über `ai config set OPENAI_KEY=<your token>`",
	"Set config": "Konfiguration setzen",
	"Enter your OpenAI API key": "Geben Sie Ihren OpenAI-API-Schlüssel ein",
	"(not set)": "(nicht gesetzt)",
	"OpenAI Key": "OpenAI-Schlüssel",
	"Please enter a key": "Bitte geben Sie einen Schlüssel ein",
	"OpenAI API Endpoint": "OpenAI-API-Endpunkt",
	"Enter your OpenAI API Endpoint": "Geben Sie Ihren OpenAI-API-Endpunkt ein",
	"Silent Mode": "Leiser Modus",
	"Enable silent mode?": "Leisen Modus aktivieren?",
	Model: Model$6,
	"Enter the model you want to use": "Geben Sie das Modell ein, das Sie verwenden möchten",
	Language: Language$6,
	"Enter the language you want to use": "Geben Sie die Sprache ein, die Sie verwenden möchten",
	"What would you like me to do?": "Was möchten Sie, dass ich tue?",
	"delete all log files": "Löschen Sie alle Protokolldateien",
	"list js files": "Liste js-Dateien auf",
	"fetch me a random joke": "Holen Sie mir einen zufälligen Witz",
	"list all commits": "Liste alle Commits auf",
	"Say hello": "Sag Hallo",
	"you can edit script here": "Sie können das Skript hier bearbeiten",
	"What would you like me to change in this script?": "Was möchten Sie in diesem Skript ändern?",
	"e.g.": "z.B.",
	"e.g. change the folder name": "z.B. Ändern Sie den Ordnernamen",
	"Your script": "Ihr Skript",
	"Loading...": "Wird geladen...",
	"Getting explanation...": "Erklärung bekommen...",
	Explanation: Explanation$6,
	"Run this script?": "Dieses Skript ausführen?",
	"Revise this script?": "Dieses Skript überarbeiten?",
	Yes: Yes$6,
	"Lets go!": "Los geht's!",
	Edit: Edit$6,
	"Make some adjustments before running": "Machen Sie einige Anpassungen, bevor Sie es ausführen",
	Revise: Revise$6,
	"Give feedback via prompt and get a new result": "Geben Sie Feedback über die Eingabeaufforderung und erhalten Sie ein neues Ergebnis",
	Copy: Copy$6,
	"Copy the generated script to your clipboard": "Kopieren Sie das generierte Skript in die Zwischenablage",
	Cancel: Cancel$6,
	"Exit the program": "Programm beenden",
	Running: Running$6,
	"Copied to clipboard!": "In die Zwischenablage kopiert!",
	"Your new script": "Ihr neues Skript",
	"Invalid config property": "Ungültige Konfigurationseigenschaft",
	"Shell detection failed unexpectedly": "Shell-Erkennung fehlgeschlagen",
	"Invalid model": "Ungültiges Modell",
	"Error": "Fehler",
	"Missing required parameter": "Fehlender erforderlicher Parameter",
	"Please open a Bug report with the information above": "Bitte öffnen Sie einen Fehlerbericht mit den oben genannten Informationen",
	"Prompt to run": "Aufforderung zum Ausführen",
	You: You$6
};

var Model$5 = "Модель";
var Language$5 = "Язык";
var Explanation$5 = "Объяснение";
var Yes$5 = "Да";
var Edit$5 = "Редактировать";
var Revise$5 = "Пересмотреть";
var Copy$5 = "Копировать";
var Cancel$5 = "Отмена";
var Running$5 = "Запуск";
var You$5 = "Вы";
var ruTranslation = {
	"Starting new conversation": "Начало нового разговора",
	"Goodbye!": "До свидания!",
	"send a message ('exit' to quit)": "отправить сообщение ('выход' для выхода)",
	"Please enter a prompt.": "Пожалуйста, введите запрос.",
	"THINKING...": "ДУМАЮ...",
	"Please set your OpenAI API key via `ai config set OPENAI_KEY=<your token>`": "Пожалуйста, установите свой ключ OpenAI API через `ai config set OPENAI_KEY=<your token>`",
	"Set config": "Установить конфигурацию",
	"Enter your OpenAI API key": "Введите ваш ключ OpenAI API",
	"(not set)": "(не установлено)",
	"OpenAI Key": "Ключ OpenAI",
	"Please enter a key": "Пожалуйста, введите ключ",
	"OpenAI API Endpoint": "Конечная точка OpenAI API",
	"Enter your OpenAI API Endpoint": "Введите конечную точку OpenAI API OpenAI",
	"Silent Mode": "Тихий режим",
	"Enable silent mode?": "Включить тихий режим?",
	Model: Model$5,
	"Enter the model you want to use": "Введите модель, которую вы хотите использовать",
	Language: Language$5,
	"Enter the language you want to use": "Введите язык, который вы хотите использовать",
	"What would you like me to do?": "Что бы вы хотели, чтобы я сделал?",
	"delete all log files": "удалить все файлы журналов",
	"list js files": "список js файлов",
	"fetch me a random joke": "получить случайную шутку",
	"list all commits": "список всех коммитов",
	"Say hello": "Скажи привет",
	"you can edit script here": "вы можете редактировать скрипт здесь",
	"What would you like me to change in this script?": "Что бы вы хотели изменить в этом скрипте?",
	"e.g.": "например",
	"e.g. change the folder name": "например, изменить имя папки",
	"Your script": "Ваш скрипт",
	"Loading...": "Загрузка...",
	"Getting explanation...": "Получение объяснения...",
	Explanation: Explanation$5,
	"Run this script?": "Запустить этот скрипт?",
	"Revise this script?": "Пересмотреть этот скрипт?",
	Yes: Yes$5,
	"Lets go!": "Поехали!",
	Edit: Edit$5,
	"Make some adjustments before running": "Внесите некоторые изменения перед запуском",
	Revise: Revise$5,
	"Give feedback via prompt and get a new result": "Оставьте отзыв через приглашение и получите новый результат",
	Copy: Copy$5,
	"Copy the generated script to your clipboard": "Скопировать сгенерированный скрипт в буфер обмена",
	Cancel: Cancel$5,
	"Exit the program": "Выход из программы",
	Running: Running$5,
	"Copied to clipboard!": "Скопировано в буфер обмена!",
	"Your new script": "Ваш новый скрипт",
	"Invalid config property": "Недопустимое свойство конфигурации",
	"Shell detection failed unexpectedly": "Обнаружение оболочки неожиданно не удалось",
	"Invalid model": "Недопустимая модель",
	"Error": "Ошибка",
	"Missing required parameter": "Отсутствует обязательный параметр",
	"Please open a Bug report with the information above": "Пожалуйста, откройте отчет об ошибке с указанной выше информацией",
	"Prompt to run": "Приглашение на запуск",
	You: You$5
};

var Model$4 = "Модель";
var Language$4 = "Мова";
var Explanation$4 = "Пояснення";
var Yes$4 = "Так";
var Edit$4 = "Редагувати";
var Revise$4 = "Переглянути";
var Copy$4 = "Копіювати";
var Cancel$4 = "Скасувати";
var Running$4 = "Виконується";
var You$4 = "Ви";
var ukTranslation = {
	"Starting new conversation": "Початок нової розмови",
	"Goodbye!": "До побачення!",
	"send a message ('exit' to quit)": "надіслати повідомлення ('вихід', щоб вийти)",
	"Please enter a prompt.": "Будь ласка, введіть запитання.",
	"THINKING...": "ДУМАЮ...",
	"Please set your OpenAI API key via `ai config set OPENAI_KEY=<your token>`": "Будь ласка, встановіть свій ключ OpenAI API через `ai config set OPENAI_KEY=<your token>`",
	"Set config": "Встановити конфігурацію",
	"Enter your OpenAI API key": "Введіть свій ключ OpenAI API",
	"(not set)": "(не встановлено)",
	"OpenAI Key": "Ключ OpenAI",
	"Please enter a key": "Будь ласка, введіть ключ",
	"OpenAI API Endpoint": "Кінцева точка OpenAI API",
	"Enter your OpenAI API Endpoint": "Введіть кінцеву точку OpenAI API",
	"Silent Mode": "Тихий режим",
	"Enable silent mode?": "Увімкнути тихий режим?",
	Model: Model$4,
	"Enter the model you want to use": "Введіть модель, яку ви хочете використовувати",
	Language: Language$4,
	"Enter the language you want to use": "Введіть мову, яку ви хочете використовувати",
	"What would you like me to do?": "Що ви хочете, щоб я зробив?",
	"delete all log files": "видалити всі файли журналу",
	"list js files": "список js файлів",
	"fetch me a random joke": "знайти випадковий жарт",
	"list all commits": "список всіх комітів",
	"Say hello": "Скажіть привіт",
	"you can edit script here": "ви можете редагувати скрипт тут",
	"What would you like me to change in this script?": "Що ви хочете змінити в цьому скрипті?",
	"e.g.": "наприклад",
	"e.g. change the folder name": "наприклад, змінити назву папки",
	"Your script": "Ваш скрипт",
	"Loading...": "Завантаження...",
	"Getting explanation...": "Отримання пояснення...",
	Explanation: Explanation$4,
	"Run this script?": "Запустити цей скрипт?",
	"Revise this script?": "Переглянути цей скрипт?",
	Yes: Yes$4,
	"Lets go!": "Пішли!",
	Edit: Edit$4,
	"Make some adjustments before running": "Внесіть деякі зміни перед запуском",
	Revise: Revise$4,
	"Give feedback via prompt and get a new result": "Дайте відгук через промпт і отримайте новий результат",
	Copy: Copy$4,
	"Copy the generated script to your clipboard": "Скопіюйте згенерований скрипт в буфер обміну",
	Cancel: Cancel$4,
	"Exit the program": "Вийти з програми",
	Running: Running$4,
	"Copied to clipboard!": "Скопійовано в буфер обміну!",
	"Your new script": "Ваш новий скрипт",
	"Invalid config property": "Недійсна властивість конфігурації",
	"Shell detection failed unexpectedly": "Неочікувано не вдалося виявити оболонку",
	"Invalid model": "Недійсна модель",
	"Error": "Помилка",
	"Missing required parameter": "Відсутній обов'язковий параметр",
	"Please open a Bug report with the information above": "Будь ласка, відкрийте звіт про помилку з інформацією вище",
	"Prompt to run": "Запит на запуск",
	You: You$4
};

var Model$3 = "Mô hình";
var Language$3 = "Ngôn ngữ";
var Explanation$3 = "Giải thích";
var Yes$3 = "Có";
var Edit$3 = "Chỉnh sửa";
var Revise$3 = "Điều chỉnh";
var Copy$3 = "Sao chép";
var Cancel$3 = "Hủy";
var Running$3 = "Đang chạy";
var You$3 = "Bạn";
var viTranslation = {
	"Starting new conversation": "Bắt đầu cuộc trò chuyện mới",
	"Goodbye!": "Tạm biệt!",
	"send a message ('exit' to quit)": "gửi tin nhắn ('exit' để thoát)",
	"Please enter a prompt.": "Vui lòng nhập một lời nhắn.",
	"THINKING...": "ĐANG SUY NGHĨ...",
	"Please set your OpenAI API key via `ai config set OPENAI_KEY=<your token>`": "Vui lòng thiết lập khóa API OpenAI của bạn thông qua `ai config set OPENAI_KEY=<your token>`",
	"Set config": "Cài đặt cấu hình",
	"Enter your OpenAI API key": "Nhập khóa API OpenAI của bạn",
	"(not set)": "(không được đặt)",
	"OpenAI Key": "Khóa OpenAI",
	"Please enter a key": "Vui lòng nhập một khóa",
	"OpenAI API Endpoint": "Điểm cuối API OpenAI",
	"Enter your OpenAI API Endpoint": "Nhập Điểm cuối API OpenAI của bạn",
	"Silent Mode": "Chế độ im lặng",
	"Enable silent mode?": "Bật chế độ im lặng?",
	Model: Model$3,
	"Enter the model you want to use": "Nhập mô hình bạn muốn sử dụng",
	Language: Language$3,
	"Enter the language you want to use": "Nhập ngôn ngữ bạn muốn sử dụng",
	"What would you like me to do?": "Bạn muốn tôi làm gì?",
	"delete all log files": "xóa tất cả các tệp nhật ký",
	"list js files": "liệt kê các tệp js",
	"fetch me a random joke": "lấy cho tôi một câu chuyện cười ngẫu nhiên",
	"list all commits": "liệt kê tất cả các commit",
	"Say hello": "Nói xin chào",
	"you can edit script here": "bạn có thể chỉnh sửa kịch bản ở đây",
	"What would you like me to change in this script?": "Bạn muốn tôi thay đổi gì trong kịch bản này?",
	"e.g.": "ví dụ",
	"e.g. change the folder name": "ví dụ thay đổi tên thư mục",
	"Your script": "Kịch bản của bạn",
	"Loading...": "Đang tải...",
	"Getting explanation...": "Đang lấy giải thích...",
	Explanation: Explanation$3,
	"Run this script?": "Chạy kịch bản này?",
	"Revise this script?": "Điều chỉnh kịch bản này?",
	Yes: Yes$3,
	"Lets go!": "Hãy đi!",
	Edit: Edit$3,
	"Make some adjustments before running": "Thực hiện một số điều chỉnh trước khi chạy",
	Revise: Revise$3,
	"Give feedback via prompt and get a new result": "Đưa ra phản hồi qua lời nhắc và nhận kết quả mới",
	Copy: Copy$3,
	"Copy the generated script to your clipboard": "Sao chép kịch bản được tạo ra vào clipboard của bạn",
	Cancel: Cancel$3,
	"Exit the program": "Thoát chương trình",
	Running: Running$3,
	"Copied to clipboard!": "Đã sao chép vào clipboard!",
	"Your new script": "Kịch bản mới của bạn",
	"Invalid config property": "Thuộc tính cấu hình không hợp lệ",
	"Shell detection failed unexpectedly": "Phát hiện Shell thất bại một cách không mong đợi",
	"Invalid model": "Mô hình không hợp lệ",
	"Error": "Lỗi",
	"Missing required parameter": "Thiếu tham số bắt buộc",
	"Please open a Bug report with the information above": "Vui lòng mở một báo cáo lỗi với thông tin ở trên",
	"Prompt to run": "Lời nhắc để chạy",
	You: You$3
};

var Model$2 = "نموذج";
var Language$2 = "لغة";
var Explanation$2 = "تفسير";
var Yes$2 = "نعم";
var Edit$2 = "تحرير";
var Revise$2 = "مراجعة";
var Copy$2 = "نسخ";
var Cancel$2 = "إلغاء";
var Running$2 = "جار التشغيل";
var You$2 = "أنت";
var arTranslation = {
	"Starting new conversation": "بدء محادثة جديدة",
	"Goodbye!": "وداعا!",
	"send a message ('exit' to quit)": "أرسل رسالة ('exit' للخروج)",
	"Please enter a prompt.": "الرجاء إدخال تعليمات.",
	"THINKING...": "فكر...",
	"Please set your OpenAI API key via `ai config set OPENAI_KEY=<your token>`": "يرجى تعيين مفتاح OpenAI API الخاص بك عبر `ai config set OPENAI_KEY=<your token>`",
	"Set config": "تعيين التكوين",
	"Enter your OpenAI API key": "أدخل مفتاح OpenAI API الخاص بك",
	"(not set)": "(غير مضبوط)",
	"OpenAI Key": "مفتاح OpenAI",
	"Please enter a key": "الرجاء إدخال مفتاح",
	"OpenAI API Endpoint": "نقطة نهاية OpenAI API",
	"Enter your OpenAI API Endpoint": "أدخل نقطة نهاية OpenAI API الخاصة بك",
	"Silent Mode": "وضع صامت",
	"Enable silent mode?": "تمكين الوضع الصامت؟",
	Model: Model$2,
	"Enter the model you want to use": "أدخل النموذج الذي تريد استخدامه",
	Language: Language$2,
	"Enter the language you want to use": "أدخل اللغة التي تريد استخدامها",
	"What would you like me to do?": "ماذا تريد مني أن أفعل؟",
	"delete all log files": "حذف جميع ملفات السجلات",
	"list js files": "قائمة ملفات js",
	"fetch me a random joke": "جلب لي نكتة عشوائية",
	"list all commits": "قائمة جميع الالتزامات",
	"Say hello": "قل مرحبا",
	"you can edit script here": "يمكنك تحرير النص هنا",
	"What would you like me to change in this script?": "ما الذي تريد تغييره في هذا النص؟",
	"e.g.": "على سبيل المثال",
	"e.g. change the folder name": "على سبيل المثال تغيير اسم المجلد",
	"Your script": "نصك",
	"Loading...": "جار التحميل...",
	"Getting explanation...": "الحصول على تفسير...",
	Explanation: Explanation$2,
	"Run this script?": "تشغيل هذا النص؟",
	"Revise this script?": "مراجعة هذا النص؟",
	Yes: Yes$2,
	"Lets go!": "لنذهب!",
	Edit: Edit$2,
	"Make some adjustments before running": "قم بإجراء بعض التعديلات قبل التشغيل",
	Revise: Revise$2,
	"Give feedback via prompt and get a new result": "تقديم ملاحظات عبر البريد الإلكتروني والحصول على نتيجة جديدة",
	Copy: Copy$2,
	"Copy the generated script to your clipboard": "انسخ النص المولد إلى الحافظة الخاصة بك",
	Cancel: Cancel$2,
	"Exit the program": "خروج من البرنامج",
	Running: Running$2,
	"Copied to clipboard!": "تم النسخ إلى الحافظة!",
	"Your new script": "نصك الجديد",
	"Invalid config property": "خاصية التكوين غير صالحة",
	"Shell detection failed unexpectedly": "فشل كشف الخطأ بشكل غير متوقع",
	"Invalid model": "نموذج غير صالح",
	"Error": "خطأ",
	"Missing required parameter": "معلمة مطلوبة مفقودة",
	"Please open a Bug report with the information above": "يرجى فتح تقرير خلل مع المعلومات أعلاه",
	"Prompt to run": "تشغيل التعليمات",
	You: You$2
};

var Model$1 = "Modelo";
var Language$1 = "Língua";
var Explanation$1 = "Explicação";
var Yes$1 = "Sim";
var Edit$1 = "Editar";
var Revise$1 = "Revisar";
var Copy$1 = "Copiar";
var Cancel$1 = "Cancelar";
var Running$1 = "Executando";
var You$1 = "Você";
var ptTranslation = {
	"Starting new conversation": "Começando nova conversa",
	"Goodbye!": "Tchau!",
	"send a message ('exit' to quit)": "enviar uma mensagem ('exit' para sair)",
	"Please enter a prompt.": "Por favor, insira um prompt.",
	"THINKING...": "PENSANDO...",
	"Please set your OpenAI API key via `ai config set OPENAI_KEY=<your token>`": "Por favor, defina sua chave de API OpenAI via `ai config set OPENAI_KEY=<your token>`",
	"Set config": "Definir configuração",
	"Enter your OpenAI API key": "Insira sua chave de API OpenAI",
	"(not set)": "(não definido)",
	"OpenAI Key": "Chave OpenAI",
	"Please enter a key": "Por favor, insira uma chave",
	"OpenAI API Endpoint": "Endpoint da API OpenAI",
	"Enter your OpenAI API Endpoint": "Insira seu Endpoint da API OpenAI",
	"Silent Mode": "Modo silencioso",
	"Enable silent mode?": "Ativar modo silencioso?",
	Model: Model$1,
	"Enter the model you want to use": "Insira o modelo que você deseja usar",
	Language: Language$1,
	"Enter the language you want to use": "Insira a língua que você deseja usar",
	"What would you like me to do?": "O que você gostaria que eu fizesse?",
	"delete all log files": "excluir todos os arquivos de log",
	"list js files": "listar arquivos js",
	"fetch me a random joke": "me traga uma piada aleatória",
	"list all commits": "listar todos os commits",
	"Say hello": "Diga olá",
	"you can edit script here": "você pode editar o script aqui",
	"What would you like me to change in this script?": "O que você gostaria que eu mudasse neste script?",
	"e.g.": "por exemplo",
	"e.g. change the folder name": "por exemplo, mude o nome da pasta",
	"Your script": "Seu script",
	"Loading...": "Carregando...",
	"Getting explanation...": "Obtendo explicação...",
	Explanation: Explanation$1,
	"Run this script?": "Executar este script?",
	"Revise this script?": "Revisar este script?",
	Yes: Yes$1,
	"Lets go!": "Vamos lá!",
	Edit: Edit$1,
	"Make some adjustments before running": "Faça alguns ajustes antes de executar",
	Revise: Revise$1,
	"Give feedback via prompt and get a new result": "Dê feedback via prompt e obtenha um novo resultado",
	Copy: Copy$1,
	"Copy the generated script to your clipboard": "Copie o script gerado para a área de transferência",
	Cancel: Cancel$1,
	"Exit the program": "Sair do programa",
	Running: Running$1,
	"Copied to clipboard!": "Copiado para a área de transferência!",
	"Your new script": "Seu novo script",
	"Invalid config property": "Propriedade de configuração inválida",
	"Shell detection failed unexpectedly": "A detecção do shell falhou inesperadamente",
	"Invalid model": "Modelo inválido",
	"Error": "Erro",
	"Missing required parameter": "Parâmetro obrigatório faltando",
	"Please open a Bug report with the information above": "Por favor, abra um relatório de bug com as informações acima",
	"Prompt to run": "Prompt para executar",
	You: You$1
};

var Model = "Model";
var Language = "Bahasa";
var Explanation = "Penjelasan";
var Yes = "Ya";
var Edit = "Edit";
var Revise = "Periksa ulang";
var Copy = "Salin";
var Cancel = "Batal";
var Running = "Menjalankan";
var You = "Anda";
var idTranslation = {
	"Starting new conversation": "Memulai percakapan baru",
	"Goodbye!": "Selamat tinggal!",
	"send a message ('exit' to quit)": "kirim pesan ('exit' untuk keluar)",
	"Please enter a prompt.": "Silakan masukkan permintaan.",
	"THINKING...": "BERPIKIR...",
	"Please set your OpenAI API key via ai config set OPENAI_KEY=<your token>": "Harap atur kunci API OpenAI Anda melalui ai config set OPENAI_KEY=<token Anda>",
	"Set config": "Atur konfigurasi",
	"Enter your OpenAI API key": "Masukkan kunci API OpenAI Anda",
	"(not set)": "(belum diatur)",
	"OpenAI Key": "Kunci OpenAI",
	"Please enter a key": "Silakan masukkan kunci",
	"OpenAI API Endpoint": "Titik Akhir API OpenAI",
	"Enter your OpenAI API Endpoint": "Masukkan Titik Akhir API OpenAI Anda",
	"Silent Mode": "Mode Senyap",
	"Enable silent mode?": "Aktifkan mode senyap?",
	Model: Model,
	"Enter the model you want to use": "Masukkan model yang ingin Anda gunakan",
	Language: Language,
	"Enter the language you want to use": "Masukkan bahasa yang ingin Anda gunakan",
	"What would you like me to do?": "Apa yang ingin Anda saya lakukan?",
	"delete all log files": "hapus semua file log",
	"list js files": "daftar file js",
	"fetch me a random joke": "berikan saya lelucon acak",
	"list all commits": "daftar semua komit",
	"Say hello": "Katakan halo",
	"you can edit script here": "Anda dapat mengedit skrip di sini",
	"What would you like me to change in this script?": "Apa yang ingin Anda saya ubah dalam skrip ini?",
	"e.g.": "contoh",
	"e.g. change the folder name": "contoh: ubah nama folder",
	"Your script": "Skrip Anda",
	"Loading...": "Memuat...",
	"Getting explanation...": "Mendapatkan penjelasan...",
	Explanation: Explanation,
	"Run this script?": "Jalankan skrip ini?",
	"Revise this script?": "Periksa ulang skrip ini?",
	Yes: Yes,
	"Lets go!": "Ayo!",
	Edit: Edit,
	"Make some adjustments before running": "Lakukan beberapa penyesuaian sebelum menjalankan",
	Revise: Revise,
	"Give feedback via prompt and get a new result": "Beri umpan balik melalui permintaan dan dapatkan hasil baru",
	Copy: Copy,
	"Copy the generated script to your clipboard": "Salin skrip yang dihasilkan ke papan klip Anda",
	Cancel: Cancel,
	"Exit the program": "Keluar dari program",
	Running: Running,
	"Copied to clipboard!": "Disalin ke papan klip!",
	"Your new script": "Skrip baru Anda",
	"Invalid config property": "Properti konfigurasi tidak valid",
	"Shell detection failed unexpectedly": "Deteksi shell gagal secara tak terduga",
	"Invalid model": "Model tidak valid",
	"Error": "Kesalahan",
	"Missing required parameter": "Parameter yang diperlukan hilang",
	"Please open a Bug report with the information above": "Harap buka laporan Bug dengan informasi di atas",
	"Prompt to run": "Permintaan untuk dijalankan",
	You: You
};

let currentlang = "en";
const languages = {
  en: "English",
  "zh-Hans": "\u7B80\u4F53\u4E2D\u6587",
  // simplified Chinese
  "zh-Hant": "\u7E41\u9AD4\u4E2D\u6587",
  // traditional Chinese
  es: "Espa\xF1ol",
  // Spanish
  jp: "\u65E5\u672C\u8A9E",
  // Japanese
  ko: "\uD55C\uAD6D\uC5B4",
  // Korean
  fr: "Fran\xE7ais",
  // French
  de: "Deutsch",
  // German
  ru: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
  // Russian
  uk: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430",
  // Ukrainian
  vi: "Ti\u1EBFng Vi\u1EC7t",
  // Vietnamese
  ar: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
  // Arabic
  pt: "Portugu\xEAs",
  // Portuguese
  id: "Indonesia"
  // Indonesia
};
i18next.init({
  lng: currentlang,
  fallbackLng: "en",
  resources: {
    "zh-Hans": {
      translation: zhHansTranslation
    },
    "zh-Hant": {
      translation: zhHantTranslation
    },
    es: {
      translation: esTranslation
    },
    jp: {
      translation: jpTranslation
    },
    ko: {
      translation: koTranslation
    },
    fr: {
      translation: frTranslation
    },
    de: {
      translation: deTranslation
    },
    ru: {
      translation: ruTranslation
    },
    uk: {
      translation: ukTranslation
    },
    vi: {
      translation: viTranslation
    },
    ar: {
      translation: arTranslation
    },
    pt: {
      translation: ptTranslation
    },
    id: {
      translation: idTranslation
    }
  }
});
const t = (key) => {
  if (!currentlang || currentlang === "en")
    return key;
  return i18next.t(key);
};
const setLanguage = (lang) => {
  currentlang = lang || "en";
  i18next.changeLanguage(currentlang);
};
const getCurrentLanguagenName = () => {
  return languages[currentlang];
};
var i18n$1 = { setLanguage, t, getCurrentLanguagenName, languages };

var require$1 = (
			true
				? /* @__PURE__ */ createRequire(import.meta.url)
				: require
		);

async function* streamToIterable(stream) {
  let previous = "";
  for await (const chunk of stream) {
    const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    previous += bufferChunk;
    let eolIndex;
    while ((eolIndex = previous.indexOf("\n")) >= 0) {
      const line = previous.slice(0, eolIndex + 1).trimEnd();
      if (line.startsWith("data: "))
        yield line;
      previous = previous.slice(eolIndex + 1);
    }
  }
}

function detectShell() {
  try {
    if (os.platform() === "win32") {
      return "powershell";
    }
    return path.basename(os.userInfo().shell ?? "bash");
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(
        `${i18n$1.t("Shell detection failed unexpectedly")}: ${err.message}`
      );
    }
  }
}

async function streamToString(stream) {
  let str = "";
  for await (const chunk of stream) {
    str += chunk;
  }
  return str;
}

/**
 * String.prototype.replaceAll() polyfill
 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function(str, newStr) {
    if (Object.prototype.toString.call(str).toLowerCase() === "[object regexp]") {
      return this.replace(str, newStr);
    }
    return this.replace(new RegExp(str, "g"), newStr);
  };
}

const stripRegexPatterns = (inputString, patternList) => patternList.reduce(
  (currentString, pattern) => pattern ? currentString.replaceAll(pattern, "") : currentString,
  inputString
);

function getOpenAi(key, apiEndpoint) {
  const openAi = new OpenAIApi(
    new Configuration({ apiKey: key, basePath: apiEndpoint })
  );
  return openAi;
}
const shellCodeExclusions = [/```[a-zA-Z]*\n/gi, /```[a-zA-Z]*/gi, "\n"];
async function getScriptAndInfo({
  prompt,
  key,
  model,
  apiEndpoint
}) {
  const fullPrompt = getFullPrompt(prompt);
  const stream = await generateCompletion({
    prompt: fullPrompt,
    number: 1,
    key,
    model,
    apiEndpoint
  });
  const iterableStream = streamToIterable(stream);
  return {
    readScript: readData(iterableStream, ...shellCodeExclusions),
    readInfo: readData(iterableStream, ...shellCodeExclusions)
  };
}
async function generateCompletion({
  prompt,
  number = 1,
  key,
  model,
  apiEndpoint
}) {
  const openAi = getOpenAi(key, apiEndpoint);
  try {
    const completion = await openAi.createChatCompletion(
      {
        model: model || "gpt-4o-mini",
        messages: Array.isArray(prompt) ? prompt : [{ role: "user", content: prompt }],
        n: Math.min(number, 10),
        stream: true
      },
      { responseType: "stream" }
    );
    return completion.data;
  } catch (err) {
    const error = err;
    if (error.code === "ENOTFOUND") {
      throw new KnownError(
        `Error connecting to ${error.request.hostname} (${error.request.syscall}). Are you connected to the internet?`
      );
    }
    const response = error.response;
    let message = response?.data;
    if (response && message instanceof IncomingMessage) {
      message = await streamToString(
        response.data
      );
      try {
        message = JSON.parse(message);
      } catch (e) {
      }
    }
    const messageString = message && JSON.stringify(message, null, 2);
    if (response?.status === 429) {
      throw new KnownError(
        dedent`
        Request to OpenAI failed with status 429. This is due to incorrect billing setup or excessive quota usage. Please follow this guide to fix it: https://help.openai.com/en/articles/6891831-error-code-429-you-exceeded-your-current-quota-please-check-your-plan-and-billing-details

        You can activate billing here: https://platform.openai.com/account/billing/overview . Make sure to add a payment method if not under an active grant from OpenAI.

        Full message from OpenAI:
      ` + "\n\n" + messageString + "\n"
      );
    } else if (response && message) {
      throw new KnownError(
        dedent`
        Request to OpenAI failed with status ${response?.status}:
      ` + "\n\n" + messageString + "\n"
      );
    }
    throw error;
  }
}
async function getExplanation({
  script,
  key,
  model,
  apiEndpoint
}) {
  const prompt = getExplanationPrompt(script);
  const stream = await generateCompletion({
    prompt,
    key,
    number: 1,
    model,
    apiEndpoint
  });
  const iterableStream = streamToIterable(stream);
  return { readExplanation: readData(iterableStream) };
}
async function getRevision({
  prompt,
  code,
  key,
  model,
  apiEndpoint
}) {
  const fullPrompt = getRevisionPrompt(prompt, code);
  const stream = await generateCompletion({
    prompt: fullPrompt,
    key,
    number: 1,
    model,
    apiEndpoint
  });
  const iterableStream = streamToIterable(stream);
  return {
    readScript: readData(iterableStream, ...shellCodeExclusions)
  };
}
const readData = (iterableStream, ...excluded) => (writer) => new Promise(async (resolve) => {
  let stopTextStream = false;
  let data = "";
  let content = "";
  let dataStart = false;
  let buffer = "";
  const [excludedPrefix] = excluded;
  const stopTextStreamKeys = ["q", "escape"];
  readline.createInterface({
    input: process.stdin
  });
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", (key, data2) => {
    if (stopTextStreamKeys.includes(data2.name)) {
      stopTextStream = true;
    }
  });
  for await (const chunk of iterableStream) {
    const payloads = chunk.toString().split("\n\n");
    for (const payload of payloads) {
      if (payload.includes("[DONE]") || stopTextStream) {
        dataStart = false;
        resolve(data);
        return;
      }
      if (payload.startsWith("data:")) {
        content = parseContent(payload);
        if (!dataStart) {
          buffer += content;
          if (buffer.match(excludedPrefix ?? "")) {
            dataStart = true;
            buffer = "";
            if (excludedPrefix)
              break;
          }
        }
        if (dataStart && content) {
          const contentWithoutExcluded = stripRegexPatterns(
            content,
            excluded
          );
          data += contentWithoutExcluded;
          writer(contentWithoutExcluded);
        }
      }
    }
  }
  function parseContent(payload) {
    const data2 = payload.replaceAll(/(\n)?^data:\s*/g, "");
    try {
      const delta = JSON.parse(data2.trim());
      return delta.choices?.[0]?.delta?.content ?? "";
    } catch (error) {
      return `Error with JSON.parse and ${payload}.
${error}`;
    }
  }
  resolve(data);
});
function getExplanationPrompt(script) {
  return dedent`
    ${explainScript} Please reply in ${i18n$1.getCurrentLanguagenName()}

    The script: ${script}
  `;
}
function getShellDetails() {
  const shellDetails2 = detectShell();
  return dedent`
      The target shell is ${shellDetails2}
  `;
}
const shellDetails = getShellDetails();
const explainScript = dedent`
  Please provide a clear, concise description of the script, using minimal words. Outline the steps in a list format.
`;
function getOperationSystemDetails() {
  const os = require$1("@nexssp/os/legacy");
  return os.name();
}
const generationDetails = dedent`
    Only reply with the single line command surrounded by three backticks. It must be able to be directly run in the target shell. Do not include any other text.

    Make sure the command runs on ${getOperationSystemDetails()} operating system.
  `;
function getFullPrompt(prompt) {
  return dedent`
    Create a single line command that one can enter in a terminal and run, based on what is specified in the prompt.

    ${shellDetails}

    ${generationDetails}

    ${"" }

    The prompt is: ${prompt}
  `;
}
function getRevisionPrompt(prompt, code) {
  return dedent`
    Update the following script based on what is asked in the following prompt.

    The script: ${code}

    The prompt: ${prompt}

    ${generationDetails}
  `;
}
async function getModels(key, apiEndpoint) {
  const openAi = getOpenAi(key, apiEndpoint);
  const response = await openAi.listModels();
  return response.data.data.filter((model) => model.object === "model");
}

const { hasOwnProperty } = Object.prototype;
const hasOwn = (object, key) => hasOwnProperty.call(object, key);
const languagesOptions = Object.entries(i18n$1.languages).map(([key, value]) => ({
  value: key,
  label: value
}));
const configParsers = {
  OPENAI_KEY(key) {
    if (!key) {
      throw new KnownError(
        `Please set your OpenAI API key via \`${commandName} config set OPENAI_KEY=<your token>\``
        // TODO: i18n
      );
    }
    return key;
  },
  MODEL(model) {
    if (!model || model.length === 0) {
      return "gpt-4o-mini";
    }
    return model;
  },
  SILENT_MODE(mode) {
    return String(mode).toLowerCase() === "true";
  },
  OPENAI_API_ENDPOINT(apiEndpoint) {
    return apiEndpoint || "https://api.openai.com/v1";
  },
  LANGUAGE(language) {
    return language || "en";
  }
};
const configPath = path.join(os.homedir(), ".ai-shell");
const fileExists = (filePath) => fs.lstat(filePath).then(
  () => true,
  () => false
);
const readConfigFile = async () => {
  const configExists = await fileExists(configPath);
  if (!configExists) {
    return /* @__PURE__ */ Object.create(null);
  }
  const configString = await fs.readFile(configPath, "utf8");
  return ini.parse(configString);
};
const getConfig = async (cliConfig) => {
  const config = await readConfigFile();
  const parsedConfig = {};
  for (const key of Object.keys(configParsers)) {
    const parser = configParsers[key];
    const value = cliConfig?.[key] ?? config[key];
    parsedConfig[key] = parser(value);
  }
  return parsedConfig;
};
const setConfigs = async (keyValues) => {
  const config = await readConfigFile();
  for (const [key, value] of keyValues) {
    if (!hasOwn(configParsers, key)) {
      throw new KnownError(`${i18n$1.t("Invalid config property")}: ${key}`);
    }
    const parsed = configParsers[key](value);
    config[key] = parsed;
  }
  await fs.writeFile(configPath, ini.stringify(config), "utf8");
};
const showConfigUI = async () => {
  try {
    const config = await getConfig();
    const choice = await p.select({
      message: i18n$1.t("Set config") + ":",
      options: [
        {
          label: i18n$1.t("OpenAI Key"),
          value: "OPENAI_KEY",
          hint: hasOwn(config, "OPENAI_KEY") ? (
            // Obfuscate the key
            "sk-..." + config.OPENAI_KEY.slice(-3)
          ) : i18n$1.t("(not set)")
        },
        {
          label: i18n$1.t("OpenAI API Endpoint"),
          value: "OPENAI_API_ENDPOINT",
          hint: hasOwn(config, "OPENAI_API_ENDPOINT") ? config.OPENAI_API_ENDPOINT : i18n$1.t("(not set)")
        },
        {
          label: i18n$1.t("Silent Mode"),
          value: "SILENT_MODE",
          hint: hasOwn(config, "SILENT_MODE") ? config.SILENT_MODE.toString() : i18n$1.t("(not set)")
        },
        {
          label: i18n$1.t("Model"),
          value: "MODEL",
          hint: hasOwn(config, "MODEL") ? config.MODEL : i18n$1.t("(not set)")
        },
        {
          label: i18n$1.t("Language"),
          value: "LANGUAGE",
          hint: hasOwn(config, "LANGUAGE") ? config.LANGUAGE : i18n$1.t("(not set)")
        },
        {
          label: i18n$1.t("Cancel"),
          value: "cancel",
          hint: i18n$1.t("Exit the program")
        }
      ]
    });
    if (p.isCancel(choice))
      return;
    if (choice === "OPENAI_KEY") {
      const key = await p.text({
        message: i18n$1.t("Enter your OpenAI API key"),
        validate: (value) => {
          if (!value.length) {
            return i18n$1.t("Please enter a key");
          }
        }
      });
      if (p.isCancel(key))
        return;
      await setConfigs([["OPENAI_KEY", key]]);
    } else if (choice === "OPENAI_API_ENDPOINT") {
      const apiEndpoint = await p.text({
        message: i18n$1.t("Enter your OpenAI API Endpoint")
      });
      if (p.isCancel(apiEndpoint))
        return;
      await setConfigs([["OPENAI_API_ENDPOINT", apiEndpoint]]);
    } else if (choice === "SILENT_MODE") {
      const silentMode = await p.confirm({
        message: i18n$1.t("Enable silent mode?")
      });
      if (p.isCancel(silentMode))
        return;
      await setConfigs([["SILENT_MODE", silentMode ? "true" : "false"]]);
    } else if (choice === "MODEL") {
      const { OPENAI_KEY: key, OPENAI_API_ENDPOINT: apiEndpoint } = await getConfig();
      const models = await getModels(key, apiEndpoint);
      const model = await p.select({
        message: "Pick a model.",
        options: models.map((m) => {
          return { value: m.id, label: m.id };
        })
      });
      if (p.isCancel(model))
        return;
      await setConfigs([["MODEL", model]]);
    } else if (choice === "LANGUAGE") {
      const language = await p.select({
        message: i18n$1.t("Enter the language you want to use"),
        options: languagesOptions
      });
      if (p.isCancel(language))
        return;
      await setConfigs([["LANGUAGE", language]]);
      i18n$1.setLanguage(language);
    }
    if (choice === "cancel")
      return;
    showConfigUI();
  } catch (error) {
    console.error(`
${red("\u2716")} ${error.message}`);
    handleCliError(error);
    process.exit(1);
  }
};

var config = command(
  {
    name: "config",
    parameters: ["[mode]", "[key=value...]"],
    help: {
      description: "Configure the CLI"
    }
  },
  (argv) => {
    (async () => {
      const { mode, keyValue: keyValues } = argv._;
      if (mode === "ui" || !mode) {
        await showConfigUI();
        return;
      }
      if (!keyValues.length) {
        console.error(
          `${i18n.t("Error")}: ${i18n.t(
            "Missing required parameter"
          )} "key=value"
`
        );
        argv.showHelp();
        return process.exit(1);
      }
      if (mode === "get") {
        const config = await getConfig();
        for (const key of keyValues) {
          if (hasOwn(config, key)) {
            console.log(`${key}=${config[key]}`);
          } else {
            throw new KnownError(
              `${i18n.t("Invalid config property")}: ${key}`
            );
          }
        }
        return;
      }
      if (mode === "set") {
        await setConfigs(
          keyValues.map((keyValue) => keyValue.split("="))
        );
        return;
      }
      throw new KnownError(`${i18n.t("Invalid mode")}: ${mode}`);
    })().catch((error) => {
      console.error(`
${red("\u2716")} ${error.message}`);
      handleCliError(error);
      process.exit(1);
    });
  }
);

var chat = command(
  {
    name: "chat",
    help: {
      description: "Start a new chat session to send and receive messages, continue replying until the user chooses to exit."
    }
  },
  async () => {
    console.log("");
    intro("Starting new conversation");
  }
);

function getHistoryFile() {
  const shell = process.env.SHELL || "";
  const homeDir = os.homedir();
  switch (path.basename(shell)) {
    case "bash":
    case "sh":
      return path.join(homeDir, ".bash_history");
    case "zsh":
      return path.join(homeDir, ".zsh_history");
    case "fish":
      return path.join(homeDir, ".local", "share", "fish", "fish_history");
    case "ksh":
      return path.join(homeDir, ".ksh_history");
    case "tcsh":
      return path.join(homeDir, ".history");
    default:
      return null;
  }
}
function getLastCommand(historyFile) {
  try {
    const data = fs$1.readFileSync(historyFile, "utf8");
    const commands = data.trim().split("\n");
    return commands[commands.length - 1];
  } catch (err) {
    return null;
  }
}
function appendToShellHistory(command) {
  const historyFile = getHistoryFile();
  if (historyFile) {
    const lastCommand = getLastCommand(historyFile);
    if (lastCommand !== command) {
      fs$1.appendFile(historyFile, `${command}
`, (err) => {
      });
    }
  }
}

const init = async () => {
  try {
    const { LANGUAGE: language } = await getConfig();
    i18n$1.setLanguage(language);
  } catch {
    i18n$1.setLanguage("en");
  }
};
const examples = [];
const initPromise = init();
initPromise.then(() => {
  examples.push(i18n$1.t("delete all log files"));
  examples.push(i18n$1.t("list js files"));
  examples.push(i18n$1.t("fetch me a random joke"));
  examples.push(i18n$1.t("list all commits"));
});
const sample = (arr) => {
  const len = arr == null ? 0 : arr.length;
  return len ? arr[Math.floor(Math.random() * len)] : void 0;
};
async function runScript(script) {
  p.outro(`${i18n$1.t("Running")}: ${script}`);
  console.log("");
  try {
    await execaCommand(script, {
      stdio: "inherit",
      shell: process.env.SHELL || true
    });
    appendToShellHistory(script);
  } catch (error) {
  }
}
async function getPrompt(prompt2) {
  await initPromise;
  const group = p.group(
    {
      prompt: () => p.text({
        message: i18n$1.t("What would you like me to do?"),
        placeholder: `${i18n$1.t("e.g.")} ${sample(examples)}`,
        initialValue: prompt2,
        defaultValue: i18n$1.t("Say hello"),
        validate: (value) => {
          if (!value)
            return i18n$1.t("Please enter a prompt.");
        }
      })
    },
    {
      onCancel: () => {
        p.cancel(i18n$1.t("Goodbye!"));
        process.exit(0);
      }
    }
  );
  return (await group).prompt;
}
async function promptForRevision() {
  const group = p.group(
    {
      prompt: () => p.text({
        message: i18n$1.t("What would you like me to change in this script?"),
        placeholder: i18n$1.t("e.g. change the folder name"),
        validate: (value) => {
          if (!value)
            return i18n$1.t("Please enter a prompt.");
        }
      })
    },
    {
      onCancel: () => {
        p.cancel(i18n$1.t("Goodbye!"));
        process.exit(0);
      }
    }
  );
  return (await group).prompt;
}
async function prompt({
  usePrompt,
  silentMode
} = {}) {
  const {
    OPENAI_KEY: key,
    SILENT_MODE,
    OPENAI_API_ENDPOINT: apiEndpoint,
    MODEL: model
  } = await getConfig();
  const skipCommandExplanation = silentMode || SILENT_MODE;
  console.log("");
  p.intro(`${cyan(`${projectName}`)}`);
  const thePrompt = usePrompt || await getPrompt();
  const spin = p.spinner();
  spin.start(i18n$1.t(`Loading...`));
  const { readInfo, readScript } = await getScriptAndInfo({
    prompt: thePrompt,
    key,
    model,
    apiEndpoint
  });
  spin.stop(`${i18n$1.t("Your script")}:`);
  console.log("");
  const script = await readScript(process.stdout.write.bind(process.stdout));
  console.log("");
  console.log("");
  console.log(dim("\u2022"));
  if (!skipCommandExplanation) {
    spin.start(i18n$1.t(`Getting explanation...`));
    const info = await readInfo(process.stdout.write.bind(process.stdout));
    if (!info) {
      const { readExplanation } = await getExplanation({
        script,
        key,
        model,
        apiEndpoint
      });
      spin.stop(`${i18n$1.t("Explanation")}:`);
      console.log("");
      await readExplanation(process.stdout.write.bind(process.stdout));
      console.log("");
      console.log("");
      console.log(dim("\u2022"));
    }
  }
  await runOrReviseFlow(script, key, model, apiEndpoint, silentMode);
}
async function runOrReviseFlow(script, key, model, apiEndpoint, silentMode) {
  const emptyScript = script.trim() === "";
  const answer = await p.select({
    message: emptyScript ? i18n$1.t("Revise this script?") : i18n$1.t("Run this script?"),
    options: [
      ...emptyScript ? [] : [
        {
          label: "\u2705 " + i18n$1.t("Yes"),
          hint: i18n$1.t("Lets go!"),
          value: async () => {
            await runScript(script);
          }
        },
        {
          label: "\u{1F4DD} " + i18n$1.t("Edit"),
          hint: i18n$1.t("Make some adjustments before running"),
          value: async () => {
            const newScript = await p.text({
              message: i18n$1.t("you can edit script here:"),
              initialValue: script
            });
            if (!p.isCancel(newScript)) {
              await runScript(newScript);
            }
          }
        }
      ],
      {
        label: "\u{1F501} " + i18n$1.t("Revise"),
        hint: i18n$1.t("Give feedback via prompt and get a new result"),
        value: async () => {
          await revisionFlow(script, key, model, apiEndpoint, silentMode);
        }
      },
      {
        label: "\u{1F4CB} " + i18n$1.t("Copy"),
        hint: i18n$1.t("Copy the generated script to your clipboard"),
        value: async () => {
          await clipboardy.write(script);
          p.outro(i18n$1.t("Copied to clipboard!"));
        }
      },
      {
        label: "\u274C " + i18n$1.t("Cancel"),
        hint: i18n$1.t("Exit the program"),
        value: () => {
          p.cancel(i18n$1.t("Goodbye!"));
          process.exit(0);
        }
      }
    ]
  });
  if (typeof answer === "function") {
    await answer();
  }
}
async function revisionFlow(currentScript, key, model, apiEndpoint, silentMode) {
  const revision = await promptForRevision();
  const spin = p.spinner();
  spin.start(i18n$1.t(`Loading...`));
  const { readScript } = await getRevision({
    prompt: revision,
    code: currentScript,
    key,
    model,
    apiEndpoint
  });
  spin.stop(`${i18n$1.t(`Your new script`)}:`);
  console.log("");
  const script = await readScript(process.stdout.write.bind(process.stdout));
  console.log("");
  console.log("");
  console.log(dim("\u2022"));
  if (!silentMode) {
    const infoSpin = p.spinner();
    infoSpin.start(i18n$1.t(`Getting explanation...`));
    const { readExplanation } = await getExplanation({
      script,
      key,
      model,
      apiEndpoint
    });
    infoSpin.stop(`${i18n$1.t("Explanation")}:`);
    console.log("");
    await readExplanation(process.stdout.write.bind(process.stdout));
    console.log("");
    console.log("");
    console.log(dim("\u2022"));
  }
  await runOrReviseFlow(script, key, model, apiEndpoint, silentMode);
}

cli(
  {
    name: commandName,
    version,
    flags: {
      prompt: {
        type: String,
        description: "Prompt to run",
        alias: "p"
      },
      silent: {
        type: Boolean,
        description: "Less verbose, skip printing the command explanation ",
        alias: "s"
      }
    },
    commands: [config, chat, update]
  },
  (argv) => {
    const silentMode = argv.flags.silent;
    const promptText = argv._.join(" ");
    if (promptText.trim() === "update") {
      update.callback?.(argv);
    } else {
      prompt({ usePrompt: promptText, silentMode }).catch((error) => {
        console.error(`
${red("\u2716")} ${error.message}`);
        handleCliError(error);
        process.exit(1);
      });
    }
  }
);
