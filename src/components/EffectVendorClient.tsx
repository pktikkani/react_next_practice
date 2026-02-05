'use client';

import {useEffect, useState} from 'react';

export default function EffectVendorClient({vendors}: VendorListClientProps) {
    const [searchText, setSearchText] = useState('');
    const [showVendors, setShowVendors] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [showPosts, setShowPosts] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState('Alice');
    const [bio, setBio] = useState<string | null>(null);

    const filteredVendors = vendors.filter(function filterByName(v) {
        return v.CardName.toLowerCase().includes(searchText.toLowerCase());
    });

    // Test 1: Mount + unmount logging (empty deps = run once)
    useEffect(function mountEffect() {
        console.log('EffectVendorClient mounted. Vendor count:', vendors.length);
        return function cleanupMount() {
            console.log('EffectVendorClient unmounting...');
        };
    }, []);

    // Test 2: Global event listener with cleanup
    useEffect(function keydownEffect() {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setSearchText('');
                console.log('Escape pressed — search cleared');
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return function cleanupKeydown() {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Test 3: Interval timer with cleanup
    useEffect(function intervalEffect() {
        const intervalId = setInterval(function tick() {
            console.log('Tick:', new Date().toLocaleTimeString());
        }, 5000);
        return function cleanupInterval() {
            clearInterval(intervalId);
        };
    }, []);

    // Test 4: localStorage read on mount + write on change
    useEffect(function readLocalStorage() {
        const saved = localStorage.getItem('effectSearchText');
        if (saved) setSearchText(saved);
    }, []);

    useEffect(function writeLocalStorage() {
        localStorage.setItem('effectSearchText', searchText);
    }, [searchText]);

    // Test 5: Fetch with no dependency (runs on mount)
    useEffect(function fetchPostsEffect() {
        setLoading(true);
        fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
            .then(function handleResponse(res) { return res.json(); })
            .then(function handleData(data) {
                setPosts(data);
                setLoading(false);
            });
    }, []);

    // Test 6: Fetch with dependency + race condition prevention (ignore flag)
    useEffect(function fetchBioEffect() {
        let ignore = false;
        setBio(null);

        fetch(`https://jsonplaceholder.typicode.com/users?username=${selectedPerson}`)
            .then(function handleResponse(res) { return res.json(); })
            .then(function handleData(data) {
                if (!ignore) {
                    setBio(data[0]?.name || 'No bio found for ' + selectedPerson);
                }
            });

        return function cleanupBio() {
            ignore = true;
        };
    }, [selectedPerson]);

    // Test 7: Effect with no dependency array (runs every render)
    useEffect(function everyRenderEffect() {
        console.log('This runs after EVERY render');
    });

    return (
        <div className="max-w-2xl mx-auto p-6 dark:bg-gray-900">
            <h1 className="text-2xl font-bold dark:text-white mb-4">useEffect Tests</h1>

            {/* Test 1: Mount log — check console on page load */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 1: Mount/Unmount Log</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Check console for mount message. Navigate away to see unmount.</p>

            {/* Test 2: Keydown listener */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 2: Keydown Listener</h2>
            <input
                type="text"
                placeholder="Type then press Escape..."
                value={searchText}
                onChange={function handleSearch(e) {
                    setSearchText(e.target.value);
                }}
                className="w-1/2 p-3 border border-orange-600 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:bg-gray-800 dark:text-white dark:border-orange-500"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">{filteredVendors.length} vendors found</p>

            {/* Test 3: Interval — check console for ticks */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 3: Interval Timer</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Check console — logs every 5 seconds.</p>

            {/* Test 4: localStorage */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 4: localStorage Sync</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Type in search, refresh page — text persists.</p>

            {/* Vendor list toggle */}
            <button
                onClick={function handleToggle() {
                    setShowVendors(!showVendors);
                }}
                className="mt-2 mb-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                {showVendors ? 'Hide Vendors' : 'Show Vendors'}
            </button>

            {showVendors && (
                <ul className="space-y-2 mb-4">
                    {filteredVendors.map(function renderVendor(v) {
                        return (
                            <li key={v.CardCode} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg dark:text-white">
                                <span className="font-medium">{v.CardCode}</span> - {v.CardName}
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Test 5: Fetch posts on mount */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 5: Fetch on Mount</h2>
            <button
                onClick={function handleTogglePosts() {
                    setShowPosts(!showPosts);
                }}
                className="mb-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                {showPosts ? 'Hide Posts' : 'Show Posts'} {loading ? '(Loading...)' : `(${posts.length})`}
            </button>

            {showPosts && (
                <ul className="space-y-2 mb-4">
                    {posts.map(function renderPost(p: Post) {
                        return (
                            <li key={p.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg dark:text-white">
                                <span className="font-medium">{p.title}</span>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Test 6: Fetch with dependency + ignore flag */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 6: Fetch with Dep + Race Prevention</h2>
            <select
                value={selectedPerson}
                onChange={function handlePersonChange(e) {
                    setSelectedPerson(e.target.value);
                }}
                className="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600 mb-2"
            >
                <option value="Bret">Bret</option>
                <option value="Antonette">Antonette</option>
                <option value="Samantha">Samantha</option>
            </select>
            <p className="text-sm dark:text-white">{bio ?? 'Loading...'}</p>

            {/* Test 7: No dependency array */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 7: No Deps (Every Render)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Check console — logs after every single render. Type in search to trigger.</p>
        </div>
    );
}