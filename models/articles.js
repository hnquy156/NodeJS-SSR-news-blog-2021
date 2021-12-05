const util = require('util');
const fs = require('fs');

const NotifyConfig = require(__path_configs + 'notify');
const ArticlesModels = require(__path_schemas + 'articles');
const FileHelpers = require(__path_helpers + 'file');
const folderUploads = `${__path_uploads}articles/`;
const stringsHelpers = require(__path_helpers + 'string');

module.exports = {
    getList: (condition, options) => {
        return ArticlesModels
            .find(condition)
            .sort(options.sort)
            .skip(options.skip)
            .limit(options.limit);
    },

    getItem: (id, options = null) => {
        return ArticlesModels.findById({_id: id});
    },

    countItems: (condition) => {
        return ArticlesModels.countDocuments(condition);
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
            await ArticlesModels.updateOne({_id: id}, data);
            return {id, status, notify: NotifyConfig.CHANGE_STATUS_SUCCESS};
        }
        if (options.task === 'change-status-multi') {
            data.status = currentStatus;
            return ArticlesModels.updateMany({_id: { $in: id}}, data);
        }
    },

    changeSpecial: async (id, currentSpecial, options) => {
	    const special		= currentSpecial === 'active' ? 'inactive' : 'active';
        const data = {
            special,
            modified: {
                user_id: '',
                user_name: 'Admin',
                time: Date.now(),
            },
        }

        if (options.task === 'change-special-one') {
            await ArticlesModels.updateOne({_id: id}, data);
            return {id, special, notify: NotifyConfig.CHANGE_SPECIAL_SUCCESS};
        }
        if (options.task === 'change-special-multi') {
            data.special = currentSpecial;
            return ArticlesModels.updateMany({_id: { $in: id}}, data);
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
            await ArticlesModels.updateOne({_id: id}, data);
            return {id, ordering: +ordering, notify: NotifyConfig.CHANGE_ORDERING_SUCCESS}
        }
        if (options.task === 'change-ordering-multi') {
            const promiseOrdering = id.map((ID, index) => {
                data.ordering = +ordering[index]
                return ArticlesModels.updateOne({_id: ID}, data);
            });
            return await Promise.all(promiseOrdering);
        }
    },

    changeGroup: async (id, group_id, group_name, options) => {
        const data = {
            'group.id': group_id,
            'group.name': group_name,
            modified: {
                user_id: '',
                user_name: 'Admin',
                time: Date.now(),
            },
        }

        if (options.task === 'change-group') {
            await ArticlesModels.updateOne({_id: id}, data);
            return {id, notify: NotifyConfig.CHANGE_GROUP};
        }
    },

    deleteItem: async (id, options) => {
        if (options.task === 'delete-one') {
            const item = await ArticlesModels.findById(id);
            FileHelpers.removeFile(folderUploads, item.thumb);
            return ArticlesModels.deleteOne({_id: id});
        }
        if (options.task === 'delete-multi') {
            const items = await ArticlesModels.find({_id: { $in: id}}, 'thumb');
            items.forEach(item => FileHelpers.removeFile(folderUploads, item.thumb));
            return ArticlesModels.deleteMany({_id: { $in: id}});
        }
    },

    saveItem: (item, options) => {
        item.slug = stringsHelpers.changeToSlug(item.slug);
        item['group.id'] = item.group_id;
        item['group.name'] = item.group_name;

        if (options.task === 'add') {
            item.created = {
                user_id: '',
                user_name: 'Admin',
                time: Date.now(),
            }
            return ArticlesModels(item).save();

        }
        if (options.task === 'edit') {
            item.modified = {
                user_id: '',
                user_name: 'Admin',
                time: Date.now(),
            }
            return ArticlesModels.updateOne({_id: item.id}, item);
        }
    },
}