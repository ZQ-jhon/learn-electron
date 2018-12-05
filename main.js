// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, shell, dialog, globalShortcut } = require('electron');
const path = require('path');
const ipcMain = require('electron').ipcMain;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  let reopenMenuItem = findReopenMenuItem();
  if (reopenMenuItem) reopenMenuItem.enabled = true;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// app.on('new-window-for-tab',function(){})
app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

/**
 * @function  Created Window
 */
function createWindow() {

  /** 按钮清空 */
  Menu.setApplicationMenu();

  /** 创建渲染进程 (BrowserWindow instance)*/
  renderThread = new BrowserWindow({ width: 800, height: 600 });

  /** 渲染进程加载文件 */
  renderThread.loadFile('index.html');

  /** 开启控制台 */
  renderThread.webContents.openDevTools();

  /** 监听渲染进程 */
  renderThread.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    renderThread = null;

    /** 打开一个文件夹 */
    // shell.showItemInFolder(__filename);
  });

  /** 注册全局快捷键 (electron 丢焦后仍然有效) */
  globalShortcut.register('CommandOrControl+1', () => {
    dialog.showMessageBox({
      type: 'info',
      message: '成功!',
      detail: '你按下了一个全局注册的快捷键绑定.',
      buttons: ['好的']
    });
  });

  /** render 进程传来的同步事件, 以及携带的消息 */
  ipcMain.on('synchronous-message', (event, arg) => {
    // console.log(event);
    // console.log(arg);
    event.returnValue = 'pong';
  });

  /** render 进程传来的异步事件, 以及携带的消息 */
  ipcMain.on('asynchronous-message', (event, arg) => {
    event.sender.send('asynchronous-reply', 'pong')
  });

  /** 文件操作 IO 的函数 */
  ipcMain.on('open', (event, arg) => {
    try {
      open(arg);
    }
    catch (err) {
      console.log(err);
      event.returnValue = `fail`;
    }
    event.returnValue = 'success';
  })
}

/**
 * @function open direction
 */
function open(dir) {
  dir = dir + '\\' + `index.html`;
  console.log(dir);
  shell.showItemInFolder(dir);
}




