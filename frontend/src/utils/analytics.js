export const calculateAnalytics = (thoughts) => {

  const total = thoughts.length

  const success = thoughts.filter(
    t => t.resultType === "success"
  ).length

  const failed = thoughts.filter(
    t => t.resultType === "failed"
  ).length

  const successRate = total
    ? (success / total) * 100
    : 0

  return {
    total,
    success,
    failed,
    successRate
  }

}