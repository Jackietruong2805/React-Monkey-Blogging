import Table from "../../components/table/Table";
import Swal from 'sweetalert2';
import React, { useEffect, useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import {ActionView, ActionEdit, ActionDelete} from "../../components/action";
import { useNavigate } from "react-router-dom";
import { LabelStatus } from "../../components/label";
import { debounce } from "debounce";
import { db } from "../../firebase/firebase-config";
import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, query, startAfter, where } from "firebase/firestore";
import { categoryStatus } from "../../utils/constants";
import { Button } from "../../components/button";

const CATEGORY_PER_PAGE = 10;

const CategoryManage = () => {
  const [categoryList, setCategoryList] = useState([]);
  const navigate  = useNavigate();
  const [filter, setFilter] = useState("");
  const [lastDoc, setLastDoc] = useState();
  const [total, setTotal] = useState(0);
  const handleLoadMoreCategory = async ()=>{
    const nextRef = query(
        collection(db, "categories"),
        startAfter(lastDoc),
        limit(CATEGORY_PER_PAGE));
    
    onSnapshot(nextRef, snapshot =>{
      let results = [];
      snapshot.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data()
        });
        setCategoryList([...categoryList, ...results]);
      })
      console.log("categoryList", categoryList);
    })

    const documentSnapshots = await getDocs(nextRef);

      // Get the last visible document
      const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];

    setLastDoc(lastVisible);
  };
  useEffect(()=>{
    async function fetchData(){
      const colRef = collection(db, "categories");
      console.log("filter", filter);
      const newRef = filter 
        ? query(colRef, where("name", ">=", filter), where("name", "<=", filter + "utf8")) 
        : query(colRef, limit(CATEGORY_PER_PAGE));

      const documentSnapshots = await getDocs(newRef);

      // Get the last visible document
      const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];

      onSnapshot(colRef, snapshot =>{
        setTotal(snapshot.size);
      });

      onSnapshot(newRef, snapshot =>{
        let results = [];
        snapshot.forEach(doc => {
          results.push({
            id: doc.id,
            ...doc.data()
          });
          setCategoryList(results);
        })
        console.log("categoryList", categoryList);
      })
      setLastDoc(lastVisible);
    }

    fetchData();
  },[filter])

  const handleDeleteCategory = async (docId)=>{
    const colRef = doc(db, "categories", docId);
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
        await deleteDoc(colRef);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
    // console.log("docData", docData.data());
  }
  const handleInputFilter = debounce((e)=>{
    setFilter(e.target.value);
  }, 500);
  return (
    <div>
      <DashboardHeading
        title="Categories"
        desc="Manage your category"
      >
        <Button kind='ghost' height="60px" to="/manage/add-category">
          Create category
        </Button>
      </DashboardHeading>
      <div className="mb-10 flex justify-end">
        <input type="text" placeholder="Search category..." onChange={handleInputFilter} className="py-4 px-5 border border-gray-300 rounded-lg"/>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {categoryList.length > 0 && categoryList.map((category) => (
          <tr key={category.id}>
            <td>{category.id}</td>
            <td>{category.name}</td>
            <td>
              <span className="italic text-gray-400">{category.slug}</span>
            </td>
            <td>
              {category.status === categoryStatus.APPROVED && (
                <LabelStatus type='success'>Approved</LabelStatus>
              )}
              {category.status === categoryStatus.UNAPPROVED && (
                <LabelStatus type='warning'>Unapproved</LabelStatus>
              )}
            </td>
            <td>
              <div className="flex items-center gap-x-3">
                <ActionView></ActionView>
                <ActionEdit onClick={() => navigate(`/manage/update-category/?id=${category.id}`)}></ActionEdit>
                <ActionDelete onClick={() => handleDeleteCategory(category.id)}></ActionDelete>
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
      {total > categoryList.length &&(
        <div className="mt-10">
          <Button className="mx-auto" onClick={handleLoadMoreCategory}>Load more</Button>
        </div>
      )}
    </div>
  );
};

export default CategoryManage;