import type { FlatfileListener } from '@flatfile/listener'
import { DelimiterExtractor } from '@flatfile/plugin-delimiter-extractor'
import { JSONExtractor } from '@flatfile/plugin-json-extractor'
import { PSVExtractor } from '@flatfile/plugin-psv-extractor'
import { TSVExtractor } from '@flatfile/plugin-tsv-extractor'
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor'
import { XMLExtractor } from '@flatfile/plugin-xml-extractor'
import { ZipExtractor } from '@flatfile/plugin-zip-extractor'

export default async function (listener: FlatfileListener) {
  listener.use(JSONExtractor())
  listener.use(ExcelExtractor())
  listener.use(XMLExtractor())
  listener.use(PSVExtractor())
  listener.use(TSVExtractor())
  listener.use(DelimiterExtractor('txt', { delimiter: '~' }))
  listener.use(ZipExtractor())
}
