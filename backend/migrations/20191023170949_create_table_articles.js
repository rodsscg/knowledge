const tableName = 'articles'

exports.up = ({ schema } = knex) => {
    
    return schema.createTable(tableName, (table) => {

        //Columns
        table.increments('id')
            .primary()
        table.string('name')
            .notNull()
        table.string('description', 1000)
            .notNull()
        table.string('imageUrl', 1000)
        table.binary('content')
            .notNull()

        //Foreign Keys
        table.integer('userId')
            .references('id')
            .inTable('users')
        table.integer('categoryId')
            .references('id')
            .inTable('categories')
    })
}

exports.down = ({ schema } = knex) => schema.dropTable(tableName)
