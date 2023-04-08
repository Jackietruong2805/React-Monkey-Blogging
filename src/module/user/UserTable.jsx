import React from "react";
import { useState } from "react";
import Table from "../../components/table/Table";
import { db } from "../../firebase/firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { ActionDelete, ActionEdit } from "../../components/action";
import { useNavigate } from "react-router-dom";

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
  const renderUserItem = (user) => (
    <tr key={user.id}>
      <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
      <td className="whitespace-nowrap">
        <div className="flex items-center gap-x-3">
          <img
            src="https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
            alt=""
            className="w-10 h-10 object-cover rounded-md flex-shrink-0"
          />
          <div className="flex-1">
            <h3>{user?.fullname}</h3>
            <time className="text-sm text-gray-500">{new Date().toLocaleDateString()}</time>
          </div>
        </div>
      </td>
      <td>{user?.username}</td>
      <td title={user.email}>{user?.email.slice(0,10) + "..."}</td>
      <td>
        <div className="flex items-center gap-x-3">
          <ActionEdit
            onClick={() => navigate(`/manage/update-user/?id=${user.id}`)}
          ></ActionEdit>
          <ActionDelete
          // onClick={() => handleDeleteCategory(category.id)}
          ></ActionDelete>
        </div>
      </td>
      <td></td>
      <td></td>
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
