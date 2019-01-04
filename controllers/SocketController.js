const EmployeeService = require('../services/EmployeeService');

class SocketController {
    constructor() {
    }

    static async getEmployeeList(params) {
        try {
            let employees = await EmployeeService.getAll();
            let resp = {
                data: employees,
                error: null,
                success: true,
            };

            return resp;

        } catch (error) {
            return { error }
        }
    }
}

module.exports = SocketController;