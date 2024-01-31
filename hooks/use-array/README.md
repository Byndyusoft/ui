# `@byndyusoft-ui/use-array`

### Installation

```
npm i @byndyusoft-ui/use-array
```

### Usage

```ts
import useArray from './useArray';

function MyComponent() {
    const { list, append, prepend, filter, sort, clear, reset } = useArray<number>([1, 2, 3]);

    const handleAppend = () => append(4);
    const handleFilter = () => filter(item => item % 2 === 0);

    return (
        <div>
            <ul>
                {list.map(item => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
            <button onClick={handleAppend}>Append</button>
            <button onClick={handleFilter}>Filter</button>
        </div>
    );
}
```

### Properties and Functions

-   list: The current state of the array.
-   append(item): Adds an item to the end of the array.
-   prepend(item): Adds an item to the beginning of the array.
-   filter(cb): Filters the array based on a provided callback function.
-   sort(cb): Sorts the array based on a provided callback function.
-   clear(): Clears all items from the array.
-   reset(): Resets the array to its initial value.
