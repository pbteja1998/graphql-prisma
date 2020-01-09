const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users
        }

        return db.users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts;
        }
        return db.posts.filter(
            (post) => post.title.toLowerCase().includes(args.query.toLowerCase()) || 
            post.body.toLowerCase().includes(args.query.toLowerCase())
        )
    },
    comments(parent, args, { db }, info) {
        return db.comments
    },
    me() {
        return {
            id: "abc123",
            name: "Bhanu Teja",
            email: "pbt@gmail.com",
            age: 22
        }
    },
    post() {
        return {
            id: "#1",
            title: "Post 1",
            body: "Post 1 Body",
            published: false
        }
    },
}

export { Query as default }