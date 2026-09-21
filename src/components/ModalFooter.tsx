export function ModalFooter({
  onClose,
  saving,
  onDelete,
  confirmMessage,
}: {
  onClose: () => void
  saving: boolean
  onDelete?: () => Promise<unknown>
  confirmMessage: string
}) {
  const handleDelete = async () => {
    if (!onDelete || !confirm(confirmMessage)) return
    await onDelete()
    onClose()
  }

  return (
    <div className="mt-2 flex items-center justify-between">
      {onDelete ? (
        <button type="button" onClick={handleDelete} className="text-sm font-medium text-[var(--color-danger)] hover:underline">
          Eliminar
        </button>
      ) : (
        <span />
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm font-medium hover:bg-[var(--color-surface-alt)]"
        >
          Cancel·lar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-contrast)] hover:opacity-90 disabled:opacity-60"
        >
          Desar
        </button>
      </div>
    </div>
  )
}
