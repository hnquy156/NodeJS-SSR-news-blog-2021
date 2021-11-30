
const createFilterStatus = async (currentStatus, collection) => {
    const ItemsModel = require(__path_schemas + collection);
    const filterStatus = [
        {name: 'All', value: 'all', color: 'secondary', count: 15},
        {name: 'Active', value: 'active', color: 'secondary', count: 7},
        {name: 'Inactive', value: 'inactive', color: 'secondary', count: 8},
    ];
    const promiseCount = filterStatus.map(element => {
        const condition = element.value !== 'all' ? {status: element.value} : {};
        if (element.value === currentStatus) element.color = 'info';

        return ItemsModel.countDocuments(condition).then(count => {element.count = count});
    });
    await Promise.all(promiseCount);
    return filterStatus;
}

module.exports = {
    createFilterStatus,
}