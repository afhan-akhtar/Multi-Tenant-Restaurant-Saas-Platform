"use client";

import { useEffect, useRef } from "react";

/**
 * Keyboard-wedge barcode / QR scanner: rapid keystrokes terminated by Enter.
 * Skips when focus is in a text field unless inside `[data-barcode-scan]`.
 *
 * @param {(code: string) => void} onScan
 * @param {{ enabled?: boolean, minLength?: number, interKeyMs?: number }} options
 */
export function useBarcodeScanner(onScan, options = {}) {
  const { enabled = true, minLength = 4, interKeyMs = 55 } = options;
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    if (!enabled) return undefined;

    let buffer = "";
    let lastTs = 0;

    function shouldIgnoreTarget(el) {
      if (!el) return false;
      const tag = el.tagName;
      if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") return false;
      return !el.closest("[data-barcode-scan]");
    }

    function flush(reasonKey) {
      const code = buffer.trim();
      buffer = "";
      if (code.length >= minLength) {
        onScanRef.current?.(code);
      }
      void reasonKey;
    }

    function onKeyDown(e) {
      if (shouldIgnoreTarget(e.target)) return;

      const now = Date.now();
      if (now - lastTs > interKeyMs && buffer.length > 0) {
        buffer = "";
      }
      lastTs = now;

      if (e.key === "Enter") {
        if (buffer.length > 0) {
          e.preventDefault();
          flush("enter");
        }
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        buffer += e.key;
      }
    }

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [enabled, minLength, interKeyMs]);
}
