import * as React from "react";

export interface SheetProps {
  open: boolean;
  onClose?: () => void;
  /** Title shown in the sheet header (with a close button). */
  title?: string;
  /** Sticky footer area (e.g. Apply / Clear buttons). */
  footer?: React.ReactNode;
  /** Max sheet width in px. @default 460 */
  maxWidth?: number;
  children?: React.ReactNode;
}

/** Liquid Glass bottom sheet for filters, create/edit forms, confirmations. */
export function Sheet(props: SheetProps): JSX.Element;
