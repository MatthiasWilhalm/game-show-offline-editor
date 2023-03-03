// Import the necessary Electron modules
const { contextBridge, ipcRenderer } = require('electron');

// Exposed protected methods in the render process
// contextBridge.exposeInMainWorld(
//     // Allowed 'ipcRenderer' methods
//     'bridge', {
//         // From main to render
//         sendSettings: (message) => {
//             ipcRenderer.on('sendSettings', message);
//         }
//     }
// );

// ipcRenderer.on('asynchronous-reply', (_event, arg) => {
//     console.log(arg) // prints "pong" in the DevTools console
// });


contextBridge.exposeInMainWorld('electronAPI', {
  handleEventUpdate: (callback) => ipcRenderer.on('update-event', callback)
})