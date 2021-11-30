const ItemsModels = require(__path_schemas + 'items');


module.exports = {
    getList: () => {
        return ItemsModels.find({});
    },
}