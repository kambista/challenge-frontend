const activeDialogs = new Set<HTMLDialogElement>();
let previousOverflow = '';

export function lockDialogScroll(dialog: HTMLDialogElement) {
  if (activeDialogs.size === 0) {
    previousOverflow = document.documentElement.style.overflow;
  }
  activeDialogs.add(dialog);
  document.documentElement.style.overflow = 'hidden';
}

export function unlockDialogScroll(dialog: HTMLDialogElement) {
  activeDialogs.delete(dialog);
  if (activeDialogs.size === 0) {
    document.documentElement.style.overflow = previousOverflow;
  }
}
