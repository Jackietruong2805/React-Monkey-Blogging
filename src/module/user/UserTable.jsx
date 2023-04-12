import Table from "../../components/table/Table";
import Swal from "sweetalert2";
import React from "react";
import { useState } from "react";
import { userRole, userStatus } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LabelStatus } from "../../components/label";
import { deleteUser } from "firebase/auth";
import { db } from "../../firebase/firebase-config";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { ActionDelete, ActionEdit } from "../../components/action";

const UserTable = () => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const colRef = collection(db, "users");
    onSnapshot(colRef, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserList(results);
    });
  }, []);

  const renderRoleLabel = (role) =>{
    switch(role){
      case userRole.ADMIN:
        return 'Admin';
      case userRole.MOD:
        return 'Moderator';
      case userRole.USER:
        return 'User';
      default:
        break;
    }
  }

  const renderLabelStatus = (status) =>{
    switch(status){
      case userStatus.ACTIVE:
        return <LabelStatus type='success'>Active</LabelStatus>;
      case userStatus.PENDING:
        return <LabelStatus type='warning'>Pending</LabelStatus>;
      case userStatus.BAN:
        return <LabelStatus type='danger'>Rejected</LabelStatus>;
      default:
        break;
    }
  }

  const handleDeleteUser = async (user)=>{
    const colRef = doc(db, "users", user.id)
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
        await deleteUser(user);
        toast.success("Delete user successfully")
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  };

  const renderUserItem = (user) => (
    <tr key={user.id}>
      <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
      <td className="whitespace-nowrap">
        <div className="flex items-center gap-x-3">
          <img
            src={user?.avatar}
            alt=""
            className="w-10 h-10 object-cover rounded-md flex-shrink-0"
          />
          <div className="flex-1">
            <h3>{user?.fullname}</h3>
            <time className="text-sm text-gray-500">{new Date(user?.createdAt?.seconds*1000).toLocaleDateString('vi-VI')}</time>
          </div>
        </div>
      </td>
      <td>{user?.username}</td>
      <td title={user.email}>{user?.email.slice(0,10) + "..."}</td>
      <td>
        {renderLabelStatus(Number(user?.status))}
      </td>
      <td>{renderRoleLabel(Number(user?.role))}</td>
      <td>
        <div className="flex items-center gap-x-3">
          <ActionEdit
            onClick={() => navigate(`/manage/update-user/?id=${user.id}`)}
          ></ActionEdit>
          <ActionDelete
            onClick={() => handleDeleteUser(user)}
          ></ActionDelete>
        </div>
      </td>
    </tr>
  );

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Info</th>
            <th>Username</th>
            <th>Email address</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 && userList.map((user) => renderUserItem(user))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserTable;
