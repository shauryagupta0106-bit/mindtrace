import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  CheckCircle2,
  AlertCircle,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const isDestructive = variant === "destructive"
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                isDestructive
                  ? "bg-red-500/15 border border-red-500/25"
                  : "bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-pink-500/25"
              }`}>
                {isDestructive
                  ? <AlertCircle className="w-4 h-4 text-red-400" />
                  : <CheckCircle2 className="w-4 h-4" style={{ color: "hsl(330 80% 68%)" }} />
                }
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
