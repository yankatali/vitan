import * as React from "react";

export interface SegmentedOption {
  label: string;
  value: string;
}

export interface SegmentedControlProps {
  /** Options as strings or {label, value} objects. */
  options: (string | SegmentedOption)[];
  value: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

/** iOS segmented control with a sliding glass thumb. */
export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
