import React, { createContext, FC, ReactElement, useContext, useMemo } from 'react'

import translations from '../i18n/translations'

type ContextProps = {
  t: any
  locale: string
}

const I18nContext = createContext<ContextProps>({
  t: () => '',
  locale: ''
})

type Props = {
  children: ReactElement
  locale: string
}

export const I18nProvider: FC<Props> = ({ children, locale = 'en-us' }) => {
  const t = (key: string, replacements: any) => {
    const translation = translations[key]
    let text = (translation && translation[locale]) || key

    const matches = text.match(/\{(.*?)\}/g)

    if (matches) {
      matches.forEach((match: string) => {
        const tag = match.replace(/[{}]/g, '')
        const replacement = replacements[tag]

        if (replacement) {
          text = text.replace(`{${tag}}`, replacement)
        }
      })
    }

    return text
  }

  const context = useMemo(
    () => ({
      locale,
      t
    }),
    [locale, t]
  )

  return <I18nContext.Provider value={context}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
