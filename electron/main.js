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

const EDITOR_VERSION = "1.0.0";

let mainWindow;

var currentFilePath = null;

const defaultTitle = "TFGame Editor - ";
let currentEventName = '';

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            // contextIsolation: false,
            // nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });    // menu with save and load option
    mainWindow.setMenu(
        electron.Menu.buildFromTemplate([

            {
                label: 'File',
                submenu: [
                    {
                        label: 'Save',
                        accelerator: 'CmdOrCtrl+S',
                        click: () => {
                            if(!currentFilePath) {
                                openSaveDialog(() => mainWindow.webContents.send('save-request'));
                            } else {
                                mainWindow.webContents.send('save-request');
                            }
                        }
                    },
                    {
                        label: 'Open',
                        accelerator: 'CmdOrCtrl+O',
                        click: () => {
                            dialog.showOpenDialog({
                                properties: ['openFile'],
                                filters: [
                                    {
                                        name: 'TFGame Event',
                                        extensions: ['tfgame']
                                    },
                                    {
                                        name: 'JSON',
                                        extensions: ['json', 'tfgame']
                                    }
                                ]
                            }).then(fileObj => {
                                if (!fileObj.canceled) {
                                    const filepath = fileObj.filePaths[0];
                                    openFile(filepath);
                                }
                            });
                        }
                    },
                    {
                        label: 'New',
                        accelerator: 'CmdOrCtrl+N',
                        click: () => {
                            mainWindow.webContents.send('update-event', null);
                            setCurrentPath(mainWindow, null);
                        }
                    },
                    {
                        label: 'Save As',
                        accelerator: 'CmdOrCtrl+Shift+S',
                        click: () => {
                            openSaveDialog(() => mainWindow.webContents.send('save-request'));
                        }
                    },
                    {
                        label: `Version ${EDITOR_VERSION}`,
                        enabled: false
                    }

                ]
            }
        ])
    );
    // mainWindow.loadURL('http://localhost:3000');
    // mainWindow.loadFile('./build/index.html');

    // const startUrl = process.env.ELECTRON_START_URL || url.format({
    //     pathname: path.join(__dirname, '/../build/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // });
    // mainWindow.loadURL(startUrl);
    // mainWindow.loadURL('file:///' + __dirname + "/index.html");
    
    // mainWindow.loadFile('build/index.html');

    const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "build/index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";
    mainWindow.loadURL(appURL);

    // mainWindow.loadURL('http://localhost:3000');


    // if (process.env.REACT_APP_ENV_UPDATE_CHANNEL_STRING === 'dev') {
    //     // mainWindow.loadURL(startUrl);
    //     mainWindow.loadURL('http://localhost:3000');
    // } else {
    //     mainWindow.loadURL('file:///' + __dirname + "/index.html");
    // }

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', () => {
    ipcMain.on('save', (ev, event) => {
        if (currentFilePath) {
            saveFile(event);
        } else {
            openSaveDialog(() => saveFile(event));
        }
    });

    ipcMain.on('set-title', (event, title) => {
        const webContents = event.sender;
        const win = BrowserWindow.fromWebContents(webContents);
        setTitleEventName(win, title);
    });

    createWindow();
    updateTitle(mainWindow);

});

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

const setCurrentPath = (window, path) => {
    currentFilePath = path;
    updateTitle(window);
};

const setTitleEventName = (window, name) => {
    currentEventName = name;
    updateTitle(window);
};

const updateTitle = window => {
    window.setTitle(defaultTitle + currentEventName + (currentFilePath ? ` (${currentFilePath})` : ''));
}

const saveFile = event => {
    if(currentFilePath && event) {
        try {
            fs.writeFileSync(currentFilePath, event, 'utf-8');
        } catch (err) {
            console.error(err);
        }
    }
};

const openFile = filepath => {
    fs.readFile(filepath, 'utf-8', (err, data) => {
        if(err){
            console.log("An error ocurred reading the file :" + err.message);
            return;
        }
        setCurrentPath(mainWindow, filepath);
        mainWindow.webContents.send('update-event', data);
    });
};


const openSaveDialog = next => {
    dialog.showSaveDialog({
        properties: ['openFile'],
        filters: [
            {
                name: 'TFGame Event',
                extensions: ['tfgame']
            },
            {
                name: 'JSON',
                extensions: ['json']
            }
        ]
    }).then(fileObj => {
        console.log(fileObj);
        if(fileObj.canceled) return;

        setCurrentPath(mainWindow, fileObj.filePat);
        console.log(currentFilePath);
        if(next) next();
    }).catch(err => {
        console.log(err)
    });
};
