// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { BrowserWindow } = require('electron').remote;
const { shell } = require('electron');
const os = require('os');
const { ipcRenderer } = require('electron');
// 从本地 load 文件


/** 同步消息代码 */
const btnSync = document.getElementById('btnSync');
btnSync.addEventListener('click', () => {
  const reply = ipcRenderer.sendSync('synchronous-message', 'ping')
  const message = `同步消息回复: ${reply}`
  document.getElementById('sync-reply').innerHTML = message;
});

/**异步消息代码 */
const btnAsync = document.querySelector('#btnAsync');
btnAsync.addEventListener('click', () => {
  ipcRenderer.send('asynchronous-message', '异步消息');
});
ipcRenderer.on('asynchronous-reply', (event, arg) => {
  const message = `异步消息回复: ${arg}`
  document.getElementById('async-reply').innerHTML = message;
})

const newWindow = document.querySelector('#window');
newWindow.addEventListener('click', () => {
  let win = new BrowserWindow({ width: 500, height: 700 });
  win.on('close', () => { win = null });
  win.loadURL('https://www.bing.com');
});

const memo = document.querySelector('#memo');
memo.innerHTML = `我是 index.html , 我的本地位置在 ${__dirname}, 你也可以点击` +
  ` <button id="btnFileOpen">异步打开文件夹</button> 打开所在目录 `;


btnFileOpen.addEventListener('click', tryOpen);
/**
 * @function 告诉主进程需求，让主进程进行 文件 IO 操作
 * 
 * 渲染进程不该也不能关心这些操作，只应该关注传统的前端页面渲染
 */
function tryOpen() {
  /** 异步消息代码 */
  console.log(__dirname);
  ipcRenderer.send('open', __dirname);
  /** */
  ipcRenderer.on('open-reply', (event, arg) => {
    const message = `异步消息回复: ${arg}`
    document.getElementById('fileRply').innerHTML = `文件打开操作结果：` + message;
  });
}