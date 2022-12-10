const request = require("request");

const randomCel = () => {
    let ddd = parseInt(Math.random() * (11 - 99) + 99);
    while ((ddd % 10) === 0) {
        ddd = parseInt(Math.random() * (11 - 99) + 99);
    }
    return "55" + ddd.toString() + "9" + parseInt(Math.random() * (80000000 - 99999999) + 99999999).toString();
};
const requestMobileNumber = (exOperation) => {
    // console.log("requestMobileNumber")
    // console.log(`calling ${process.env.MOBILE_NUMBER_URL}`)
    const url = `http://172.18.34.90:55113/discovercarriertransform/${randomCel()}/true`;
    // `http://172.18.34.196:55113/discovercarriertransform/${randomCel()}/true`;
    // console.log(`calling ${url}`)
    return new Promise((resolve, reject) => {
        request(url, exOperation, (error, response, body) => {
            if (error) {
                return reject(error);
            }

            const bodyJson = JSON.parse(body);

            if (!bodyJson.CarrierClientCode) {
                return reject(exOperation);
            }
            if ((exOperation && bodyJson.CarrierClientCode == exOperation) || !exOperation) {
                resolve(bodyJson);
            } else {
                reject(exOperation)
            }
        });
    });
};
const getValidNumber = (exOperation) => {
    return requestMobileNumber(exOperation)
        .then(bodyData => console.log(`${bodyData.RegionCode};${bodyData.TransformedNumber}`))
        .catch((exOperation) => getValidNumber(exOperation));
};

const getPhoneNumbers = async (qty, exOperation) => {
    console.log("qyt: ", qty)
    const promises = Array.from(new Array(qty)).map(() => getValidNumber(exOperation))
    const result = await Promise.all(promises);
    return result
};

getPhoneNumbers(1, '1')

