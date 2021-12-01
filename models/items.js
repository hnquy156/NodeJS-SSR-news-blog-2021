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

    changeStatus: (id, currentStatus, options) => {
	    const status		= currentStatus === 'active' ? 'inactive' : 'active';

        return ItemsModels.updateOne({_id: id}, {status});
    }
}