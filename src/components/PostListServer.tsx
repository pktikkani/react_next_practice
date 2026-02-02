import PostListClient from "./PostListClient";

const API_URl = 'https://jsonplaceholder.typicode.com/posts'

async function fetchPosts(): Promise<Post[]> {
    const response = await fetch(
        `${API_URl}`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    const data: Post[] = await response.json();
    return data;
}

export default async function VendorListServer() {
    const posts: Post[] = await fetchPosts();

}