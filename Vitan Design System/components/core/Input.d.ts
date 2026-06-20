import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Field label above the control. */
  label?: string;
  /** Helper text below. */
  hint?: string;
  /** Render a <textarea>. @default false */
  multiline?: boolean;
  /** Phosphor icon class shown inside, before the field. */
  prefix?: string | null;
}

/** iOS rounded-fill text input / textarea, with focus ring in Vitan green. */
export function Input(props: InputProps): JSX.Element;
