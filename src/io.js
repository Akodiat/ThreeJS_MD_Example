/**
 * Parse CSV with header, if you need to do anything fancier,
 * just use PapaParse instead (https://www.papaparse.com/)
 * @param {string} csvStr String representing the CSV content
 * @param {string} sep Separator (defaults to comma)
 * @returns {object}
 */
function parseCSV(csvStr, sep=",") {
    let lines = csvStr.split("\n");
    const header = lines[0].split(sep).map(v=>v.trim());
    lines = lines.slice(1).filter(l => l !== "");
    return lines.map(line => {
        const values = line.split(sep);
        const e = {};
        header.forEach((key, i) =>
            e[key] = parseFloat(values[i].trim())
        );
        return e;
    });
}

/**
 * Read a text file from an url path
 * @param {string} path
 * @returns {string}
 */
async function textFileFromPath(path) {
    const res = await fetch(path);
    const text = await res.text();

    return text;
}

export {parseCSV, textFileFromPath}