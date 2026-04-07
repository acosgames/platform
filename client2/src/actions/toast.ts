import { btToast } from "./buckets";

export type ToastStatus = "info" | "success" | "warning" | "error";

export type ToastPayload = {
    title: string;
    description?: string;
    status?: ToastStatus;
    duration?: number;
    isClosable?: boolean;
};

export function showToast(payload: ToastPayload) {
    const current = btToast.get() || {};
    const nextId = (current.id || 0) + 1;

    btToast.set({
        id: nextId,
        open: true,
        title: payload.title,
        description: payload.description || "",
        status: payload.status || "info",
        duration: payload.duration ?? 3000,
        isClosable: payload.isClosable ?? true,
    });
}

export function hideToast(id?: number) {
    const current = btToast.get();
    if (!current) return;
    if (typeof id === "number" && current.id !== id) return;

    btToast.assign({ open: false });
}
