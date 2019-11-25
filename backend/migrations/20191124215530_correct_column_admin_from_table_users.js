exports.up = ({ schema } = knex) => {
    
    return schema.alterTable('users', (table) => {
        table.boolean('admin')
            .notNull()
            .defaultTo(false)
            .alter()
    })
}

exports.down = ({ schema } = knex) => {

    return schema.alterTable('users', (table) => {
        table.string('admin')
            .notNull()
            .defaultTo('false')
            .alter()
    })
}
