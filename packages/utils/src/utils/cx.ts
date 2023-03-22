import is from './is'

type Attrs = {
  ccn: string
  data: string[]
  className?: string
}

export const cx = (...classes: any): string => {
  const classArr = []

  for (let i = 0; i < classes.length; i += 1) {
    const arg: any = classes[i]

    if (!arg) {
      continue
    }

    const type = typeof arg

    if (type === 'string' || type === 'number') {
      classArr.push(arg)
    }

    if (is.Array(arg)) {
      classArr.push(...arg)
    }

    if (type === 'object') {
      for (const key in arg) {
        if (arg[key]) {
          if (arg[key] === true) {
            classArr.push(key)
          }

          if (is.String(arg[key]) && !classArr.includes(arg[key])) {
            classArr.push(arg[key])
          }
        }
      }
    }
  }

  return classArr.join(' ')
}

export const classGenerator = ({ ccn, data, className }: Attrs) => {
  const classList = [ccn]

  data.forEach((key) => {
    if (key !== '') {
      classList.push(`${ccn}-${key}`)
    }
  })

  if (className) {
    classList.push(className)
  }

  return classList.join(' ')
}
