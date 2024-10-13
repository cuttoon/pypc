const CustomError = require('../Service/errors');

const documents = {
  title: 'string',
  summary: 'string',
  ids:'number',
  user_id: 'number'
    
};

const validateObj = (validate, data) => {
    const error = {};
    const fields = Object.keys(data);

    Object.keys(validate).forEach(ele => {
        if (!fields.includes(ele) || !data[ele]) {
            if(!isNaN(data[ele]) ){
                if (data[ele]>0 && ele=="ids"){
                
                    if (data[ele]?.lenght === 0 || data[ele]=='') {
                        error[ele] = ['This field may not be blank.'];                 
                    }
                }
            }

        } else if (Array.isArray(validate[ele])) {
            if (data[ele]?.lenght === 0 || data[ele]=='') {
                error[ele] = ['This field may not be blank.'];                 
            } else if (!validate[ele].includes(typeof data[ele])) {                
                error[ele] = [`This field must be an ${validate[ele][0]} or null`];
            }
        } else {

            if (["fini", "ffin"].includes(ele) && data[ele]=="Invalid Date") {
                error[ele] = [`This field must be date`];
            }  

            if ((validate[ele] !== typeof data[ele]) && !["fini", "ffin"].includes(ele)) {
                error[ele] = [`This field must be an ${validate[ele]}`];
            }           
        }
    }); 
    return error;
};

const validateDocuments = (data) => {
    

    const error = validateObj(documents, data);

    if (Object.keys(error).length >= 1) {
        throw new CustomError(error, 400);
    } else {

        return data;
    }
};

module.exports = validateDocuments;