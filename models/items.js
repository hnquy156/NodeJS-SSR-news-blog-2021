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

    changeOrdering: async (id, ordering, options) => {
        if (options.task === 'change-ordering-one') {
            return ItemsModels.updateOne({_id: id}, {ordering});
        }
        if (options.task === 'change-ordering-multi') {
            const promiseOrdering = id.map((ID, index) => {
                return ItemsModels.updateOne({_id: ID}, {ordering: ordering[index]});
            });
            return await Promise.all(promiseOrdering);
        }
    },

    deleteItem: (id, options) => {
        if (options.task === 'delete-one')
            return ItemsModels.deleteOne({_id: id});
        if (options.task === 'delete-multi')
            return ItemsModels.deleteMany({_id: { $in: id}});
    },
}