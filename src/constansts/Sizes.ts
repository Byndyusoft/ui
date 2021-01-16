enum Sizes {
    ExtraLarge,
    Large,
    Medium,
    Small,
    ExtraSmall
}

type TSize = keyof typeof Sizes;

export { Sizes, TSize };
