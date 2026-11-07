import { X } from 'lucide-react'

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-700 p-5">
          <h2 className="text-lg font-semibold text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>

      </div>
    </div>
  )
}

export default Modal