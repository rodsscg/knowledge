exports.up = ({ schema } = knex) => {

    return schema.createTable('categories', (table) => {

        //Columns
        table.increments('id')
            .primary()
        table.string('name')
            .notNull()

        //Foreign Keys
        table.integer('parentId')
            .references('id')
            .inTable('categories')
    })
}

exports.down = ({ schema } = knex) => {
    return schema.dropTable('categories')
}
