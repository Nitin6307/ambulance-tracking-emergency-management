
import { X } from 'lucide-react'

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4">

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-slate-900 dark:text-white"
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 text-slate-700 dark:text-slate-200">
          {children}
        </div>

      </div>
    </div>
  )
}

export default Modal
