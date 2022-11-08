import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del()

  // Inserts seed entries
  await knex('users').insert([
    {
      id: '0719b631-a234-4ae1-9eb4-14c9c6e568c6',
      username: 'admin',
      password: '7c222fb2927d828af22f592134e8932480637c0d',
      email: 'admin@ranchosanpancho.com',
      role: 'god',
      active: true
    }
  ])
}
