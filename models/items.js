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

        if (options.task === 'change-status-one') {
            return ItemsModels.updateOne({_id: id}, {status});
        }
        if (options.task === 'change-status-multi') {
            return ItemsModels.updateMany({_id: { $in: id}}, {status: currentStatus});
        }
    },

    deleteItem: (id, options) => {
        return ItemsModels.deleteOne({_id: id});
    },
}