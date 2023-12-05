import "./App.css";
import "./pages/Page.css";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/Login/SignUp";
import ProtectedRoute from "./pages/ProtectedRoute";
import PageLoading from "./pages/PageLoading";
import Feed from "./pages/Feed/Feed";
import Explore from "./pages/Explore/Explore";
import Notifications from "./pages/Notifications/Notifications";
import Messages from "./pages/Messages/Messages";
import Bookmarks from "./pages/Bookmarks/Bookmarks";
import Lists from "./pages/Lists/Lists";
import Profile from "./pages/Profile.js/Profile";
import More from "./pages/More/More";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import OtherProfile from "./pages/Explore/OtherProfile/OtherProfile";
import { useState } from "react";
import Details from "./pages/Profile.js/Details/Details";
import OtherDetails from "./pages/Explore/OtherProfile/OtherDetails";
import TweetPage from "./pages/TweetPage/TweetPage";
import GroupMessages from "./pages/Messages/GroupMessages";
import ConversationPage from "./pages/Messages/MessagePage/ConversationPage";
import GroupConversationPage from "./pages/Messages/GroupPage/GroupConversationPage";

type User = {
  name: string;
  userName: string;
  email: string;
  private: boolean;
  profileImage: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  dob: string;
  _id: string;
};

function App() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <div className="App">
      <UserAuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            >
              <Route index element={<Feed />} />
            </Route>
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            >
              <Route path="feed" element={<Feed />} />
              <Route path="explore" element={<Outlet />}>
                <Route
                  path=""
                  element={<Explore users={users} setUsers={setUsers} />}
                />
                <Route path=":id" element={<OtherProfile />} />
                <Route path="followers/:id" element={<OtherDetails />} />
                <Route path="following/:id" element={<OtherDetails />} />
              </Route>
              <Route path="tweet/:id" element={<TweetPage />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="messages" element={<Outlet />}>
                <Route path="" element={<Messages />} />
                <Route path="group" element={<Outlet />}>
                  <Route path="" element={<GroupMessages />} />
                  <Route path=":id" element={<GroupConversationPage />} />
                </Route>
                <Route path=":id" element={<ConversationPage />} />
              </Route>
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="lists" element={<Lists />} />
              <Route path="profile" element={<Outlet />}>
                <Route path="" element={<Profile />} />
                <Route path="followers" element={<Details />} />
                <Route path="following" element={<Details />} />
              </Route>
              <Route path="more" element={<More />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="page-loading" element={<PageLoading />} />
          </Routes>
        </BrowserRouter>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
