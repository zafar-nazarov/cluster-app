const EmployeeService = require('../services/EmployeeService');

class EmployeeController {
    constructor() {
    }

    static async getAll(req, res) {
        try {
            let employees = await EmployeeService.getAll();
            let resp = {
                data: employees,
                error: null,
                success: true,
            };

            res.json(resp);
            res.end();
            return null;

        } catch (error) {
            res.end();
            return { error };
        }
    }
}

module.exports = EmployeeController;