import Home from "pages/home";
import Notifications from "pages/notifications";
import Posts from "pages/posts";
import PostDetail from "pages/posts/detail";
import PostEdit from "pages/posts/edit";
import PostNew from "pages/posts/new";
import Profile from "pages/profile";
import ProfileEdit from "pages/profile/edit";
import Search from "pages/search";
import Login from "pages/users/login";
import Signup from "pages/users/signup";
import { Navigate, Route, Routes } from "react-router-dom";

interface RouterProps {
    isAuthenticated: boolean;
}

export default function Router({ isAuthenticated }: RouterProps) {
    return (
        <Routes>
            {isAuthenticated ? (
                <>
                    <Route path="/" element={<Home />} />
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/posts/:id" element={<PostDetail />} />
                    <Route path="/posts/new" element={<PostNew />} />
                    <Route path="/posts/edit/:id" element={<PostEdit />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<ProfileEdit />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="*" element={<Navigate replace to="/" />} />
                </>
            ) : (
                <>
                    <Route path="/users/login" element={<Login />} />
                    <Route path="/users/signup" element={<Signup />} />
                    <Route path="*" element={<Login />} />
                </>
            )}
        </Routes>
    );
}
