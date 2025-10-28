// Copyright (c) 2025 OwnderDuck
// SPDX-License-Identifier: MIT
const vscode = require('vscode');

let statusItem = null;

function activate(context) {
  statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 114514);
  statusItem.text = '$(rocket) Ready';
  statusItem.show();

  // 封装一个函数：读取配置
  function getMessages() {
    const config = vscode.workspace.getConfiguration('statusText');
    const msgs = config.get('messages');
    return Array.isArray(msgs) && msgs.length > 0
      ? msgs
      : ['$(rocket) Ready']; // fallback
  }

  // 切换文件时随机更新
  const editorListener = vscode.window.onDidChangeActiveTextEditor(() => {
    if (!statusItem) return;
    const messages = getMessages();
    const random = messages[Math.floor(Math.random() * messages.length)];
    statusItem.text = random;
    statusItem.tooltip = '状态栏随机文本';
  });

  // 监听配置变化，实时更新
  const configListener = vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('statusText.messages')) {
      const messages = getMessages();
      statusItem.text = messages[0]; // 配置变更时先显示第一条
    }
  });

  context.subscriptions.push(statusItem, editorListener, configListener);
}

function deactivate() {
  statusItem?.dispose();
  statusItem = null;
}

module.exports = { activate, deactivate };
