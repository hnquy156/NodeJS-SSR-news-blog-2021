const ItemsModels = require(__path_schemas + 'items');


module.exports = {
    getList: (condition) => {
        return ItemsModels.find(condition);
    },
}