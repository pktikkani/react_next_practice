import {useCallback, useMemo, useState} from "react";

export function useItemFilter(items: Item[]) {
    const [searchText, setSearchText] = useState('');

    const filteredItems = useMemo(() => {
        return items.filter(i =>
            i.ItemName.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [items, searchText]);

    const clearSearch = useCallback(() => {
        setSearchText('');
    }, []);

    return { searchText, setSearchText, filteredItems, clearSearch };
}