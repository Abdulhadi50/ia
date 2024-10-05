let opeBalance = parseFloat(localStorage.getItem('opeBalance')) || 0;
const ratePerMinute = 0.002;
const ratePerSecond = ratePerMinute / 60;

setInterval(() => {
  opeBalance += ratePerSecond;
  localStorage.setItem('opeBalance', opeBalance.toFixed(4));
  postMessage(opeBalance.toFixed(4)); // إرسال الرصيد الحالي إلى الصفحة الرئيسية
}, 1000);
