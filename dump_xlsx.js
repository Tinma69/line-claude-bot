const ExcelJS = require('exceljs');
(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('osusowake_posting_takatsuki.xlsx');
  wb.eachSheet(ws => {
    console.log('\n===== シート: ' + ws.name + ' (行数 ' + ws.rowCount + ') =====');
    ws.eachRow((row, n) => {
      const vals = row.values.slice(1).map(v => {
        if (v && typeof v === 'object' && 'formula' in v) return '=' + v.formula;
        return v == null ? '' : v;
      });
      console.log(n + ': ' + vals.join(' | '));
    });
  });
})();
