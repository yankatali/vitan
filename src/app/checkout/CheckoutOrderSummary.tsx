import {CheckoutOrderItem} from "@/app/checkout/CheckoutOrderItem";
import {formatUah} from "@/lib/formatters";
import {getProductPriceUah} from "@/lib/wholesalePricing";
import type {CheckoutOrderSummaryProps} from "@/types/props";


export const CheckoutOrderSummary = ({
    cartProducts,
    isWholesaleActive,
    pricingConfig,
    totalQuantity,
    totalPrice,
    copy,
}: CheckoutOrderSummaryProps) => {
    return (
        <div className="vitan-glass-block rounded-3xl p-4">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]" style={{marginBottom: '8px'}}>{copy.orderSummaryTitle}</p>
            <div className="flex flex-col gap-2">
                {cartProducts.map(({product, quantity}) => (
                    <CheckoutOrderItem
                        key={product.id}
                        product={product}
                        quantity={quantity}
                        price={getProductPriceUah(product, isWholesaleActive, pricingConfig)}
                        copy={copy}
                    />
                ))}
                <div className="flex justify-end">
                    <div className="rounded-[20px] bg-black/5 px-4 py-3" style={{width: 'fit-content', minWidth: '35%'}}>
                        <p className="text-[12px] text-[var(--text-secondary)]">{totalQuantity} {copy.totalSuffix}</p>
                        <p className="text-[14px] font-bold leading-5">{formatUah(totalPrice)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
