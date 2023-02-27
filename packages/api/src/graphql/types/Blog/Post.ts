import gql from 'graphql-tag'

export default gql`
  "Post type"
  type BlogPost {
    id: UUID!
    title: String!
    slug: String!
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
