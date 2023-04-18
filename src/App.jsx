import UserUpdate from "./module/user/UserUpdate"
import UserProfile from "./module/user/UserProfile"
import UserManage from "./module/user/UserManage"
import UserAddNew from "./module/user/UserAddNew"
import SignUpPage from "./pages/SignUpPage"
import SignInPage from "./pages/SignInPage"
import PostUpdate from "./module/post/PostUpdate"
import PostManage from "./module/post/PostManage"
import PostDetailsPage from "./pages/PostDetailsPage"
import PostAddNew from "./module/post/PostAddNew"
import PageNotFound from "./pages/PageNotFound"
import HomePage from "./pages/HomePage"
import DashboardPage from "./pages/DashboardPage"
import DashboardLayout from "./module/dashboard/DashboardLayout"
import CategoryUpdate from "./module/category/CategoryUpdate"
import CategoryManage from "./module/category/CategoryManage"
import CategoryAddNew from "./module/category/CategoryAddNew"
import { Route, Routes, useParams } from "react-router-dom"
import { AuthProvider } from "./contexts/auth-context"
import { useState } from "react"
import CategoryPage from "./pages/CategoryPage"

// let {slug} = useParams();
// console.log("slug", slug);

function App() {
  const params = useParams();
  console.log("params", params);
  const [slugs, setSlugs] = useState("");
  function HandlePostDetailsPage(){
    let {slug} = useParams();
    setSlugs(slug);
    return <PostDetailsPage></PostDetailsPage>
  }
  return (
    <div>
      <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage></HomePage>}></Route>
            <Route path="/sign-up" element={<SignUpPage></SignUpPage>}></Route>
            <Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>
            <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
            <Route
              path="/category/:slug"
              element={<CategoryPage></CategoryPage>}
              key={slugs} 
          ></Route>
          <Route
              path="/:slug"
              element={<HandlePostDetailsPage></HandlePostDetailsPage>}
              key={slugs} 
          ></Route>
            <Route element={<DashboardLayout></DashboardLayout>}>
              <Route
                path="/dashboard"
                element={<DashboardPage></DashboardPage>}
              ></Route>
              <Route
                path="/manage/posts"
                element={<PostManage></PostManage>}
            ></Route>
              <Route
                path="/manage/add-post"
                element={<PostAddNew></PostAddNew>}
              ></Route>
              <Route
                path="/manage/update-post"
                element={<PostUpdate></PostUpdate>}
              ></Route>
              <Route
              path="/manage/category"
              element={<CategoryManage></CategoryManage>}
            ></Route>
              <Route
              path="/manage/add-category"
              element={<CategoryAddNew></CategoryAddNew>}
            ></Route>
            <Route
              path="/manage/update-category"
              element={<CategoryUpdate></CategoryUpdate>}
            ></Route>
            <Route
              path="/manage/user"
              element={<UserManage></UserManage>}
            ></Route>
            <Route
              path="/manage/add-user"
              element={<UserAddNew></UserAddNew>}
            ></Route>
            <Route
              path="/manage/update-user"
              element={<UserUpdate></UserUpdate>}
            ></Route>
            <Route
              path="/profile"
              element={<UserProfile></UserProfile>}
            ></Route>
          </Route>
          </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
