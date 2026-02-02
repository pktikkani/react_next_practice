'use client';

import {useEffect, useRef, useState} from 'react';
export default function VendorListClient({ vendors }: VendorListClientProps) {
    const [searchText, setSearchText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const searchCountRef = useRef(0);
    const [displayCount, setDisplayCount] = useState(0);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);

    const filteredVendors = vendors.filter(function filterByName(v) {
        return v.CardName.toLowerCase().includes(searchText.toLowerCase());
    });

    useEffect(() => {
        console.log('Vendors Count: ', vendors.length);
        return function vendorCleanup() {
            console.log("Unmounting VendorListClient")
        }
    }, [])

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            const response = await fetch('https://jsonplaceholder.typicode.com/posts')
            const data = await response.json();
            setPosts(data);
            setLoading(false);
        }
        void fetchPosts();
    }, []);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent){
            if (event.key == 'Escape') setSearchText('');
        }
        window.addEventListener('keydown', handleKeyDown);
        return function cleanup() {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    useEffect(() => {
        function logEveryFiveSeconds(){
            console.log(new Date().toLocaleTimeString())
        }
        const intervalID: ReturnType<typeof setInterval> = setInterval(logEveryFiveSeconds, 5000);
        return function cleanup() {
            clearInterval(intervalID);
        }
    }, []);

    useEffect(() => {
        const savedText = localStorage.getItem('searchText');
        if (savedText) setSearchText(savedText);
    }, []);

    useEffect(() => {
        function saveText(){
            localStorage.setItem('searchText', searchText);
        }
        saveText();
    }, [searchText]);

    return (
        <div className="max-w-2xl mx-auto p-6 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold dark:text-white">Vendors</h1>
            </div>
            <input
                type="text"
                placeholder="Search vendors..."
                value={searchText}
                ref={inputRef}
                onChange={function handleChange(e) {
                    console.log('Search Count: ', ++searchCountRef.current);
                    setSearchText(e.target.value);
                }}
                className="w-1/2 p-3 border border-orange-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:bg-gray-800 dark:text-white dark:border-orange-500"
            />
            <button
                onClick={function handleShowCount() {
                    setDisplayCount(searchCountRef.current);
                }}
                className="ml-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Show Count
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Search count: {displayCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{filteredVendors.length} vendors found</p>
            <ul className="space-y-2">
                {filteredVendors.map(function renderVendor(v) {
                    return (
                        <li key={v.CardCode} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                            <span className="font-medium">{v.CardCode}</span> - {v.CardName}
                        </li>
                    );
                })}
            </ul>

            {loading ? <p className="dark:text-gray-400">Loading posts...</p> : (
                <ul className="space-y-2 mt-4">
                    {posts.map(function renderPost(p: Post) {
                        return (
                            <li key={p.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                                <span className="font-medium">{p.title}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}