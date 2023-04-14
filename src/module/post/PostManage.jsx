import React from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import { useState } from "react";
import { Table } from "../../components/table";
import { Dropdown } from "../../components/dropdown";
import { Button } from "../../components/button";
import { useEffect } from "react";
import { collection, doc, getDocs, limit, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import Swal from "sweetalert2";
import { LabelStatus } from "../../components/label";
import { postStatus } from "../../utils/constants";


const POST_PER_PAGE = 1;

const PostManage = () => {
  const [postList, setPostList] = useState([]);
  const [filter, setFilter] = useState("");
  const [lastdoc, setLastDoc] = useState();
  const navigate = useNavigate();
  useEffect(()=>{
    async function fetchData(){
      const colRef = collection(db, "posts");
      const newRef = filter 
        ? query(colRef, where("name", ">=", filter), where("name", "<=", filter + "utf8")) 
        : query(colRef, limit(POST_PER_PAGE));

      console.log("newRef", newRef);
      const documentSnapshots = await getDocs(newRef);

      // Get the last visible document
      const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];

      onSnapshot(newRef, snapshot =>{
        let results = [];
        snapshot.forEach(doc => {
          results.push({
            id: doc.id,
            ...doc.data()
          });
          setPostList(results);
        });
      });
      setLastDoc(lastVisible);
    }

    fetchData();
  }, [filter]);

  async function handleDeletePost(postId){
    const docRef = doc(db, "posts", postId);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(docRef);
        Swal.fire(
          'Deleted!',
          'Your post has been deleted.',
          'success'
        )
      }
    })
  }

  const renderPostStatus = (status) =>{
    switch (status) {
      case postStatus.APPROVED:
          return <LabelStatus type="success">Approved</LabelStatus>
      case postStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>
      case postStatus.REJECTED:
        return <LabelStatus type="danger">Rejected</LabelStatus>
      default:
        break;
    }
  }

  return (
    <div>
      <DashboardHeading
        title="All posts"
        desc="Manage all posts"
      ></DashboardHeading>
      <div className="mb-10 flex justify-end gap-5">
        <div className="w-full max-w-[200px]">
          <Dropdown>
            <Dropdown.Select placeholder="Category"></Dropdown.Select>
          </Dropdown>
        </div>
        <div className="w-full max-w-[300px]">
          <input
            type="text"
            className="w-full p-4 rounded-lg border border-solid border-gray-300"
            placeholder="Search post..."
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {postList.length > 0 && postList.map((post) => {
          const date = post?.createdAt?.seconds ? new Date(post?.createdAt?.seconds*1000) : new Date();
          const formatDate = new Date(date).toLocaleDateString('vi-VI');
          return (
          <tr key={post.id}>
            <td>{post.id?.slice(0,5) + "..."}</td>
            <td>
              <div className="flex items-center gap-x-3">
                <img
                  src={post.image}
                  alt=""
                  className="w-[66px] h-[55px] rounded-md object-cover"
                />
                <div className="flex-1 whitespace-pre-wrap">
                  <h3 className="font-semibold max-w-[300px]">{post.title}</h3>
                  <time className="text-sm text-gray-500">
                    Date: {formatDate}
                  </time>
                </div>
              </div>
            </td>
            <td>
              <span className="text-gray-500">{post.category?.name}</span>
            </td>
            <td>
              <span className="text-gray-500">{post.user?.username}</span>
            </td>
            <td>
              {renderPostStatus(post.status)}
            </td>
            <td>
              <div className="flex items-center gap-x-3 text-gray-500">
                  <ActionView onClick={() => navigate(`/${post.slug}`)}></ActionView>
                  <ActionEdit></ActionEdit>
                  <ActionDelete onClick={() => handleDeletePost(post.id)}></ActionDelete>
              </div>
            </td>
          </tr>
        )})}
        </tbody>
      </Table>
      <div className="mt-10 text-center">
        <Button className="mx-auto w-[200px]">Load more</Button>
      </div>
    </div>
  );
};

export default PostManage;