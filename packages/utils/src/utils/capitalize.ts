import is from './is'

function capitalize(str: any): string {
  if (!is.String(str)) {
    return ''
  }

  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default capitalize
