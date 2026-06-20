import * as React from "react";

export interface ProductBadge {
  label: string;
  tone?: "neutral" | "accent" | "favorite" | "sale" | "blue";
  solid?: boolean;
}

export interface ProductCardProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  price: number;
  /** Original price (strike-through) when on sale. */
  compareAt?: number | null;
  description?: string;
  /** One or more image URLs; >1 enables the swipeable carousel. */
  images?: string[];
  /** Optional corner badge. */
  badge?: ProductBadge | null;
  favorite?: boolean;
  onToggleFavorite?: (next: boolean) => void;
  onAddToCart?: () => void;
  /** Owner-only edit handler (shows the Edit button). */
  onEdit?: () => void;
  /** Owner-only delete handler (shows the Delete button). */
  onDelete?: () => void;
  /** Show Edit/Delete owner actions. @default false */
  owner?: boolean;
}

/**
 * The central Vitan product card: swipeable photos, name, price, description, actions.
 * @startingPoint section="Product" subtitle="Catalog product card with photo carousel + actions" viewport="380x440"
 */
export function ProductCard(props: ProductCardProps): JSX.Element;
