const ItemsModels = require(__path_schemas + 'items');


module.exports = {
    getList: (condition, options) => {
        return ItemsModels
            .find(condition)
            .skip(options.skip)
            .limit(options.limit);
    },
    countItems: (condition) => {
        return ItemsModels.countDocuments(condition);
    },
}