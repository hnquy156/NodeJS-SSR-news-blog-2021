const util = require('util');

const NotifyConfig = require(__path_configs + 'notify');
const rssModels = require(__path_schemas + 'rss');

module.exports = {
    getList: (condition, options) => {
        return rssModels
            .find(condition)
            .sort(options.sort)
            .skip(options.skip)
            .limit(options.limit);
    },

    getListFrontend: (options) => {
        const condition = {status: 'active'};
        let select = 'name ordering rss_link';
        let sort = {'ordering': 'asc'};
        let skip = null;
        let limit = null;

        if (options.task === 'rss-list') {
            return rssModels.find(condition).select(select).sort(sort).skip(skip).limit(limit);
        }
    },

    getItem: (id, options = null) => {
        return rssModels.findById({_id: id});
    },

    countItems: (condition) => {
        return rssModels.countDocuments(condition);
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
            await rssModels.updateOne({_id: id}, data);
            return {id, status, notify: NotifyConfig.CHANGE_STATUS_SUCCESS};
        }
        if (options.task === 'change-status-multi') {
            data.status = currentStatus;
            return rssModels.updateMany({_id: { $in: id}}, data);
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
            await rssModels.updateOne({_id: id}, data);
            return {id, ordering: +ordering, notify: NotifyConfig.CHANGE_ORDERING_SUCCESS}
        }
        if (options.task === 'change-ordering-multi') {
            const promiseOrdering = id.map((ID, index) => {
                data.ordering = +ordering[index]
                return rssModels.updateOne({_id: ID}, data);
            });
            return await Promise.all(promiseOrdering);
        }
    },

    deleteItem: (id, options) => {
        if (options.task === 'delete-one')
            return rssModels.deleteOne({_id: id});
        if (options.task === 'delete-multi')
            return rssModels.deleteMany({_id: { $in: id}});
    },

    saveItem: (item, options) => {
        
        if (options.task === 'add') {
            item.created = {
                user_id: '',
                user_name: 'user',
                time: Date.now(),
            }
            return rssModels(item).save();

        }
        if (options.task === 'edit') {
            item.modified = {
                user_id: '',
                user_name: 'Admin',
                time: Date.now(),
            }
            return rssModels.updateOne({_id: item.id}, item);
        }
    },
}