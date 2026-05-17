const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getData:         ()        => ipcRenderer.invoke('get-data'),
  saveData:        (payload) => ipcRenderer.invoke('save-data', payload),
  setWindowHeight: (height)  => ipcRenderer.invoke('set-window-height', height),
  setCorner:       (corner)  => ipcRenderer.invoke('set-corner', corner),
  setOpacity:      (opacity) => ipcRenderer.invoke('set-opacity', opacity),
});
