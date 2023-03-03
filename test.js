window.electronAPI.on('update-event', (event, arg) => {
    document.getElementById('p').innerHTML = arg;
});