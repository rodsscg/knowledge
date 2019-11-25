exports.up = ({ schema } = knex) => {

    return schema.alterTable('users', (table) => {
        table.timestamp('deletedAt')
    })
};

exports.down = ({ schema } = knex) => {

    return schema.alterTable('users', (table) => {
        table.dropColumn('deletedAt')
    })
};
