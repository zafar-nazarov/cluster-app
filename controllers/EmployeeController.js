const EmployeeModel = require('../models/EmployeeModel');

class EmployeeController {
    constructor() {
    }

    static async getAll(req, res) {
        let count = await EmployeeModel.count();
        let list = await EmployeeModel.find().populate('positions');
        let resp = {
            data: {
                count: count,
                items: list
            },
            error: null,
            success: true,
        };

        res.json(resp);
        res.end();
    }
}

module.exports = EmployeeController;