const XLSX = require("xlsx");

async function getExcelDataList(filePath) {
    try {
        const workbook = XLSX.readFile(filePath, {encoding: 'UTF-8', cellText:false, cellNF:false,raw:true});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet);
    } catch (e) {
        console.error(e);
        return [];
    }

}

async function updateExcelData(dataList, filePath) {
    try {
        const workbook = XLSX.readFile(filePath, {encoding: 'UTF-8', cellText:false, cellNF:false});
        const sheetName = workbook.SheetNames[0];
        workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(dataList);
        XLSX.writeFile(workbook, filePath);
    } catch (e) {
        console.error(e);
        return [];
    }

}
async function updateOneDataInExcel(dataList, id, newData, filePath) {
    try {
        // Find the data with the given id
        const index = dataList.findIndex(data => data.id == id);
        if (index === -1) {
            console.error('Data not found');
            return;
        }

        // Replace the data with the new data
        dataList[index] = newData;

        // Update the Excel file
        const workbook = XLSX.readFile(filePath, {encoding: 'UTF-8', cellText:false, cellNF:false});
        const sheetName = workbook.SheetNames[0];
        workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(dataList);
        XLSX.writeFile(workbook, filePath);
    } catch (e) {
        console.error(e);
    }
}


module.exports = {
    getExcelDataList,
    updateExcelData,
    updateOneDataInExcel
}