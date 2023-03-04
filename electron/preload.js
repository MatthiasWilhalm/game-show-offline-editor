const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  handleEventUpdate: (callback) => {
    const sub = (...args) => callback(...args);
    ipcRenderer.on('update-event', sub);
    return () => ipcRenderer.removeListener('update-event', sub);
  },
  handleEventSave: (callback) => {
    const sub = (...args) => callback(...args);
    ipcRenderer.on('save-request', sub);
    return () => ipcRenderer.removeListener('save-request', sub);
  },
  setTitle: (title) => ipcRenderer.send('set-title', title),
  saveEvent: (event) => ipcRenderer.send('save', event),
})