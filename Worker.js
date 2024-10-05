// worker.js
let opeBalance = parseFloat(localStorage.getItem('opeBalance')) || 0;
const ratePerMinute = 0.002;
const ratePerSecond = ratePerMinute / 60;

setInterval(() => {
    opeBalance += ratePerSecond; // زيادة الرصيد
    localStorage.setItem('opeBalance', opeBalance.toFixed(4)); // تحديث الرصيد في localStorage
    postMessage(opeBalance.toFixed(4)); // إرسال الرصيد الجديد إلى الصفحة الرئيسية
}, 500);
