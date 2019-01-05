const socket = require('socket.io-client')('http://127.0.0.1:8000');
console.log('Socket started');

var totalCount = 0;
var successCount = 0;

socket.on('connect', function () {
    console.log('Successfully connected to socket');
});
socket.on('employee.list', function (data) {
    successCount++;
});
socket.on('disconnect', function () {
    console.log('Disconnected from socket');
});

console.log('requesting...');
var interval = setInterval( () => {
    totalCount++;
    socket.emit('employee.list');
}, 1);

setTimeout(() => {
    clearInterval(interval);
    console.log('=== TOTAL ===', totalCount);
    console.log('=== SUCCESS ===', successCount);
}, 15000);

