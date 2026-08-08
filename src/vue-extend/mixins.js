import {
  showLoadingToast,
  closeToast,
  showToast,
  showDialog,
  showConfirmDialog
} from 'vant'

function normalizePayload (payload) {
  if (typeof payload === 'boolean') {
    return { show: payload }
  }
  if (typeof payload === 'string') {
    return { title: payload, show: true }
  }
  if (payload !== undefined && Object.keys(payload).length > 0) {
    return Object.assign({ show: true }, payload)
  }
  return {}
}

export default {
  base: {
    computed: {
      setting () {
        return this.$store.state.setting
      },
      base () {
        return this.$store.state.base
      }
    },
    methods: {
      // 展示全局 loading
      loading (payload) {
        const data = normalizePayload(payload)
        if (data.show === false) {
          closeToast()
          return
        }
        showLoadingToast({
          message: data.title || '加载中',
          forbidClick: true,
          duration: 0
        })
      },
      // 展示轻提示
      toast (payload) {
        const data = normalizePayload(payload)
        if (data.show === false) {
          closeToast()
          return
        }
        showToast({
          message: data.title || '',
          duration: data.time || 2000,
          forbidClick: !!data.isShowMask
        })
      },
      // 展示提示弹窗
      alert (payload) {
        const data = normalizePayload(payload)
        const message = data.content || data.title || ''
        return showDialog({
          title: data.content ? (data.title || '提示') : '提示',
          message,
          confirmButtonText: data.buttonText || '确定'
        })
      },
      // 展示确认弹窗
      confirm (payload) {
        const data = normalizePayload(payload)
        return showConfirmDialog({
          title: data.title || '确认',
          message: data.content || '',
          confirmButtonText: data.confirmText || '确定',
          cancelButtonText: data.cancelText || '取消'
        }).then(() => {
          if (typeof data.onConfirm === 'function') {
            data.onConfirm()
          }
        }).catch(() => {
          if (typeof data.onCancel === 'function') {
            data.onCancel()
          }
        })
      },
      setTitle (title) {
        // hack在微信等webview中无法修改document.title的情况
        document.title = title
        const iframe = document.getElementById('iframe')
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.location.reload()
        }
      }
    }
  }
}
