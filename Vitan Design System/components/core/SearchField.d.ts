import * as React from "react";

export interface SearchFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Called when the clear (✕) button is tapped. */
  onClear?: () => void;
}

/** Capsule Liquid-Glass search field for the app header. */
export function SearchField(props: SearchFieldProps): JSX.Element;
