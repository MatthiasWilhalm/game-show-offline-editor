const electron = require('electron');
const electronBrowserWindow = electron.BrowserWindow;
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const fs = require('fs');

// if fs problem again use this: https://bobbyhadz.com/blog/module-not-found-cant-resolve-fs
// https://www.electronjs.org/docs/latest/tutorial/ipc

const dialog = electron.dialog;

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // contextIsolation: false,
            // nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    // menu with save and load option
    mainWindow.setMenu(
        electron.Menu.buildFromTemplate([
            {
                label: 'File',
                submenu: [
                    {
                        label: 'Save',
                        click: () => {
                            mainWindow.webContents.send('save');
                        }
                    },
                    {
                        label: 'Open',
                        click: () => {
                            dialog.showOpenDialog({
                                properties: ['openFile'],
                                filters: [
                                    {
                                        name: 'JSON',
                                        extensions: ['json']
                                    }
                                ]
                            }).then(fileObj => {
                                if (!fileObj.canceled) {
                                    const filepath = fileObj.filePaths[0];
                                    fs.readFile(filepath, 'utf-8', (err, data) => {
                                        if(err){
                                            alert("An error ocurred reading the file :" + err.message);
                                            return;
                                        }
                                        mainWindow.webContents.send('update-event', data);
                                        // mainWindow.sessionStorage.setItem('moderationEvent', data);
                                        // triggerEventUpdate();
                                    });
                                }
                            });
                        }
                    }
                ]
            }
        ])
    );
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.loadFile('test.html');

    // const startUrl = process.env.ELECTRON_START_URL || url.format({
    //     pathname: path.join(__dirname, '/../build/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // });
    // mainWindow.loadURL(startUrl);

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});

function triggerEventUpdate() {
    const eventUpdate = sessionStorage.getItem('eventUpdate');
    window.sessionStorage.setItem('eventUpdate', eventUpdate === 'true' ? 'false' : 'true');
}
