import { AnimatePresence, motion } from "framer-motion";

/** Bottom-center success/info toast. Parent clears via onDone timeout. */
export default function Toast({ message, kind = "ok" }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="toast px-4 py-2.5 text-sm font-semibold"
            style={{ color: kind === "error" ? "var(--danger)" : "var(--ink)" }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
