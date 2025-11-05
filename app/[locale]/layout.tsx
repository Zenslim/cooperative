import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { Inter } from 'next/font/google'
import ErrorBoundary from '../../components/ErrorBoundary'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

const locales = ['en', 'np']

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata = {
  title: 'Wu-Wei Cooperative OS',
  description: 'Where Life Flows - Transparency-First Cooperative Management System',
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound()

  let messages
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
