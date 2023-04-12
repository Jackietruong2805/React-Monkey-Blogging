import React from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import UserTable from "./UserTable";
import { Button } from "../../components/button";

const UserManage = () => {
  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      >
          <Button kind='ghost' to='/manage/add-user'>
              Add new user
          </Button>
      </DashboardHeading>
      
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;