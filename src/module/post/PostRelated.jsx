import React from 'react';
import Heading from '../../components/layout/Heading';
import { useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import PostItem from './PostItem';
import { useState } from 'react';
import { db } from '../../firebase/firebase-config';

const PostRelated = ({categoryId = ""}) => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const docRef = query(collection(db, "posts"), where("category.id", "==", categoryId));
        onSnapshot(docRef, snapshot => {
            const results = [];
            snapshot.forEach(doc => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                })
            });
            setPosts(results);
        })
        console.log("posts", posts);
    }, [categoryId]);
    if(!categoryId || posts.length <= 0) return null;
    return (
        <div className="post-related">
            <Heading>Bài viết liên quan</Heading>
            <div className="grid-layout grid-layout--primary">
                {posts.map(item => (
                    <PostItem key={item.id} data={item}></PostItem>
                ))}
            </div>
        </div>
    );
};

export default PostRelated;