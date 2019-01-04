const EmployeeModel = require('../models/EmployeeModel');

class EmployeeService {
    constructor() {
    }

    static async getAll() {
        try {
            let count = await EmployeeModel.countDocuments();
            let list = await EmployeeModel.aggregate([
                {
                    $lookup: {
                        from: 'positions',
                        localField: 'position',
                        foreignField: '_id',
                        as: 'position'
                    }
                },
                {
                    $unwind: {
                        path: '$position',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        name: 1,
                        age: 1,
                        comment: 1,
                        position: '$position.name'
                    }
                }
            ]);

            return {
                count: count,
                items: list
            }

        } catch (error) {
            return { error };
        }
    }
}

module.exports = EmployeeService;