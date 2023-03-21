import gql from 'graphql-tag'

export default gql`
  "Model type"
  type Field {
    field: String!
    type: String!
    notNull: Boolean!
  }

  type Model {
    id: UUID!
    app: String!
    name: String!
    description: String!
    fields: [Field!]!
    relations: [Relation!]!
    active: Boolean!
  }

  type BlogPostResponse {
    blogPosts: [BlogPost!]!
  }

  union BlogPostResult = BlogPostResponse | Error

  type Query {
    getBlogPosts: BlogPostResult
    getBlogPostBySlug(slug: String!): BlogPostResult
    getBlogPostById(id: UUID!): BlogPostResult
  }

  type Mutation {
    createBlogPost(input: ICreateBlogPost): BlogPostResult
    deleteBlogPost(id: UUID!): BlogPostResult
    editBlogPost(input: IEditBlogPost): BlogPostResult
  }
`
