const users = [
    {
        id: '1',
        name: 'Bhanu Teja',
        email: 'pbt@gmail.com',
        age: 22,
    },
    {
        id: '2',
        name: 'Bob',
        email: 'bob@example.com',
    },
    {
        id: '3',
        name: 'Mike',
        email: 'mike@abc.com',
    }
]

const posts = [
    {
        id: '4',
        title: 'Post 1',
        body: 'desc',
        published: true,
        author: '1',
    },
    {
        id: '5',
        title: 'Post 2',
        body: 'body',
        published: false,
        author: '1',
    },
    {
        id: '6',
        title: 'Post 3',
        body: 'description',
        published: true,
        author: '2',
    },
]

const comments = [
    {
        id: '7',
        text: 'Comment 1',
        author: '1',
        post: '4',
    },
    {
        id: '8',
        text: 'Comment 2',
        author: '2',
        post: '4',
    },
    {
        id: '9',
        text: 'Comment 3',
        author: '3',
        post: '5',
    },
    {
        id: '10',
        text: 'Comment 4',
        author: '1',
        post: '6',
    },
]

const db = {
    users,
    posts,
    comments,
}

export { db as default }