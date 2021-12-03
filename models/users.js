const util = require('util');

const NotifyConfig = require(__path_configs + 'notify');
const UsersModels = require(__path_schemas + 'users');

module.exports = {
    getList: (condition, options) => {
        return UsersModels
            .find(condition)
            .sort(options.sort)
            .skip(options.skip)
            .limit(options.limit);
    },

    getItem: (id, options = null) => {
        return UsersModels.findById({_id: id});
    },

    countItems: (condition) => {
        return UsersModels.countDocuments(condition);
    },

    changeStatus: async (id, currentStatus, options) => {
	    const status		= currentStatus === 'active' ? 'inactive' : 'active';
        const data = {
            status,
            modified: {
                user_id: '',
                user_name: 'Admin',
                time: Date.now(),
            },
        }

        if (options.task === 'change-status-one') {
            await UsersModels.updateOne({_id: id}, data);
            return {id, status, notify: NotifyConfig.CHANGE_STATUS_SUCCESS};
        }
        if (options.task === 'change-status-multi') {
            data.status = currentStatus;
            return UsersModels.updateMany({_id: { $in: id}}, data);
        }
    },

    changeOrdering: async (id, ordering, options) => {
        const data = {
            ordering: +ordering,
            modified: {
                user_id: '',
                user_name: 'Admin',
                time: Date.now(),
            },
        }
        if (options.task === 'change-ordering-one') {
            await UsersModels.updateOne({_id: id}, data);
            return {id, ordering: +ordering, notify: NotifyConfig.CHANGE_ORDERING_SUCCESS}
        }
        if (options.task === 'change-ordering-multi') {
            const promiseOrdering = id.map((ID, index) => {
                data.ordering = +ordering[index]
                return UsersModels.updateOne({_id: ID}, data);
            });
            return await Promise.all(promiseOrdering);
        }
    },

    deleteItem: (id, options) => {
        if (options.task === 'delete-one')
            return UsersModels.deleteOne({_id: id});
        if (options.task === 'delete-multi')
            return UsersModels.deleteMany({_id: { $in: id}});
    },

    saveItem: (item, options) => {
        item['group.id'] = item.group_id;
        item['group.name'] = item.group_name;

        if (options.task === 'add') {
            item.created = {
                user_id: '',
                user_name: 'Admin',
                time: Date.now(),
            }
            return UsersModels(item).save();

        }
        if (options.task === 'edit') {
            item.modified = {
                user_id: '',
                user_name: 'Admin',
                time: Date.now(),
            }
            return UsersModels.updateOne({_id: item.id}, item);
        }
    },
}