const http = require('http');

var totalCount = 0;
var successCount = 0;
var errorCount = 0;
var milliseconds = 10000;

console.log(`requesting ${milliseconds/1000} seconds ...`);
var interval = setInterval( () => {
    totalCount++;
    http.get('http://localhost:8000/employees', (resp) => {
        successCount++;
    }).on('error', (err) => {
        errorCount++;
    })
}, 1);

setTimeout(() => {
    clearInterval(interval);
    console.log('=== TOTAL ===', totalCount);
    console.log('=== SUCCESS ===', successCount);
    console.log('=== ERROR ===', errorCount);
}, milliseconds);

