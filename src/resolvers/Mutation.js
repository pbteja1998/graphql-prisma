import uuidV4 from 'uuid/v4'

const Mutation = {
    createUser(parent, args, { db }, info) {
        const { email } = args.user;
        const emailTaken = db.users.some(user => user.email === email)

        if (emailTaken) {
            throw new Error('Email taken.')
        }

        const user = {
            id: uuidV4(),
            ...args.user
        }

        db.users.push(user)
        return user
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex(user => user.id === args.id)

        if(userIndex === -1) {
            throw new Error('User does not exist')
        }

        const deletedUsers = db.users.splice(userIndex, 1)

        db.posts = db.posts.filter(post => {
            if(post.author === args.id) {
                db.comments = db.comments.filter(comment => comment.post !== post.id)
                return false;
            }
            return true;
        })

        db.comments = db.comments.filter(comment => comment.author !== args.id)

        return deletedUsers[0]
    },
    updateUser(parent, { id, data: { name, email, age } }, { db }, info) {
        const user = db.users.find(user => user.id === id)

        if(!user) {
            throw new Error('User does not exist')
        }

        if(typeof email === 'string') {
            const emailTaken = db.users.some(user => user.email === email)

            if (emailTaken) {
                throw new Error('Email in use')
            }

            user.email = email
        }

        if(typeof name === 'string') {
            user.name = name
        }

        if(typeof age !== 'undefined') {
            user.age = age
        }

        return user
    },
    createPost(parent, args, { db, pubSub }, info) {
        const { author } = args.post;
        const userExists = db.users.some(user => user.id === author)

        if (!userExists) {
            throw new Error('Author does not exist')
        }

        const post = {
            id: uuidV4(),
            ...args.post
        }
        db.posts.push(post)
        if (post.published) {
            pubSub.publish(`post`, {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
             })
        }
        return post
    },
    deletePost(parent, args, { db, pubSub }, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id)

        if(postIndex === -1) {
            throw new Error('Post does not exist')
        }

        const deletedPosts = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter(comment => comment.post !== args.id)

        if (deletedPosts[0].published) {
            pubSub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deletedPosts[0]
                }
            })
        }

        return deletedPosts[0]
    },
    updatePost(parent, { id, data: { title, body, published } }, { db, pubSub }, info) {
        const post = db.posts.find(post => post.id === id)
        const originalPost = { ...post }

        if(!post) {
            throw new Error('Post does not exist')
        }

        if (typeof title === 'string') {
            post.title = title
        }

        if (typeof body === 'string') {
            post.body = body
        }

        if (typeof published === 'boolean' && originalPost.published !== published) {
            post.published = published

            if (originalPost.published && !published) {
                // deleted
                pubSub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if(!originalPost.published && published) {
                // created
                pubSub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if (post.published) {
            // updated
            pubSub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
    },
    createComment(parent, args, { db, pubSub }, info) {
        const { author, post } = args.comment;
        const userExists = db.users.some(user => user.id === author)
        const publishedPostExists = db.posts.some(somePost => somePost.id === post && somePost.published)

        if(!userExists) {
            throw new Error('user does not exist')
        }

        if(!publishedPostExists) {
            throw new Error('post does not exist or post is not published')
        }

        const comment = {
            id: uuidV4(),
            ...args.comment,
        }
        db.comments.push(comment)
        pubSub.publish(`comment ${post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })
        return comment
    },
    deleteComment(parent, args, { db, pubSub }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id)

        if(commentIndex === -1) {
            throw Error('Comment not found!')
        }

        const [ deletedComment ] = db.comments.splice(commentIndex, 1);

        pubSub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        })

        return deletedComment
    },
    updateComment(parent, { id, data: { text } }, { db, pubSub }, info) {
        const comment = db.comments.find(comment => comment.id === id)

        if (!comment) {
            throw new Error('Comment does not exist')
        }

        if (typeof text === 'string') {
            comment.text = text
        }

        pubSub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment
    }
}

export { Mutation as default }
