import { reactive, readonly } from 'vue'

interface Alert {
  id: string
  title: string
  text?: string
  mode?: string
  isDismissible?: boolean
  autoDismiss?: boolean
}

const state = reactive({
  alerts: [] as Alert[],
})

function addAlert(alert: Omit<Alert, 'id'>) {
  const id = Date.now().toString()
  state.alerts.push({ id, ...alert })
}

function removeAlert(id: string) {
  const index = state.alerts.findIndex(alert => alert.id === id)
  if (index !== -1)
    state.alerts.splice(index, 1)
}

export function useAlerts() {
  return readonly({
    alerts: state.alerts,
    addAlert,
    removeAlert,
  })
}
