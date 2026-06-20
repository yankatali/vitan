Formatted product price. Pass `compareAt` higher than `amount` to render a strike-through original + orange sale price.

```jsx
<PriceTag amount={24} />
<PriceTag amount={19.5} compareAt={28} size="lg" />
```

Integers render with no decimals; non-integers get two. `size`: sm/md/lg.
