exports.up = ({ schema } = knex) => {
    
    return schema.createTable('users', (table) => {
        
        table.increments('id')
            .primary()
        table.string('name')
            .notNull()
        table.string('email')
            .notNull()
            .unique()
        table.string('password')
            .notNull()
        table.string('admin')
            .notNull()
            .defaultTo('false')
    })
};

exports.down = ({ schema } = knex) => {
    return schema.dropTable('users')
};
