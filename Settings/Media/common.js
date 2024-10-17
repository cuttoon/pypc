const path = require('path');
const fs = require('fs');

const deleteFiles = (data) => {    
    const fields = Object.keys(data);
    if (fields.length >= 1) {
        fields.forEach(element => {       
            const pathFile = path.join(path.resolve(), data[element][0].path);
            if (fs.existsSync(pathFile)) {
                try {
                    fs.unlinkSync(pathFile);
                    console.log('File removed');
                } catch (err) {
                    console.error('Something wrong happened removing the file', err);
                }
            }           
        });
    }
};

const filesAssingBody = (files, body)=> {
    const data = Object.assign({}, body);
    data.picture = files.picture ? files.picture[0].filename : null;
    return data;
};

const materialsAssingBody = (files, body)=> {
    const data = Object.assign({}, body);
    data.material = files.material ? files.material[0].filename : null;
    return data;
};

const reportsAssingBody = (files, body)=> {
    const data = Object.assign({}, body);
    data.report = files.report ? files.report[0].filename : null;
    return data;
};


module.exports = {
    deleteFiles,
    filesAssingBody,
    materialsAssingBody,
    reportsAssingBody
};