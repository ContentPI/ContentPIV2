const orm: any = (db: any) => ({
  async findAll({ table, fields, where = null, orWhere = null }: any) {
    if (!table) {
      throw new Error('Table name is required')
    }

    if (!fields) {
      throw new Error('Fields are required')
    }

    let result = null

    if (where) {
      result = await db(table).select(fields).where(where)
    }

    if (where && orWhere) {
      result = await db(table).select(fields).where(where).orWhere(orWhere)
    }

    if (!where) {
      result = await db(table).select(fields)
    }

    return result.length > 0 ? result : null
  },
  async create({ table, data }: any) {
    if (!table) {
      throw new Error('Table name is required')
    }

    if (!data) {
      throw new Error('Data is required')
    }

    const result = await db(table).insert(data)

    return result
  },
  async update({ table, data, where }: any) {
    if (!table) {
      throw new Error('Table name is required')
    }

    if (!data) {
      throw new Error('Data is required')
    }

    if (!where) {
      throw new Error('Where is required')
    }

    const result = await db(table).update(data).where(where)

    return result
  },
  async delete({ table, where }: any) {
    if (!table) {
      throw new Error('Table name is required')
    }

    if (!where) {
      throw new Error('Where is required')
    }

    const result = await db(table).delete().where(where)

    return result
  }
})

export default orm
