'use client';

export async function writeToClipboard(text: string): Promise<boolean> {
  if (!navigator?.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function readFromClipboard(): Promise<string | null> {
  if (!navigator?.clipboard) {
    return null;
  }

  if (document.visibilityState !== 'visible') {
    return null;
  }

  try {
    return await navigator.clipboard.readText();
  } catch {
    return null;
  }
}
