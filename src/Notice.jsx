export default () => {

  const message = import.meta.env.VITE_HMSTDR_NOTICE

  if (!message) {
    return null
  }

  return (
    <div className="notice">
      <span className="logo">⚠</span>
      <p>{message}</p>
    </div>
  )
}