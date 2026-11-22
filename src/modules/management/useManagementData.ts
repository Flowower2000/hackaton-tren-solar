import { useCallback, useEffect, useState } from 'react'
import { createIntervention, getInterventions, getReports, updateReport } from '../../shared/repository'
import type { EnvironmentalReport, Intervention } from '../../shared/types'

export function useManagementData() {
  const [reports, setReports] = useState<EnvironmentalReport[]>(getReports)
  const [interventions, setInterventions] = useState<Intervention[]>(getInterventions)

  const refresh = useCallback(() => {
    setReports(getReports())
    setInterventions(getInterventions())
  }, [])

  useEffect(() => {
    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [refresh])

  const changeReport = useCallback((id: string, changes: Parameters<typeof updateReport>[1]) => {
    updateReport(id, changes)
    refresh()
  }, [refresh])

  const addIntervention = useCallback((input: Parameters<typeof createIntervention>[0]) => {
    createIntervention(input)
    refresh()
  }, [refresh])

  return { reports, interventions, refresh, changeReport, addIntervention }
}
