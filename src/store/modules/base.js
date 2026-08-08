import { browserVersions } from '../../utils/browser'

const origin = typeof location !== 'undefined' ? location.origin : ''
const someUrlRegEx = new RegExp(`^${origin}/#/member/wallet/[^/]*$`)
const firstHrefValue = typeof firstHref !== 'undefined' ? firstHref : undefined

const state = {
  notSomeUrl: firstHrefValue !== undefined ? !someUrlRegEx.test(firstHrefValue) : 'no firstHref',
  browserVersions: typeof navigator !== 'undefined' ? browserVersions() : {}
}

export default {
  state
}
