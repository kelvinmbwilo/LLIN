var wijmo;
(function (wijmo) {
    (function (_grid) {
        'use strict';

        /**
        * ExcelConverter class provides function exporting FlexGrid to xlsx file
        * and importing xlsx file to FlexGrid.
        */
        var ExcelConverter = (function () {
            function ExcelConverter() {
            }
            /**
            * export the FlexGrid to xlsx file
            *
            * @param flex the FlexGrid need be exported to xlsx file
            * @param convertOption the options for exporting.
            */
            ExcelConverter.export = function (flex, convertOption) {
                if (typeof convertOption === "undefined") { convertOption = { includeColumnHeader: true }; }
                var file = {
                    worksheets: [],
                    creator: 'Mike Lu',
                    created: new Date(),
                    lastModifiedBy: 'Mike Lu',
                    modified: new Date(),
                    activeWorksheet: 0
                }, result, index, grid;

                if (wijmo.isArray(flex)) {
                    for (index = 0; index < flex.length; index++) {
                        grid = flex[index];

                        // export the FlexGrid to xlsx.
                        this._exportFlexGrid(grid, file, convertOption);
                    }
                } else {
                    this._exportFlexGrid(flex, file, convertOption);
                }

                result = xlsx(file);

                result.base64Array = this._base64DecToArr(result.base64);

                return result;
            };

            /**
            * import the xlsx file
            *
            * @param file the base64 string converted from xlsx file
            * @param flex the Flex Grid need bind the data import from xlsx file
            * @param convertOption the options for importing.
            * @param moreSheets flexgrid array for importing multiple sheets of the excel file.
            */
            ExcelConverter.import = function (file, flex, convertOption, moreSheets) {
                if (typeof convertOption === "undefined") { convertOption = { includeColumnHeader: true }; }
                var fileData = this._base64EncArr(new Uint8Array(file)), fileObj = xlsx(fileData), currentIncludeRowHeader = convertOption.includeColumnHeader, sheetCount = 1, sheetIndex = 0, c = 0, r = 0, columns, columnSetting, column, columnHeader, sheetHeaders, sheetHeader, headerForamt, row, currentSheet, columnCount, isGroupHeader, item, nextRowIdx, nextRow, isGroupBelow, groupRow, frozenColumns, frozenRows, formula, flexHostElement, cellIndex, cellStyle, styledCells, excelThemes, mergedRange;

                flex.columns.clear();
                flex.rows.clear();
                flex.frozenColumns = 0;
                flex.frozenRows = 0;

                if (fileObj.worksheets.length === 0) {
                    return;
                }

                excelThemes = fileObj.themes;

                if (moreSheets) {
                    sheetCount = fileObj.worksheets.length;
                }

                for (; sheetIndex < sheetCount; sheetIndex++) {
                    styledCells = {};
                    mergedRange = {};
                    r = 0;
                    columns = [];
                    currentSheet = fileObj.worksheets[sheetIndex];

                    if (convertOption.includeColumnHeader) {
                        r = 1;
                        if (currentSheet.data.length <= 1) {
                            currentIncludeRowHeader = false;
                            r = 0;
                        }
                        sheetHeaders = currentSheet.data[0];
                    }
                    columnCount = this._getColumnCount(currentSheet.data);
                    isGroupBelow = currentSheet.isGroupBelow;

                    if (sheetIndex > 0) {
                        flexHostElement = document.createElement('div');
                        flex = new _grid.FlexGrid(flexHostElement);
                    }

                    for (c = 0; c < columnCount; c++) {
                        flex.columns.push(new wijmo.grid.Column());
                        if (!!currentSheet.colsWidth[c]) {
                            flex.columns[c].width = currentSheet.colsWidth[c] * 8;
                        }
                    }

                    for (; r < currentSheet.data.length; r++) {
                        isGroupHeader = false;
                        row = currentSheet.data[r];

                        if (row && row[0]) {
                            nextRowIdx = r + 1;
                            while (nextRowIdx < currentSheet.data.length) {
                                nextRow = currentSheet.data[nextRowIdx];
                                if (nextRow) {
                                    if ((isNaN(row[0].groupLevel) && !isNaN(nextRow[0].groupLevel)) || (!isNaN(row[0].groupLevel) && row[0].groupLevel < nextRow[0].groupLevel)) {
                                        isGroupHeader = true;
                                    }
                                    break;
                                } else {
                                    nextRowIdx++;
                                }
                            }
                        }

                        if (isGroupHeader && isGroupBelow) {
                            groupRow = new _grid.GroupRow();
                            groupRow.level = isNaN(row[0].groupLevel) ? 0 : row[0].groupLevel;
                            flex.rows.push(groupRow);
                        } else {
                            flex.rows.push(new _grid.Row());
                        }

                        if (!!currentSheet.rowsHeight[r]) {
                            flex.rows[r].height = currentSheet.rowsHeight[r] * 96 / 72;
                        }

                        for (c = 0; c < columnCount; c++) {
                            if (!row) {
                                flex.setCellData(currentIncludeRowHeader ? r - 1 : r, c, '');
                                this._setColumn(columns, c, undefined);
                            } else {
                                item = row[c];
                                formula = item ? item.formula : undefined;
                                if (formula && formula[0] !== '=') {
                                    formula = '=' + formula;
                                }
                                formula = formula ? this._parseFlexSheetFormula(formula) : undefined;
                                flex.setCellData(currentIncludeRowHeader ? r - 1 : r, c, formula && moreSheets ? formula : this._getItemValue(item));
                                if (!isGroupHeader) {
                                    this._setColumn(columns, c, item);
                                }
                                if (item && !item.visible && columns[c]) {
                                    columns[c].visible = false;
                                }

                                // Set styles for the cell in current processing sheet.
                                cellIndex = r * columnCount + c;
                                cellStyle = item ? item.style : undefined;
                                if (cellStyle) {
                                    styledCells[cellIndex] = {
                                        fontWeight: cellStyle.bold ? 'bold' : 'none',
                                        fontStyle: cellStyle.italic ? 'italic' : 'none',
                                        textDecoration: cellStyle.underline ? 'underline' : 'none',
                                        textAlign: cellStyle.hAlign,
                                        fontFamily: cellStyle.fontName ? cellStyle.fontName : '',
                                        fontSize: cellStyle.fontSize ? cellStyle.fontSize + 'px' : '',
                                        color: this._parseExcelColor(cellStyle.fontColor, excelThemes),
                                        backgroundColor: this._parseExcelColor(cellStyle.fillColor, excelThemes)
                                    };
                                }
                            }
                        }

                        if (row && row[0] && !row[0].rowVisible) {
                            flex.rows[currentIncludeRowHeader ? r - 1 : r].visible = false;
                        }
                    }

                    if (currentSheet.frozenPane) {
                        frozenColumns = currentSheet.frozenPane.columns;
                        if (wijmo.isNumber(frozenColumns) && !isNaN(frozenColumns)) {
                            flex.frozenColumns = frozenColumns;
                        }

                        frozenRows = currentSheet.frozenPane.rows;
                        if (wijmo.isNumber(frozenRows) && !isNaN(frozenRows)) {
                            flex.frozenRows = currentIncludeRowHeader && frozenRows > 0 ? frozenRows - 1 : frozenRows;
                        }
                    }

                    for (c = 0; c < flex.columnHeaders.columns.length; c++) {
                        columnSetting = columns[c];
                        column = flex.columns[c];
                        if (currentIncludeRowHeader) {
                            sheetHeader = sheetHeaders ? sheetHeaders[c] : undefined;
                            if (sheetHeader && sheetHeader.value) {
                                headerForamt = this._parseExcelFormat(sheetHeader);
                                columnHeader = wijmo.Globalize.format(sheetHeader.value, headerForamt);
                            } else {
                                columnHeader = this._numAlpha(c);
                            }
                        } else {
                            columnHeader = this._numAlpha(c);
                        }
                        column.header = columnHeader;
                        if (columnSetting) {
                            if (columnSetting.dataType) {
                                column.dataType = columnSetting.dataType;
                            }
                            column.format = columnSetting.format;
                            column.visible = columnSetting.visible;
                        }
                    }

                    // Get merged cell ranges for current sheet.
                    if (currentSheet.mergedRange) {
                        mergedRange = this._getMergeRangeForImporting(currentSheet.mergedRange, columnCount);
                    }

                    // Set sheet related info for importing.
                    flex['wj_sheetInfo'] = {
                        name: currentSheet.name,
                        styledCells: styledCells,
                        mergedRange: mergedRange
                    };

                    if (sheetIndex === 0) {
                        flex['styledCells'] = styledCells;
                        flex['mergedRange'] = mergedRange;
                    }

                    if (moreSheets && sheetIndex > 0) {
                        moreSheets.push(flex);
                    }
                }
            };

            // export the flexgrid to excel file
            ExcelConverter._exportFlexGrid = function (flex, file, convertOption) {
                var worksheetData = [], columnSettings = [], workSheet = {
                    name: '',
                    data: [],
                    frozenPane: {}
                }, groupLevel = 0, worksheetDataHeader, rowHeight, column, row, groupRow, isGroupRow, value, columnSetting, ri, ci;

                // Set sheet name for the exporting sheet.
                workSheet.name = flex['wj_sheetInfo'] ? flex['wj_sheetInfo'].name : '';

                // add the headers in the worksheet.
                if (convertOption.includeColumnHeader) {
                    for (ri = 0; ri < flex.columnHeaders.rows.length; ri++) {
                        worksheetDataHeader = [];
                        rowHeight = flex.columnHeaders.rows[ri].height;
                        if (rowHeight) {
                            rowHeight = rowHeight * 72 / 96;
                        }
                        for (ci = 0; ci < flex.columnHeaders.columns.length; ci++) {
                            column = flex.columnHeaders.columns[ci];
                            value = flex.columnHeaders.getCellData(ri, ci, true);

                            if (ri === 0) {
                                columnSetting = this._getColumnSetting(column, flex.columnHeaders.columns.defaultSize);
                                columnSettings.push(columnSetting);
                            }

                            worksheetDataHeader.push({
                                value: value,
                                bold: true,
                                autoWidth: true,
                                hAlign: columnSetting.alignment,
                                width: columnSetting.width,
                                height: rowHeight,
                                visible: columnSetting.visible
                            });
                        }
                        if (worksheetDataHeader.length > 0) {
                            worksheetDataHeader[0].rowVisible = true;
                        }
                        worksheetData.push(worksheetDataHeader);
                    }
                } else {
                    for (ci = 0; ci < flex.columnHeaders.columns.length; ci++) {
                        column = flex.columnHeaders.columns[ci];

                        columnSetting = this._getColumnSetting(column, flex.columnHeaders.columns.defaultSize);
                        columnSettings.push(columnSetting);
                    }
                }

                for (ri = 0; ri < flex.cells.rows.length; ri++) {
                    row = flex.rows[ri];
                    isGroupRow = row instanceof _grid.GroupRow;

                    if (isGroupRow) {
                        groupRow = wijmo.tryCast(row, _grid.GroupRow);
                        groupLevel = groupRow.level + 1;
                    }

                    // Only the common grid row and group row need be exported to xlsx file.
                    if (row.constructor === wijmo.grid.Row || isGroupRow) {
                        worksheetData.push(this._parseFlexGridRowToSheetRow(flex, row, ri, columnSettings, convertOption.includeColumnHeader, isGroupRow, groupLevel));
                    }
                }

                workSheet.data = worksheetData;
                workSheet.frozenPane = {
                    rows: convertOption.includeColumnHeader ? (flex.frozenRows + flex.columnHeaders.rows.length) : flex.frozenRows,
                    columns: flex.frozenColumns
                };

                file.worksheets.push(workSheet);
            };

            // Parse the row data of flex grid to a sheet row
            ExcelConverter._parseFlexGridRowToSheetRow = function (flex, row, rowIndex, columnSettings, includeColumnHeader, isGroupRow, groupLevel) {
                var rowHeight = row.height, worksheetDataItem = [], columnSetting, format, val, unformattedVal, groupHeader, isFormula, cellIndex, cellStyle, mergedCells, rowSpan, colSpan;

                if (rowHeight) {
                    rowHeight = rowHeight * 72 / 96;
                }

                for (var ci = 0; ci < flex.columnHeaders.columns.length; ci++) {
                    colSpan = 1;
                    rowSpan = 1;
                    if (flex['wj_sheetInfo']) {
                        cellIndex = (rowIndex + (flex.itemsSource && !includeColumnHeader ? 1 : 0)) * flex.columns.length + ci;

                        // Get merge range for cell.
                        if (flex['wj_sheetInfo'].mergedRange) {
                            mergedCells = flex['wj_sheetInfo'].mergedRange[cellIndex];
                            if (mergedCells) {
                                if (rowIndex + (flex.itemsSource && !includeColumnHeader ? 1 : 0) === mergedCells.topRow && ci === mergedCells.leftCol) {
                                    rowSpan = mergedCells.bottomRow - mergedCells.topRow + 1;
                                    colSpan = mergedCells.rightCol - mergedCells.leftCol + 1;
                                } else {
                                    continue;
                                }
                            }
                        }

                        // Get style for cell.
                        if (flex['wj_sheetInfo'].styledCells) {
                            cellStyle = flex['wj_sheetInfo'].styledCells[cellIndex];
                        }
                    }

                    columnSetting = columnSettings[ci];
                    val = flex.getCellData(rowIndex, ci, true);
                    unformattedVal = flex.getCellData(rowIndex, ci, false);
                    isFormula = val && wijmo.isString(val) && val.length > 1 && val[0] === '=';
                    format = columnSetting.format ? this._parseCellFormat(columnSetting.format) : wijmo.isDate(unformattedVal) ? this._formatMap['d'] : !wijmo.isNumber(unformattedVal) || wijmo.isInt(unformattedVal) ? 'General' : this._formatMap['n'];

                    if (isGroupRow && row['hasChildren'] && ci === flex.columns.firstVisibleIndex) {
                        // Process the group header of the flex grid.
                        if (val) {
                            groupHeader = val;
                        } else {
                            groupHeader = row.dataItem && row.dataItem.groupDescription ? row.dataItem.groupDescription.propertyName + ': ' + row.dataItem.name + ' (' + row.dataItem.items.length + ' items)' : '';
                        }
                        worksheetDataItem.push({
                            value: groupHeader,
                            formula: isFormula ? this._parseExcelFormula(val) : null,
                            formatCode: format,
                            bold: true,
                            autoWidth: true,
                            width: columnSetting.width,
                            height: rowHeight,
                            visible: columnSetting.visible,
                            groupLevel: groupLevel - 1,
                            indent: groupLevel - 1
                        });
                    } else {
                        // Add the cell content
                        worksheetDataItem.push({
                            value: format === 'General' ? val : unformattedVal,
                            formula: isFormula ? this._parseExcelFormula(val) : null,
                            formatCode: format,
                            bold: cellStyle && cellStyle.fontWeight && cellStyle.fontWeight === 'bold',
                            italic: cellStyle && cellStyle.fontStyle && cellStyle.fontStyle === 'italic',
                            underline: cellStyle && cellStyle.textDecoration && cellStyle.textDecoration === 'underline',
                            fontName: cellStyle ? this._parseExcelFontFamily(cellStyle.fontFamily) : 'Arial',
                            fontSize: cellStyle && cellStyle.fontSize ? cellStyle.fontSize.substring(0, cellStyle.fontSize.indexOf('px')) : '12',
                            color: cellStyle && cellStyle.color ? cellStyle.color.substring(1) : '',
                            fillColor: cellStyle && cellStyle.backgroundColor ? cellStyle.backgroundColor.substring(1) : '',
                            autoWidth: true,
                            hAlign: cellStyle && cellStyle.textAlign ? cellStyle.textAlign : wijmo.isDate(unformattedVal) && columnSetting.alignment === '' ? 'left' : columnSetting.alignment,
                            width: columnSetting.width,
                            height: rowHeight,
                            visible: columnSetting.visible,
                            groupLevel: groupLevel,
                            colSpan: colSpan,
                            rowSpan: rowSpan
                        });
                    }
                }

                if (worksheetDataItem.length > 0) {
                    worksheetDataItem[0].rowVisible = row.visible;
                }

                return worksheetDataItem;
            };

            // get merged cells ranges.
            ExcelConverter._getMergeRangeForImporting = function (mergeCells, columnCount) {
                var mergeRange = {}, index = 0, cellRng, rowIndex, colIndex, cellIndex;

                for (; index < mergeCells.length; index++) {
                    cellRng = mergeCells[index];
                    if (cellRng) {
                        for (rowIndex = cellRng.topRow; rowIndex <= cellRng.bottomRow; rowIndex++) {
                            for (colIndex = cellRng.leftCol; colIndex <= cellRng.rightCol; colIndex++) {
                                cellIndex = rowIndex * columnCount + colIndex;
                                mergeRange[cellIndex] = new _grid.CellRange(cellRng.topRow, cellRng.leftCol, cellRng.bottomRow, cellRng.rightCol);
                            }
                        }
                    }
                }

                return mergeRange;
            };

            // Parse the cell format of flex grid to excel format.
            ExcelConverter._parseCellFormat = function (format) {
                var dec = 0, mapFormat = this._formatMap[format[0]], decimalArray = [], xlsxFormat;

                if (format.length > 1) {
                    dec = parseInt(format.substr(1));
                }

                if (!isNaN(dec)) {
                    for (var i = 0; i < dec; i++) {
                        decimalArray.push(0);
                    }
                }

                if (decimalArray.length > 0) {
                    xlsxFormat = mapFormat.replace(/\.00/g, '.' + decimalArray.join(''));
                } else {
                    if (mapFormat) {
                        xlsxFormat = mapFormat;
                    } else {
                        xlsxFormat = format.replace(/tt/, 'AM/PM');
                    }
                }

                return xlsxFormat;
            };

            // parse the basic excel format to js format
            ExcelConverter._parseExcelFormat = function (item) {
                if (item === undefined || item === null || item.value === undefined || item.value === null || isNaN(item.value)) {
                    return undefined;
                }

                if (!item.formatCode || item.formatCode === 'General') {
                    return '';
                }

                var format = '', lastDotIndex;
                if (wijmo.isDate(item.value)) {
                    format = item.formatCode.replace(/[\/\s\-,]m+|m+[\/\s\-,]/, function (str) {
                        return str.toUpperCase();
                    }).replace(/\\[\-\s,]/g, function (str) {
                        return str.substring(1);
                    }).replace(/;@/g, '').replace(/\[\$\-.+\]/g, '');
                } else if (wijmo.isNumber(item.value)) {
                    lastDotIndex = item.formatCode.lastIndexOf('.');
                    if (item.formatCode.indexOf('$') > -1) {
                        format = 'c';
                    } else if (item.formatCode[item.formatCode.length - 1] === '%') {
                        format = 'p';
                    } else {
                        format = 'n';
                    }

                    if (lastDotIndex > -1) {
                        format += item.formatCode.substring(lastDotIndex, item.formatCode.lastIndexOf('0')).length;
                    } else {
                        format += '0';
                    }
                }

                return format;
            };

            // Parse the css font family to excel font family.
            ExcelConverter._parseExcelFontFamily = function (fontFamily) {
                var firstQuotesIndex, lastQuotesIndex;

                if (fontFamily) {
                    firstQuotesIndex = fontFamily.indexOf('"');
                    lastQuotesIndex = fontFamily.lastIndexOf('"');

                    if (firstQuotesIndex > -1 && firstQuotesIndex !== lastQuotesIndex) {
                        fontFamily = fontFamily.substring(firstQuotesIndex + 1, lastQuotesIndex);
                    }
                } else {
                    fontFamily = 'Arial';
                }
                return fontFamily;
            };

            // Parse the excel color to css color.
            ExcelConverter._parseExcelColor = function (color, excelThemes) {
                var parsedColor = '';

                if (!color) {
                    return parsedColor;
                }

                switch (color.colorType) {
                    case 'rgbColor':
                        parsedColor = '#' + color.value.substring(2);
                        break;
                    case 'indexedColor':
                        parsedColor = '#' + this._indexedColors[color.value];
                        break;
                    case 'themeColor':
                        parsedColor = this._getColorFromExcelTheme(excelThemes[color.theme], color.value);
                        break;
                }

                return parsedColor;
            };

            // Get the color by the excel theme color and value.
            ExcelConverter._getColorFromExcelTheme = function (themeColor, value) {
                var numberVal, color, hslArray;

                if (value) {
                    numberVal = +value;
                    color = new wijmo.Color('#' + themeColor), hslArray = color.getHsl();

                    // About the tint value and theme color convert to rgb color,
                    // please refer https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.tabcolor.aspx
                    if (numberVal < 0) {
                        hslArray[2] = hslArray[2] * (1.0 + numberVal);
                    } else {
                        hslArray[2] = hslArray[2] * (1.0 - numberVal) + (1 - 1 * (1.0 - numberVal));
                    }

                    color = wijmo.Color.fromHsl(hslArray[0], hslArray[1], hslArray[2]);
                    return color.toString();
                }

                return '';
            };

            // Parse the formula to excel formula.
            ExcelConverter._parseExcelFormula = function (formula) {
                var func = formula.substring(1, formula.indexOf('(')).toLowerCase(), format;

                switch (func) {
                    case 'ceiling':
                    case 'floor':
                        formula = formula.substring(0, formula.lastIndexOf(')')) + ', 1)';
                        break;
                    case 'round':
                        formula = formula.substring(0, formula.lastIndexOf(')')) + ', 0)';
                        break;
                    case 'text':
                        format = formula.substring(formula.lastIndexOf(','), formula.lastIndexOf('\"'));
                        format = this._parseCellFormat(format.substring(format.lastIndexOf('\"') + 1));
                        formula = formula.substring(0, formula.lastIndexOf(',') + 1) + '\"' + format + '\")';
                        break;
                }
                return formula;
            };

            // Parse the excel formula to flexsheet formula.
            ExcelConverter._parseFlexSheetFormula = function (excelFormula) {
                var func = excelFormula.substring(1, excelFormula.indexOf('(')).toLowerCase(), value, format;

                switch (func) {
                    case 'ceiling':
                    case 'floor':
                    case 'round':
                        excelFormula = excelFormula.substring(0, excelFormula.lastIndexOf(',')) + ')';
                        break;
                    case 'text':
                        value = +excelFormula.substring(excelFormula.indexOf('(') + 1, excelFormula.indexOf(','));
                        format = excelFormula.substring(excelFormula.indexOf('\"'), excelFormula.lastIndexOf('\"'));
                        format = this._parseExcelFormat({
                            value: value,
                            formatCode: format.substring(format.lastIndexOf('\"') + 1)
                        });
                        excelFormula = excelFormula.substring(0, excelFormula.indexOf('\"') + 1) + format + '\")';
                        break;
                }
                return excelFormula;
            };

            // Gets the column setting, include width, visible, format and alignment
            ExcelConverter._getColumnSetting = function (column, defaultWidth) {
                var width = column.width;

                width = width ? width / 8 : defaultWidth / 8;

                return {
                    width: width,
                    visible: column.visible,
                    format: column.format,
                    alignment: column.getAlignment()
                };
            };

            // gets column count for specific row
            ExcelConverter._getColumnCount = function (sheetData) {
                var columnCount = 0, data;

                for (var i = 0; i < sheetData.length; i++) {
                    data = sheetData[i];
                    if (data && data.length > columnCount) {
                        columnCount = data.length;
                    }
                }

                return columnCount;
            };

            // convert the column index to alphabet
            ExcelConverter._numAlpha = function (i) {
                var t = Math.floor(i / 26) - 1;
                return (t > -1 ? this._numAlpha(t) : '') + this._alphabet.charAt(i % 26);
            };

            // Get DataType for value of the specific excel item
            ExcelConverter._getItemType = function (item) {
                if (item === undefined || item === null || item.value === undefined || item.value === null || isNaN(item.value)) {
                    return undefined;
                }

                return wijmo.getType(item.value);
            };

            // Set column definition for the Flex Grid
            ExcelConverter._setColumn = function (columns, columnIndex, item) {
                var dataType;
                if (!columns[columnIndex]) {
                    columns.push({
                        visible: true,
                        dataType: this._getItemType(item),
                        format: this._parseExcelFormat(item)
                    });
                } else {
                    dataType = this._getItemType(item);
                    if (columns[columnIndex].dataType === undefined || (dataType !== undefined && dataType !== 1 /* String */ && columns[columnIndex].dataType === 1 /* String */)) {
                        columns[columnIndex].dataType = dataType;
                    }

                    if (!columns[columnIndex].format) {
                        columns[columnIndex].format = this._parseExcelFormat(item);
                    }
                }
            };

            // Get value from the excel cell item
            ExcelConverter._getItemValue = function (item) {
                if (item === undefined || item === null || item.value === undefined || item.value === null) {
                    return undefined;
                }

                var val = item.value;

                if (wijmo.isNumber(val) && isNaN(val)) {
                    return '';
                } else if (val instanceof Date && isNaN(val.getTime())) {
                    return '';
                } else {
                    return val;
                }
            };

            // taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding#The_.22Unicode_Problem.22
            ExcelConverter._b64ToUint6 = function (nChr) {
                return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
            };

            // decode the base64 string to int array
            ExcelConverter._base64DecToArr = function (sBase64, nBlocksSize) {
                var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length, nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);

                for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
                    nMod4 = nInIdx & 3;
                    nUint24 |= this._b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
                    if (nMod4 === 3 || nInLen - nInIdx === 1) {
                        for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                            taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                        }
                        nUint24 = 0;
                    }
                }
                return taBytes;
            };

            // taken from https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
            /* Base64 string to array encoding */
            ExcelConverter._uint6ToB64 = function (nUint6) {
                return nUint6 < 26 ? nUint6 + 65 : nUint6 < 52 ? nUint6 + 71 : nUint6 < 62 ? nUint6 - 4 : nUint6 === 62 ? 43 : nUint6 === 63 ? 47 : 65;
            };

            ExcelConverter._base64EncArr = function (aBytes) {
                var nMod3 = 2, sB64Enc = "";

                for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
                    nMod3 = nIdx % 3;
                    if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) {
                        sB64Enc += "\r\n";
                    }
                    nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
                    if (nMod3 === 2 || aBytes.length - nIdx === 1) {
                        sB64Enc += String.fromCharCode(this._uint6ToB64(nUint24 >>> 18 & 63), this._uint6ToB64(nUint24 >>> 12 & 63), this._uint6ToB64(nUint24 >>> 6 & 63), this._uint6ToB64(nUint24 & 63));
                        nUint24 = 0;
                    }
                }

                return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');
            };
            ExcelConverter._formatMap = {
                n: '#,##0.00',
                c: '$#,##0.00_);($#,##0.00)',
                p: '0.00%',
                d: 'm/dd/yyyy'
            };
            ExcelConverter._alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

            ExcelConverter._indexedColors = [
                '000000', 'FFFFFF', 'FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF',
                '000000', 'FFFFFF', 'FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF',
                '800000', '008000', '000080', '808000', '800080', '008080', 'C0C0C0', '808080',
                '9999FF', '993366', 'FFFFCC', 'CCFFFF', '660066', 'FF8080', '0066CC', 'CCCCFF',
                '000080', 'FF00FF', 'FFFF00', '00FFFF', '800080', '800000', '008080', '0000FF',
                '00CCFF', 'CCFFFF', 'CCFFCC', 'FFFF99', '99CCFF', 'FF99CC', 'CC99FF', 'FFCC99',
                '3366FF', '33CCCC', '99CC00', 'FFCC00', 'FF9900', 'FF6600', '666699', '969696',
                '003366', '339966', '003300', '333300', '993300', '993366', '333399', '333333',
                '000000', 'FFFFFF'];
            return ExcelConverter;
        })();
        _grid.ExcelConverter = ExcelConverter;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));

