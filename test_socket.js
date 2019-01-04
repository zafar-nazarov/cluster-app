const socket = require('socket.io-client')('http://127.0.0.1:8000');
console.log('start')
try {
    socket.on('connect', function () {
        console.log('Successfully connected to socket');
    });
    socket.on('employee.list', function (data) {
        console.log('Received Employee list: ', data);
    });
    socket.on('disconnect', function () {
        console.log('Disconnected from socket');
    });

    socket.emit('employee.list');

} catch (error) {
    console.log('ERROR', error);
}


// var totalCount = 0;
// var successCount = 0;
// var errorCount = 0;
//
// console.log('requesting...');
// var interval = setInterval( () => {
//     totalCount++;
//     http.get('http://localhost:8000/employees', (resp) => {
//         successCount++;
//     }).on('error', (err) => {
//         errorCount++;
//     })
// }, 1);
//
// setTimeout(() => {
//     clearInterval(interval);
//     console.log('=== TOTAL ===', totalCount);
//     console.log('=== SUCCESS ===', successCount);
//     console.log('=== ERROR ===', errorCount);
// }, 15000);

