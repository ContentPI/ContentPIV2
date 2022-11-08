import { mergeTypeDefs } from '@graphql-tools/merge'

import Error from './Error'
import Scalar from './Scalar'
import User from './User'

export default mergeTypeDefs([Error, Scalar, User])
