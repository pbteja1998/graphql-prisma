import {Prisma} from "prisma-binding";

const prisma = new Prisma({
   typeDefs: "src/generated/prisma.graphql",
   endpoint: "http://localhost:4466"
});

// prisma.exists.Comment({
//    id: "ck568d5j800l50843xlw7hh0f"
// }).then(exists => {
//     console.log(exists);
// });

const createPostForUser = async (authorId, data) => {
    const userExists = await prisma.exists.User({
        id: authorId
    });

    if (!userExists) {
        throw new Error(`author with ${authorId} does not exist`)
    }

    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, '{ author { id name email posts { id title published } } }');

    return post.author;
};

// createPostForUser("ck565qy88002g0843z9u4nj76", {
//    title: "Great Books to Read",
//    body: "The war of art",
//     published: true
// }).then(user => {
//     console.log(JSON.stringify(user, undefined, 2));
// }).catch(error => {
//     console.log(error.message)
// });

const updatePostForUser = async (postId, data) => {
    const postExists = await prisma.exists.Post({
        id: postId
    });

    if (!postExists) {
        throw new Error(`post with ${postId} does not exist`)
    }

    const post = await prisma.mutation.updatePost({
        data,
        where: {
            id: postId
        }
    }, '{ author { id name email posts { id title published } } }');

    return post.author;
};

// updatePostForUser("ck576mlpm00rt0843bv8zp3z3", {
//    published: false
// }).then(user => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch(error => {
//     console.log(error.message);
// });
