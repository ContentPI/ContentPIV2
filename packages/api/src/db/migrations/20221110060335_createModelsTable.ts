import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

  return knex.schema.createTable('models', (table: any) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('name', 100).notNullable()
    table.string('description', 255).notNullable()
    table.json('fields').notNullable()
    table.json('relationships').notNullable()
    table.boolean('active').notNullable().defaultTo(false)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('models')
}
