class Spaceremit {
    static SERVER_KEY = 'YOUR_PRIVATE_KEY';
    static BASE_URL = 'https://spaceremit.com/api/v2/payment_info/';

    constructor() {
        this.data_return = null;
    }

    async sendApiRequest(data, requestMethod = 'POST') {
        data.private_key = Spaceremit.SERVER_KEY;

        const options = {
            hostname: 'spaceremit.com',
            path: '/api/v2/payment_info/',
            method: requestMethod,
            headers: {
                'authorization': Spaceremit.SERVER_KEY,
                'Content-Type': 'application/json'
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, res => {
                let data = '';
                res.on('data', chunk => {
                    data += chunk;
                });

                res.on('end', () => {
                    const decodedResponse = JSON.parse(data);
                    if (res.statusCode === 200 && decodedResponse) {
                        this.data_return = decodedResponse;
                        resolve(true);
                    } else {
                        this.data_return = { response_status: 'failed', message: `Failed to connect to spaceremit with status code ${res.statusCode}` };
                        resolve(false);
                    }
                });
            });

            req.on('error', error => {
                this.data_return = { response_status: 'failed', message: error.message };
                resolve(false);
            });

            req.write(JSON.stringify(data));
            req.end();
        });
    }

    async checkPayment(paymentId, acceptableData) {
        const spaceremit = new Spaceremit();
        const data = { payment_id: paymentId };

        try {
            const response = await spaceremit.sendApiRequest(data);
            if (response) {
                const responseData = spaceremit.data_return.data;

                if (spaceremit.data_return.response_status === 'success') {
                    let notAcceptableDataFound = false;
                    let notAcceptableDataValue = null;

                    for (const acceptK in acceptableData) {
                        if (Object.hasOwnProperty.call(acceptableData, acceptK)) {
                            if (acceptK === 'status_tag') {
                                if (!acceptableData[acceptK].includes(responseData.status_tag)) {
                                    notAcceptableDataFound = true;
                                    notAcceptableDataValue = responseData.status_tag;
                                    break;
                                }
                            } else if (acceptableData[acceptK] !== responseData[acceptK]) {
                                notAcceptableDataFound = true;
                                notAcceptableDataValue = responseData[acceptK];
                                break;
                            }
                        }
                    }

                    if (!notAcceptableDataFound) {
                        this.data_return = responseData;
                        return true;
                    } else {
                        this.data_return = `Not acceptable value is (${notAcceptableDataValue})`;
                        return false;
                    }
                } else {
                    this.data_return = spaceremit.data_return.message;
                    return false;
                }
            } else {
                this.data_return = spaceremit.data_return.message;
                return false;
            }
        } catch (error) {
            this.data_return = error.message;
            return false;
        }
    }
}
