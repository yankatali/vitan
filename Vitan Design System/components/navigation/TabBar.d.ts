import * as React from "react";

export interface TabItem {
  value: string;
  label: string;
  /** Phosphor icon name WITHOUT weight prefix, e.g. "ph-storefront". Filled when active. */
  icon: string;
  /** Optional notification count. */
  badge?: number | string;
}

export interface TabBarProps {
  items: TabItem[];
  value: string;
  onChange?: (value: string) => void;
  /** Fixed-float above content (vs inline). @default true */
  floating?: boolean;
  style?: React.CSSProperties;
}

/**
 * Floating Liquid Glass tab bar (Telegram-iOS style); active tab gets a tinted pill + filled icon.
 * @startingPoint section="Navigation" subtitle="Floating Liquid Glass bottom tab bar" viewport="420x96"
 */
export function TabBar(props: TabBarProps): JSX.Element;
